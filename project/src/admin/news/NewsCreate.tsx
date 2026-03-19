import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { NewsService } from './NewsService';
import ImageManager from '../../components/ImageManager';
import EstadosFinancierosPdfUploader from '../../components/EstadosFinancierosPdfUploader';
import { Plus, X, Send, Loader2, FileText, Calendar, Tag } from 'lucide-react';
import { Section, NewsImage, ImageDisplayOptions } from '../../types/news';

/* ─── Animation variants ─────────────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

const sectionVariants = {
  initial: { opacity: 0, y: 16, scale: 0.985 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0, scale: 0.96, y: -8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/* ─── Component ─────────────────────────────────────────────────── */
const NewsCreate: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [title,    setTitle]    = useState('');
  const [sections, setSections] = useState<Section[]>([
    { id: Date.now().toString(), images: [], text: '', videoUrl: '', pdf: undefined },
  ]);
  const [date,     setDate]     = useState('');
  const [category, setCategory] = useState('General');
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  /* ── Section handlers (logic unchanged) ── */
  const handleAddSection = () => {
    setSections([
      ...sections,
      { id: Date.now().toString(), images: [], text: '', videoUrl: '', pdf: undefined },
    ]);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (sections.length === 1) {
      toast.error('Debe haber al menos una sección.');
      return;
    }
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const handleSectionChange = (sectionId: string, field: keyof Section, value: any) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, [field]: value } : s))
    );
  };

  /* ── Image upload complete: receives final S3 URL from ImageManager ── */
  const handleImageUploadComplete = (sectionId: string, url: string, publicId: string) => {
    const id = Date.now().toString();
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              images: [
                ...s.images,
                {
                  id,
                  url,
                  publicId,
                  displayOptions: { size: 'medium', alignment: 'center', cropMode: 'cover', caption: '' },
                },
              ],
            }
          : s
      )
    );
  };

  const handleRemoveImage = (sectionId: string, imageId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, images: s.images.filter((img) => img.id !== imageId) }
          : s
      )
    );
  };

  const handleImageSettingsChange = (
    sectionId: string,
    imageId: string,
    setting: keyof ImageDisplayOptions,
    value: any
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              images: s.images.map((img) =>
                img.id === imageId
                  ? { ...img, displayOptions: { ...img.displayOptions, [setting]: value } }
                  : img
              ),
            }
          : s
      )
    );
  };

  const handlePdfUploaded = (sectionId: string, url: string, publicId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, pdf: url ? { url, publicId } : undefined }
          : s
      )
    );
  };

  /* ── Move image to index 0 (make portada) ── */
  const handleSetPortada = (sectionId: string, imageId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              images: [
                s.images.find((img) => img.id === imageId)!,
                ...s.images.filter((img) => img.id !== imageId),
              ],
            }
          : s
      )
    );
  };

  /* ── Submit (logic unchanged) ── */
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sections.some((s) => !s.text.trim())) {
      toast.error('Todas las secciones deben tener texto.');
      return;
    }
    if (sections.some((s) => s.images.some((img) => img.url.startsWith('blob:')))) {
      toast.error('Algunas imágenes no se han subido correctamente.');
      return;
    }
    setSubmitting(true);
    try {
      const cleanedSections = sections.map(({ id, ...s }) => ({
        text:     s.text,
        videoUrl: s.videoUrl || '',
        images:   s.images.map(({ id, ...img }) => ({
          url:       img.url,
          publicId:  img.publicId || '',
          displayOptions: {
            size:      img.displayOptions.size      || 'medium',
            alignment: img.displayOptions.alignment || 'center',
            cropMode:  img.displayOptions.cropMode  || 'cover',
            caption:   img.displayOptions.caption   || '',
          },
        })),
        pdf: s.pdf ? { url: s.pdf.url, publicId: s.pdf.publicId } : undefined,
      }));

      await NewsService.createNews({ title, sections: cleanedSections, date, category });
      toast.success('Noticia publicada con éxito!');
      onSuccess();
      setTitle('');
      setSections([{ id: Date.now().toString(), images: [], text: '', videoUrl: '', pdf: undefined }]);
      setDate('');
      setCategory('General');
    } catch (err) {
      toast.error('Error al publicar la noticia.');
      console.error('Error en handleAddNews:', err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── JSX ─────────────────────────────────────────────────────── */
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <form onSubmit={handleAddNews}>

        {/* ── Title card ────────────────────────────────────────── */}
        <div className="adm-card" style={{ marginBottom: 16 }}>
          <div className="adm-card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={14} style={{ color: 'var(--adm-ink-3)' }} />
            <span style={{ fontFamily: 'var(--adm-font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--adm-ink-3)', textTransform: 'uppercase' }}>
              Noticia
            </span>
            <span style={{
              marginLeft: 'auto',
              fontFamily: 'var(--adm-font-mono)',
              fontSize: 10,
              background: 'var(--adm-paper-2)',
              border: '1px solid var(--adm-rule)',
              borderRadius: 4,
              padding: '2px 8px',
              color: 'var(--adm-ink-3)',
            }}>
              {sections.length} {sections.length === 1 ? 'sección' : 'secciones'}
            </span>
          </div>
          <div className="adm-card-body">
            <label className="adm-label">Título de la noticia</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe el título aquí..."
              className="adm-input"
              style={{ fontSize: 15, fontWeight: 500 }}
              required
            />
          </div>
        </div>

        {/* ── Sections list ─────────────────────────────────────── */}
        <div ref={formRef}>
          <AnimatePresence initial={false}>
            {sections.map((section, idx) => (
              <motion.div
                key={section.id}
                variants={sectionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
                className="adm-card"
                style={{ marginBottom: 16 }}
              >
                {/* Section header */}
                <div className="adm-card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="adm-section-num">{idx + 1}</span>
                  <span style={{ fontFamily: 'var(--adm-font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--adm-ink-3)', textTransform: 'uppercase' }}>
                    Sección {idx + 1}
                  </span>
                  {sections.length > 1 && (
                    <motion.button
                      type="button"
                      onClick={() => handleRemoveSection(section.id)}
                      aria-label="Eliminar sección"
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.88 }}
                      style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 26,
                        height: 26,
                        border: '1px solid var(--adm-rule)',
                        borderRadius: 6,
                        background: 'transparent',
                        color: 'var(--adm-ink-3)',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'border-color 0.15s, color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--adm-red)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--adm-red)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--adm-rule)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--adm-ink-3)';
                      }}
                    >
                      <X size={12} />
                    </motion.button>
                  )}
                </div>

                {/* Section body */}
                <div className="adm-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Images */}
                  <div>
                    <label className="adm-label">Imágenes</label>
                    <ImageManager
                      section={section}
                      sectionIndex={idx}
                      onUploadComplete={(url, publicId) =>
                        handleImageUploadComplete(section.id, url, publicId)
                      }
                      onRemoveImage={(imageId) => handleRemoveImage(section.id, imageId)}
                      onSettingsChange={(imageId, setting, value) =>
                        handleImageSettingsChange(section.id, imageId, setting, value)
                      }
                      onSetPortada={(imageId) => handleSetPortada(section.id, imageId)}
                    />
                  </div>

                  {/* PDF */}
                  <div>
                    <label className="adm-label">Documento adjunto</label>
                    <EstadosFinancierosPdfUploader
                      onPdfUploaded={(url, publicId) => handlePdfUploaded(section.id, url, publicId)}
                      currentPdfUrl={section.pdf?.url}
                      title="PDF opcional"
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <label className="adm-label">Contenido de texto</label>
                    <textarea
                      value={section.text}
                      onChange={(e) => handleSectionChange(section.id, 'text', e.target.value)}
                      placeholder="Escribe el contenido de esta sección..."
                      className="adm-textarea"
                      style={{ minHeight: 140 }}
                      required
                    />
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="adm-label">URL de video <span style={{ fontWeight: 400, color: 'var(--adm-ink-4)' }}>(opcional)</span></label>
                    <input
                      type="text"
                      value={section.videoUrl || ''}
                      onChange={(e) => handleSectionChange(section.id, 'videoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="adm-input"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Add section button ────────────────────────────────── */}
        <motion.button
          type="button"
          onClick={handleAddSection}
          className="adm-add-section"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.975 }}
          style={{ marginBottom: 16 }}
        >
          <Plus size={14} />
          Añadir sección
        </motion.button>

        {/* ── Meta card (date + category) ───────────────────────── */}
        <div className="adm-card" style={{ marginBottom: 20 }}>
          <div className="adm-card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Tag size={14} style={{ color: 'var(--adm-ink-3)' }} />
            <span style={{ fontFamily: 'var(--adm-font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--adm-ink-3)', textTransform: 'uppercase' }}>
              Metadatos
            </span>
          </div>
          <div className="adm-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="adm-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={11} />
                  Fecha de publicación
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="adm-input"
                  required
                />
              </div>
              <div>
                <label className="adm-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Tag size={11} />
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="adm-select"
                >
                  <option value="General">General</option>
                  <option value="Académico">Académico</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Eventos">Eventos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Submit ───────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <motion.button
            type="submit"
            disabled={submitting}
            className="adm-btn adm-btn-primary"
            whileHover={submitting ? {} : { scale: 1.03 }}
            whileTap={submitting   ? {} : { scale: 0.96 }}
            style={{ minWidth: 160, justifyContent: 'center', gap: 8 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {submitting ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Loader2 size={14} style={{ animation: 'adm-spin 0.8s linear infinite' }} />
                  Publicando...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Send size={13} />
                  Publicar noticia
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

      </form>
    </motion.div>
  );
};

export default NewsCreate;
