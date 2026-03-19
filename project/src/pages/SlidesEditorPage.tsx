// src/pages/SlidesEditorPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Upload, Loader, X, Check, AlertTriangle,
  Plus, Trash2, ArrowRight,
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API_ROUTES from '../config/api';
import AdminShell from '../components/admin/AdminShell';

/* ─── Types ─────────────────────────────────────────── */

interface Slide {
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  cta: { text: string; link: string };
  image: string;
  color: string;
  order: number;
  displayMode?: 'normal' | 'hover';
}

const DEFAULT_SLIDE: Omit<Slide, 'order'> = {
  title:       'Nuevo Slide',
  subtitle:    'NUEVO',
  description: 'Descripción del slide',
  cta:         { text: 'Más información', link: '/' },
  image:       '',
  color:       '#003087',
  displayMode: 'normal',
};

const tabVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0,       transition: { duration: 0.14 } },
};

/* ─── Component ─────────────────────────────────────── */

const SlidesEditorPage: React.FC = () => {
  const [slides, setSlides]                     = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex]         = useState(0);
  const [uploadProgress, setUploadProgress]     = useState<Record<string, number>>({});
  const [loading, setLoading]                   = useState(true);
  const [saving, setSaving]                     = useState(false);
  const [deleting, setDeleting]                 = useState<string | null>(null);
  const [hasChanges, setHasChanges]             = useState(false);

  /* Keep a reference to the last-saved state for "Resetear" */
  const savedRef = useRef<Slide[]>([]);

  useEffect(() => { fetchSlides(); }, []);

  /* ── Fetch ── */
  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ROUTES.SLIDES);
      const data: Slide[] = res.data.length > 0 ? res.data : [{ ...DEFAULT_SLIDE, order: 0 }];
      setSlides(data);
      savedRef.current = JSON.parse(JSON.stringify(data));
      setHasChanges(false);
    } catch {
      toast.error('Error al cargar los slides', {
        icon: <AlertTriangle size={16} style={{ color: 'var(--adm-red)' }} />,
      });
      setSlides([{ ...DEFAULT_SLIDE, order: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Update a field ── */
  const updateSlide = (index: number, patch: Partial<Slide>) => {
    setSlides((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
    setHasChanges(true);
  };

  /* ── Add ── */
  const handleAdd = () => {
    const next = [...slides, { ...DEFAULT_SLIDE, order: slides.length }];
    setSlides(next);
    setCurrentIndex(next.length - 1);
    setHasChanges(true);
  };

  /* ── Delete ── */
  const handleDelete = async (index: number) => {
    if (slides.length <= 1) { toast.error('Debe haber al menos un slide'); return; }
    if (!window.confirm('¿Eliminar este slide?')) return;

    const slide = slides[index];
    const key   = slide._id || `temp-${index}`;
    setDeleting(key);

    try {
      if (slide._id) await axios.delete(API_ROUTES.SLIDES_BY_ID(slide._id));
      const updated = slides
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, order: i }));
      setSlides(updated);
      savedRef.current = JSON.parse(JSON.stringify(updated));
      setCurrentIndex((i) => Math.min(i, updated.length - 1));
      setHasChanges(false);
      toast.success('Slide eliminado', { icon: <Check size={16} style={{ color: 'var(--adm-green)' }} /> });
    } catch {
      toast.error('Error al eliminar el slide');
    } finally {
      setDeleting(null);
    }
  };

  /* ── Upload image ── (logic unchanged) */
  const uploadImage = async (file: File) => {
    const slideKey = `slide-${currentIndex}`;
    setUploadProgress((prev) => ({ ...prev, [slideKey]: 0 }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(API_ROUTES.UPLOAD_IMAGE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total || 100));
          setUploadProgress((prev) => ({ ...prev, [slideKey]: pct }));
        },
      });
      if (res.data.success) {
        toast.success('Imagen subida correctamente', { icon: <Check size={16} style={{ color: 'var(--adm-green)' }} /> });
        updateSlide(currentIndex, { image: res.data.imageUrl });
        setTimeout(() => {
          setUploadProgress((prev) => { const n = { ...prev }; delete n[slideKey]; return n; });
        }, 800);
      } else {
        throw new Error(res.data.error || 'Error al subir');
      }
    } catch {
      toast.error('Error al subir la imagen. Intenta de nuevo.', {
        icon: <AlertTriangle size={16} style={{ color: 'var(--adm-red)' }} />,
      });
      setUploadProgress((prev) => { const n = { ...prev }; delete n[`slide-${currentIndex}`]; return n; });
    }
  };

  /* ── Save all ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      for (const slide of slides) {
        if (slide._id) {
          await axios.put(API_ROUTES.SLIDES_BY_ID(slide._id), slide);
        } else {
          const res = await axios.post(API_ROUTES.SLIDES, slide);
          slide._id = res.data._id;
        }
      }
      savedRef.current = JSON.parse(JSON.stringify(slides));
      setHasChanges(false);
      toast.success('Cambios guardados correctamente', { icon: <Check size={16} style={{ color: 'var(--adm-green)' }} /> });
      fetchSlides();
    } catch {
      toast.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  /* ── Reset current slide to last saved ── */
  const handleReset = () => {
    const saved = savedRef.current[currentIndex];
    if (!saved) return;
    setSlides((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...saved };
      return next;
    });
    setHasChanges(false);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <AdminShell title="Editor de slides" subtitle="MULTIMEDIA">
        <div className="adm-loading" style={{ height: '60vh' }}>
          <Loader className="animate-spin" size={22} style={{ color: 'var(--adm-ink-3)' }} />
          <span>Cargando slides…</span>
        </div>
      </AdminShell>
    );
  }

  const slide     = slides[currentIndex];
  const slideKey  = `slide-${currentIndex}`;
  const isUploading = uploadProgress[slideKey] !== undefined;
  const slideNum  = String(currentIndex + 1).padStart(2, '0');

  /* ── Topbar actions ── */
  const topbarRight = (
    <>
      <button onClick={handleAdd} className="adm-btn adm-btn-secondary adm-btn-sm">
        <Plus size={13} /> Añadir
      </button>
      {slides.length > 1 && (
        <button
          onClick={() => handleDelete(currentIndex)}
          disabled={deleting !== null}
          className="adm-btn adm-btn-danger adm-btn-sm"
        >
          {deleting ? <Loader className="animate-spin" size={12} /> : <Trash2 size={12} />}
          Eliminar
        </button>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="adm-btn adm-btn-primary adm-btn-sm"
      >
        {saving ? <Loader className="animate-spin" size={12} /> : <Save size={12} />}
        {saving ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </>
  );

  /* ─────────────────────────────────────────────────── */

  return (
    <AdminShell title="Editor de slides" subtitle="MULTIMEDIA" topbarRight={topbarRight}>

      <div className="adm-slides-layout adm-section-enter">

        {/* ══════════════════════════════════════
            LEFT COLUMN
        ══════════════════════════════════════ */}
        <div>

          {/* Page header */}
          <div style={{ marginBottom: 20 }}>
            <div className="adm-page-label">Multimedia</div>
            <h1 className="adm-page-title">
              Editor de <em style={{ fontStyle: 'italic', fontWeight: 400 }}>slides</em>
            </h1>
            <p className="adm-page-desc">
              {slides.length} {slides.length === 1 ? 'slide activo' : 'slides activos'}&nbsp;·&nbsp;
              haz clic en un slide para editar su configuración
            </p>
          </div>

          <hr className="adm-divider" style={{ marginTop: 0 }} />

          {/* Slides activos label */}
          <div className="adm-page-label" style={{ marginBottom: 12 }}>
            Slides activos
          </div>

          {/* ── Horizontal thumbnail strip ── */}
          <div className="adm-thumb-strip">
            {slides.map((s, i) => {
              const key = s._id || `temp-${i}`;
              const isActive = i === currentIndex;
              return (
                <div
                  key={i}
                  className={`adm-thumb-item${isActive ? ' active' : ''}`}
                  onClick={() => setCurrentIndex(i)}
                >
                  {/* Color bg */}
                  <div className="adm-thumb-item-bg" style={{ backgroundColor: s.color }} />
                  {/* Image overlay */}
                  {s.image && (
                    <img src={s.image} alt={s.title} className="adm-thumb-item-img" />
                  )}
                  {/* Number */}
                  <div className="adm-thumb-item-num">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {/* Delete */}
                  {slides.length > 1 && (
                    <button
                      className="adm-thumb-item-del"
                      onClick={(e) => { e.stopPropagation(); handleDelete(i); }}
                      disabled={deleting === key}
                      title="Eliminar slide"
                    >
                      {deleting === key
                        ? <Loader size={9} className="animate-spin" />
                        : <X size={9} />
                      }
                    </button>
                  )}
                </div>
              );
            })}
            {/* Add button */}
            <div
              className="adm-thumb-item"
              onClick={handleAdd}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--adm-paper-2)', flexShrink: 0 }}
            >
              <Plus size={16} style={{ color: 'var(--adm-ink-3)' }} />
            </div>
          </div>

          {/* ── Large preview ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div
                className="adm-slide-main-preview"
                style={{ backgroundColor: slide.color }}
              >
                {/* Background image */}
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                  />
                )}
                {/* Overlay for hover mode */}
                {slide.displayMode === 'hover' && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `${slide.color}cc`,
                    backdropFilter: 'blur(4px)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start', justifyContent: 'center',
                    padding: '28px 36px',
                  }}>
                    {slide.subtitle && (
                      <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '2px 10px', color: '#fff', fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                        {slide.subtitle}
                      </span>
                    )}
                    <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px' }}>{slide.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', margin: '0 0 16px', fontSize: 14, maxWidth: 420 }}>{slide.description}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600 }}>
                      {slide.cta.text} <ArrowRight size={12} />
                    </div>
                  </div>
                )}
                {/* Normal mode — content always visible */}
                {slide.displayMode !== 'hover' && (slide.title || slide.subtitle || slide.description) && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start', justifyContent: 'center',
                    padding: '28px 36px',
                  }}>
                    {slide.subtitle && (
                      <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '2px 10px', color: '#fff', fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                        {slide.subtitle}
                      </span>
                    )}
                    <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px' }}>{slide.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', margin: '0 0 16px', fontSize: 14, maxWidth: 420 }}>{slide.description}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600 }}>
                      {slide.cta.text} <ArrowRight size={12} />
                    </div>
                  </div>
                )}
                {/* Empty state label — shown only when no content to display */}
                {slide.displayMode !== 'hover' && !slide.title && !slide.subtitle && !slide.description && (
                  <span className="adm-slide-main-preview-label">
                    Vista previa · Slide {slideNum}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Image upload ── */}
          <div className="adm-page-label" style={{ marginBottom: 12 }}>
            Imagen del slide
          </div>

          {isUploading ? (
            <div className="adm-upload-zone" style={{ cursor: 'default' }}>
              <div className="adm-progress-wrap">
                <div className="adm-progress-header">
                  <span>Subiendo imagen…</span>
                  <span>{uploadProgress[slideKey]}%</span>
                </div>
                <div className="adm-progress">
                  <div className="adm-progress-fill" style={{ width: `${uploadProgress[slideKey]}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="adm-upload-zone">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
              />
              <Upload className="adm-upload-icon" size={24} />
              <span className="adm-upload-text">
                {slide.image ? 'Reemplazar imagen' : 'Seleccionar imagen'}
              </span>
              <span className="adm-upload-hint">JPG · PNG · 1920×680px</span>
            </div>
          )}

          {/* Image preview strip */}
          {slide.image && (
            <div className="adm-preview-wrap" style={{ marginTop: 12 }}>
              <img src={slide.image} alt="Vista previa" className="adm-preview-img" />
              <button
                type="button"
                className="adm-preview-remove"
                onClick={() => updateSlide(currentIndex, { image: '' })}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
            RIGHT COLUMN — config card (sticky)
        ══════════════════════════════════════ */}
        <div className="adm-slides-config">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="adm-card">
                {/* Card header */}
                <div className="adm-card-header">
                  <span className="adm-card-title" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Configuración · Slide {slideNum}
                  </span>
                  <span className="adm-badge adm-badge-default">{currentIndex + 1} / {slides.length}</span>
                </div>

                <div className="adm-card-body">
                  {/* Título */}
                  <div className="adm-field">
                    <label className="adm-label">Título</label>
                    <input
                      type="text"
                      className="adm-input"
                      value={slide.title}
                      onChange={(e) => updateSlide(currentIndex, { title: e.target.value })}
                      placeholder="Título del slide"
                    />
                  </div>

                  {/* Subtítulo */}
                  <div className="adm-field">
                    <label className="adm-label">Subtítulo</label>
                    <input
                      type="text"
                      className="adm-input"
                      value={slide.subtitle || ''}
                      onChange={(e) => updateSlide(currentIndex, { subtitle: e.target.value })}
                      placeholder="Ej: NUEVO, POSGRADOS"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="adm-field">
                    <label className="adm-label">Descripción</label>
                    <textarea
                      className="adm-input adm-textarea"
                      style={{ minHeight: 72 }}
                      value={slide.description}
                      onChange={(e) => updateSlide(currentIndex, { description: e.target.value })}
                      placeholder="Texto del slide"
                    />
                  </div>

                  {/* CTA */}
                  <div className="adm-field">
                    <label className="adm-label">Texto del botón CTA</label>
                    <input
                      type="text"
                      className="adm-input"
                      value={slide.cta.text}
                      onChange={(e) => updateSlide(currentIndex, { cta: { ...slide.cta, text: e.target.value } })}
                      placeholder="Más información"
                    />
                  </div>

                  <div className="adm-field">
                    <label className="adm-label">URL del botón</label>
                    <input
                      type="text"
                      className="adm-input"
                      value={slide.cta.link}
                      onChange={(e) => updateSlide(currentIndex, { cta: { ...slide.cta, link: e.target.value } })}
                      placeholder="/noticias/apertura-2025"
                    />
                  </div>

                  {/* Color */}
                  <div className="adm-field">
                    <label className="adm-label">Color de fondo</label>
                    <div className="adm-color-row">
                      <div className="adm-color-swatch">
                        <input
                          type="color"
                          value={slide.color}
                          onChange={(e) => updateSlide(currentIndex, { color: e.target.value })}
                        />
                      </div>
                      <input
                        type="text"
                        className="adm-input"
                        value={slide.color}
                        onChange={(e) => updateSlide(currentIndex, { color: e.target.value })}
                        style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5 }}
                      />
                    </div>
                  </div>

                  {/* Orden */}
                  <div className="adm-field">
                    <label className="adm-label">Orden</label>
                    <input
                      type="number"
                      className="adm-input"
                      value={slide.order}
                      onChange={(e) => updateSlide(currentIndex, { order: parseInt(e.target.value) || 0 })}
                      min={0}
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}
                    />
                  </div>

                  {/* Modo de visualización */}
                  <div className="adm-field">
                    <label className="adm-label">Modo de visualización</label>
                    <select
                      className="adm-input adm-select"
                      value={slide.displayMode || 'normal'}
                      onChange={(e) => updateSlide(currentIndex, { displayMode: e.target.value as 'normal' | 'hover' })}
                    >
                      <option value="normal">Normal — contenido siempre visible</option>
                      <option value="hover">Hover — revelar al pasar el cursor</option>
                    </select>
                  </div>

                  <hr className="adm-divider" />

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="adm-btn adm-btn-primary adm-btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                      {saving ? 'Guardando…' : 'Guardar cambios'}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={!hasChanges}
                      className="adm-btn adm-btn-secondary adm-btn-sm"
                    >
                      Resetear
                    </button>
                  </div>

                  {/* Changes indicator */}
                  <AnimatePresence>
                    {hasChanges && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.18 }}
                        style={{ marginTop: 10, textAlign: 'center' }}
                      >
                        <span
                          className="adm-changes-tab"
                          onClick={handleSave}
                          role="button"
                        >
                          Cambios sin guardar · guardar →
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      <Toaster position="bottom-right" />
    </AdminShell>
  );
};

export default SlidesEditorPage;
