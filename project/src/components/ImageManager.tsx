// src/components/ImageManager.tsx
import React, { useState, useRef } from 'react';
import {
  Upload, Image as ImageIcon, Settings, X, Star,
  AlignLeft, AlignCenter, AlignRight,
  Minimize, Maximize, AlertCircle, CheckCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ImageDisplayOptions, Section } from '../types/news';
import API_ROUTES from '../config/api';

/* ─── Types ──────────────────────────────────────────────────────── */
interface UploadingImage {
  id:       string;
  file:     File;
  preview:  string;
  progress: number;
  status:   'pending' | 'uploading' | 'success' | 'error';
  error?:   string;
}

/* ─── Compression util ───────────────────────────────────────────── */
const compressImage = (file: File): Promise<File> => {
  if (file.type === 'image/gif') return Promise.resolve(file);

  return new Promise((resolve) => {
    const img    = new Image();
    const blobUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      const MAX = 1920;
      let { width, height } = img;
      if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }

      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          const out = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, '.jpg'),
            { type: 'image/jpeg', lastModified: Date.now() }
          );
          resolve(out.size < file.size ? out : file);
        },
        'image/jpeg',
        0.82
      );
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); resolve(file); };
    img.src = blobUrl;
  });
};

/* ─── Component ─────────────────────────────────────────────────── */
const ImageManager: React.FC<{
  section:          Section;
  /** Called once per image after a successful S3 upload */
  onUploadComplete: (url: string, publicId: string) => void;
  onRemoveImage:    (imageId: string) => void;
  onSettingsChange: (imageId: string, setting: keyof ImageDisplayOptions, value: any) => void;
  /** 0-based index of this section; 0 = portada section */
  sectionIndex?: number;
  /** Reorder: move imageId to position 0 (make it portada) */
  onSetPortada?: (imageId: string) => void;
}> = ({ section, onUploadComplete, onRemoveImage, onSettingsChange, sectionIndex, onSetPortada }) => {

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [failedImages,    setFailedImages]     = useState<Set<string>>(new Set());
  const [uploadingImages, setUploadingImages]  = useState<UploadingImage[]>([]);
  const [dragOver,        setDragOver]         = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Image error handler ── */
  const handleImageError = (imageId: string) =>
    setFailedImages((prev) => new Set(prev).add(imageId));

  /* ── Core: compress → fetch → notify parent ── */
  const uploadOneFile = async (item: UploadingImage): Promise<void> => {
    // Mark as uploading
    setUploadingImages((prev) =>
      prev.map((i) => i.id === item.id ? { ...i, status: 'uploading', progress: 10 } : i)
    );

    try {
      const compressed = await compressImage(item.file);

      // Fake progress to 40% while waiting for network
      setUploadingImages((prev) =>
        prev.map((i) => i.id === item.id ? { ...i, progress: 40 } : i)
      );

      const formData = new FormData();
      formData.append('file', compressed);

      const res  = await fetch(API_ROUTES.UPLOAD_IMAGE, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir la imagen');

      // Mark success
      setUploadingImages((prev) =>
        prev.map((i) => i.id === item.id ? { ...i, status: 'success', progress: 100 } : i)
      );

      // Tell NewsCreate the final S3 URL
      onUploadComplete(data.imageUrl, data.public_id);

      // Remove thumb after a brief success flash
      setTimeout(() => {
        setUploadingImages((prev) => prev.filter((i) => i.id !== item.id));
        URL.revokeObjectURL(item.preview);
      }, 1400);

    } catch (err: any) {
      setUploadingImages((prev) =>
        prev.map((i) => i.id === item.id ? { ...i, status: 'error', error: err.message } : i)
      );
      toast.error(`Error al subir ${item.file.name}`);
      setTimeout(() => {
        setUploadingImages((prev) => prev.filter((i) => i.id !== item.id));
        URL.revokeObjectURL(item.preview);
      }, 3000);
      throw err;
    }
  };

  /* ── Concurrency-limited runner (max 3 simultaneous) ── */
  const processAll = async (items: UploadingImage[]): Promise<void> => {
    const MAX     = 3;
    const queue   = [...items];
    const running: Promise<void>[] = [];

    while (queue.length > 0 || running.length > 0) {
      while (running.length < MAX && queue.length > 0) {
        const item = queue.shift()!;
        const p = uploadOneFile(item)
          .catch(() => { /* error already handled + toasted inside uploadOneFile */ })
          .finally(() => { running.splice(running.indexOf(p), 1); });
        running.push(p);
      }
      if (running.length > 0) await Promise.race(running);
    }
  };

  /* ── File selection ── */
  const handleFilesSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const MAX_SIZE = 30 * 1024 * 1024;
    const ALLOWED  = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    const arr = Array.from(files).filter((f) => {
      if (f.size > MAX_SIZE)         { toast.error(`${f.name}: demasiado grande (máx 30 MB)`); return false; }
      if (!ALLOWED.includes(f.type)) { toast.error(`${f.name}: formato no válido`);             return false; }
      return true;
    });

    if (arr.length === 0) return;

    // Build uploading items
    const items: UploadingImage[] = arr.map((f) => ({
      id:       `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file:     f,
      preview:  URL.createObjectURL(f),
      progress: 0,
      status:   'pending' as const,
    }));

    setUploadingImages((prev) => [...prev, ...items]);
    await processAll(items);
  };

  /* ── Derived state ── */
  const isUploading   = uploadingImages.length > 0;
  const successCount  = uploadingImages.filter((i) => i.status === 'success').length;
  const errorCount    = uploadingImages.filter((i) => i.status === 'error').length;
  const totalProgress = uploadingImages.length
    ? Math.round(uploadingImages.reduce((s, i) => s + i.progress, 0) / uploadingImages.length)
    : 0;

  /* ─── JSX ─────────────────────────────────────────────────────── */
  return (
    <div>

      {/* ── Drop zone ──────────────────────────────────────────── */}
      <div
        className={`adm-drop-zone${dragOver ? ' drag-over' : ''}${isUploading ? ' uploading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFilesSelect(e.dataTransfer.files); }}
      >
        {/* Scan line while uploading */}
        {isUploading && <div className="adm-drop-scan" />}

        {/* Hidden file input (hidden while uploading to prevent re-trigger) */}
        {!isUploading && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
            onChange={(e) => { handleFilesSelect(e.target.files); e.target.value = ''; }}
          />
        )}

        {/* Idle state */}
        {!isUploading && (
          <div className="adm-drop-idle">
            <div className="adm-drop-icon"><Upload size={20} /></div>
            <p className="adm-drop-label">
              {section.images.length > 0 ? 'Añadir más imágenes' : 'Arrastra o haz clic para subir'}
            </p>
            <p className="adm-drop-hint">JPG · PNG · GIF · WebP · hasta 30 MB · múltiples archivos</p>
          </div>
        )}

        {/* Progress bar while uploading */}
        {isUploading && (
          <div className="adm-drop-progress-wrap">
            <div className="adm-drop-progress-row">
              <span className="adm-drop-progress-label">
                {uploadingImages.length === 1
                  ? 'Subiendo imagen...'
                  : `${uploadingImages.length} imágenes`}
                {successCount > 0 && (
                  <span style={{ color: 'var(--adm-green)', marginLeft: 8 }}>
                    <CheckCircle size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                    {successCount} lista{successCount !== 1 ? 's' : ''}
                  </span>
                )}
                {errorCount > 0 && (
                  <span style={{ color: 'var(--adm-red)', marginLeft: 8 }}>
                    <AlertCircle size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                    {errorCount} error{errorCount !== 1 ? 'es' : ''}
                  </span>
                )}
              </span>
              <span className="adm-drop-progress-pct">{totalProgress}%</span>
            </div>
            <div className="adm-progress">
              <div className="adm-progress-fill" style={{ width: `${totalProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Upload thumbnail strip ──────────────────────────────── */}
      {uploadingImages.length > 0 && (
        <div className="adm-upload-strip">
          {uploadingImages.map((img) => (
            <div key={img.id} className={`adm-upload-thumb ${img.status}`}>
              {/* Shimmer skeleton for pending/uploading */}
              {(img.status === 'pending' || img.status === 'uploading') && (
                <div className="adm-img-skeleton" style={{ position: 'absolute', inset: 0 }} />
              )}
              {/* Preview */}
              <img
                src={img.preview}
                alt=""
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  opacity: img.status === 'success' ? 1 : 0.35,
                  transition: 'opacity 0.3s ease',
                }}
              />
              {/* Status overlay */}
              <div className="adm-upload-thumb-overlay">
                {img.status === 'uploading' && <div className="adm-upload-spinner" />}
                {img.status === 'success'   && <CheckCircle  size={20} color="#ffffff" />}
                {img.status === 'error'     && <AlertCircle  size={20} color="#ffffff" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Uploaded images ────────────────────────────────────── */}
      {section.images.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div className="adm-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <ImageIcon size={11} />
            Imágenes en la sección ({section.images.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {section.images.map((image, imgIdx) => {
              const hasFailed = failedImages.has(image.id);
              return (
                <div key={image.id} className="adm-img-card">

                  {/* Image container */}
                  <div className="adm-img-container">
                    {hasFailed ? (
                      <div className="adm-img-error">
                        <AlertCircle size={20} style={{ color: 'var(--adm-red)', marginBottom: 6 }} />
                        <span>No se pudo cargar la imagen</span>
                      </div>
                    ) : (
                      <img
                        src={image.url}
                        alt="Vista previa"
                        className="adm-img-reveal"
                        style={{
                          width: '100%', height: 200, display: 'block',
                          objectFit:
                            image.displayOptions.cropMode === 'contain' ? 'contain'
                            : image.displayOptions.cropMode === 'none'   ? 'none'
                            : 'cover',
                        }}
                        onError={() => handleImageError(image.id)}
                      />
                    )}

                    {/* Portada badge — first image of the first section */}
                    {sectionIndex === 0 && imgIdx === 0 && (
                      <div style={{
                        position: 'absolute', top: 10, left: 10,
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: 'rgba(45,106,45,0.88)', backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(45,106,45,0.45)', color: '#fff',
                        fontFamily: 'var(--adm-font-mono)', fontSize: 10,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: 4, pointerEvents: 'none',
                      }}>
                        <Star size={9} style={{ fill: '#fff', flexShrink: 0 }} />
                        Portada
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                      {/* Set-as-portada button — only on non-first images of the first section */}
                      {sectionIndex === 0 && imgIdx !== 0 && onSetPortada && (
                        <button
                          type="button"
                          onClick={() => onSetPortada(image.id)}
                          title="Usar como portada"
                          style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'rgba(0,0,0,0.55)', border: 'none',
                            color: '#fff', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(4px)', transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(140,95,0,0.88)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
                        >
                          <Star size={12} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedImageId(selectedImageId === image.id ? null : image.id)}
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.55)', border: 'none',
                          color: '#fff', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          backdropFilter: 'blur(4px)', transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.8)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
                      >
                        <Settings size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveImage(image.id)}
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.55)', border: 'none',
                          color: '#fff', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          backdropFilter: 'blur(4px)', transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(163,31,52,0.9)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Caption */}
                  {image.displayOptions.caption && (
                    <p style={{ fontSize: 12, color: 'var(--adm-ink-3)', textAlign: 'center', padding: '6px 12px', fontStyle: 'italic' }}>
                      {image.displayOptions.caption}
                    </p>
                  )}

                  {/* Settings panel */}
                  {selectedImageId === image.id && (
                    <div className="adm-img-settings">
                      {/* Size */}
                      <div className="adm-img-settings-row">
                        <span className="adm-label" style={{ marginBottom: 0, minWidth: 72 }}>Tamaño</span>
                        <div className="adm-toggle-group">
                          {(['small', 'medium', 'large', 'full'] as const).map((s) => (
                            <button key={s} type="button"
                              onClick={() => onSettingsChange(image.id, 'size', s)}
                              className={`adm-toggle-btn${image.displayOptions.size === s ? ' active' : ''}`}
                            >
                              {s === 'small' ? <Minimize size={13} />
                               : s === 'large' ? <Maximize size={13} />
                               : s === 'full'  ? <span style={{ fontSize: 10, fontFamily: 'var(--adm-font-mono)' }}>100%</span>
                               : <ImageIcon size={13} />}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Alignment */}
                      <div className="adm-img-settings-row">
                        <span className="adm-label" style={{ marginBottom: 0, minWidth: 72 }}>Alineación</span>
                        <div className="adm-toggle-group">
                          {(['left', 'center', 'right'] as const).map((a) => (
                            <button key={a} type="button"
                              onClick={() => onSettingsChange(image.id, 'alignment', a)}
                              className={`adm-toggle-btn${image.displayOptions.alignment === a ? ' active' : ''}`}
                            >
                              {a === 'left' ? <AlignLeft size={13} /> : a === 'right' ? <AlignRight size={13} /> : <AlignCenter size={13} />}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Crop */}
                      <div className="adm-img-settings-row">
                        <span className="adm-label" style={{ marginBottom: 0, minWidth: 72 }}>Recorte</span>
                        <div className="adm-toggle-group">
                          {(['cover', 'contain', 'none'] as const).map((c) => (
                            <button key={c} type="button"
                              onClick={() => onSettingsChange(image.id, 'cropMode', c)}
                              className={`adm-toggle-btn${image.displayOptions.cropMode === c ? ' active' : ''}`}
                              style={{ fontSize: 11, padding: '5px 10px' }}
                            >
                              {c === 'cover' ? 'Cubrir' : c === 'contain' ? 'Contener' : 'Original'}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Caption */}
                      <div className="adm-img-settings-row" style={{ alignItems: 'flex-start' }}>
                        <span className="adm-label" style={{ marginBottom: 0, minWidth: 72, paddingTop: 2 }}>Leyenda</span>
                        <input
                          type="text"
                          value={image.displayOptions.caption || ''}
                          onChange={(e) => onSettingsChange(image.id, 'caption', e.target.value)}
                          placeholder="Añadir leyenda..."
                          className="adm-input"
                          style={{ flex: 1, fontSize: 12 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;
