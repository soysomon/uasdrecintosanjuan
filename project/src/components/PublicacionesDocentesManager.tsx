import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Book, Loader, X, FileText,
  Image as ImageIcon, Save, Upload, ExternalLink,
} from 'lucide-react';
import API_ROUTES from '../config/api';

// ── Interfaces ──────────────────────────────────────────────────
export interface PublicacionDocente {
  _id?: string;
  titulo: string;
  volumen: string;
  descripcion: string;
  anio: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  portadaUrl?: string;
  portadaPublicId?: string;
  isPublished: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

const emptyPublicacion: PublicacionDocente = {
  titulo: '',
  volumen: '',
  descripcion: '',
  anio: new Date().getFullYear().toString(),
  isPublished: true,
};

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.03, duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ─────────────────────────────────────────────────────────────── */

const PublicacionesDocentesManager: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<PublicacionDocente[]>([]);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMode, setFormMode]     = useState<'create' | 'edit'>('create');
  const [panelMode, setPanelMode]   = useState<'idle' | 'active'>('idle');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [uploadingPdf, setUploadingPdf]         = useState(false);
  const [uploadingPortada, setUploadingPortada] = useState(false);
  const [pdfProgress, setPdfProgress]           = useState(0);
  const [portadaProgress, setPortadaProgress]   = useState(0);

  const [currentPublicacion, setCurrentPublicacion] = useState<PublicacionDocente>(emptyPublicacion);

  useEffect(() => { fetchPublicaciones(); }, []);

  // ── Data fetching ──────────────────────────────────────────────
  const fetchPublicaciones = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ROUTES.PUBLICACIONES_DOCENTES);
      setPublicaciones(res.data);
    } catch (err) {
      toast.error('Error al cargar las publicaciones');
      console.error('Error fetching publicaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentPublicacion({ ...currentPublicacion, [name]: value });
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPublicacion({ ...currentPublicacion, isPublished: e.target.checked });
  };

  // ── Panel mode helpers ─────────────────────────────────────────
  const handleNewPublicacion = () => {
    setCurrentPublicacion({ ...emptyPublicacion });
    setFormMode('create');
    setPanelMode('active');
    setSelectedId(null);
  };

  const handleEditPublicacion = (pub: PublicacionDocente) => {
    setCurrentPublicacion({ ...pub });
    setFormMode('edit');
    setPanelMode('active');
    setSelectedId(pub._id || null);
  };

  const handleCancel = () => {
    setPanelMode('idle');
    setSelectedId(null);
  };

  // ── CRUD ───────────────────────────────────────────────────────
  const handleSavePublicacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPublicacion.titulo || !currentPublicacion.volumen) {
      toast.error('El título y el volumen son obligatorios');
      return;
    }
    setSubmitting(true);
    try {
      if (formMode === 'create') {
        await axios.post(API_ROUTES.PUBLICACIONES_DOCENTES, currentPublicacion);
        toast.success('Publicación creada correctamente');
      } else {
        await axios.put(API_ROUTES.PUBLICACION_DOCENTE_BY_ID(currentPublicacion._id!), currentPublicacion);
        toast.success('Publicación actualizada correctamente');
      }
      setPanelMode('idle');
      setSelectedId(null);
      fetchPublicaciones();
    } catch (err) {
      toast.error('Error al guardar la publicación');
      console.error('Error saving publicacion:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePublicacion = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) return;
    try {
      setLoading(true);
      await axios.delete(API_ROUTES.PUBLICACION_DOCENTE_BY_ID(id));
      toast.success('Publicación eliminada correctamente');
      if (selectedId === id) { setPanelMode('idle'); setSelectedId(null); }
      fetchPublicaciones();
    } catch (err) {
      setLoading(false);
      toast.error('Error al eliminar la publicación');
      console.error('Error deleting publicacion:', err);
    }
  };

  // ── PDF upload ─────────────────────────────────────────────────
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error('El PDF es demasiado grande. Tamaño máximo: 20MB');
      return;
    }
    if (file.type !== 'application/pdf') {
      toast.error('Por favor, sube un archivo PDF válido');
      return;
    }

    setUploadingPdf(true);
    setPdfProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(API_ROUTES.UPLOAD_PDF, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => {
          setPdfProgress(Math.round((ev.loaded * 100) / (ev.total || 100)));
        },
      });
      if (res.data.success) {
        setCurrentPublicacion({ ...currentPublicacion, pdfUrl: res.data.pdfUrl, pdfPublicId: res.data.public_id });
        toast.success('PDF subido correctamente');
      } else {
        toast.error('Error al subir el PDF');
      }
    } catch (err) {
      console.error('Error al subir PDF:', err);
      toast.error('Error al subir el PDF. Verifica el tamaño y formato.');
    } finally {
      setUploadingPdf(false);
    }
  };

  // ── Portada upload ─────────────────────────────────────────────
  const handlePortadaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Tamaño máximo: 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, sube una imagen válida');
      return;
    }

    setUploadingPortada(true);
    setPortadaProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(API_ROUTES.UPLOAD_IMAGE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => {
          setPortadaProgress(Math.round((ev.loaded * 100) / (ev.total || 100)));
        },
      });
      if (res.data.success) {
        setCurrentPublicacion({ ...currentPublicacion, portadaUrl: res.data.imageUrl, portadaPublicId: res.data.public_id });
        toast.success('Portada subida correctamente');
      } else {
        toast.error('Error al subir la portada');
      }
    } catch (err) {
      console.error('Error al subir portada:', err);
      toast.error('Error al subir la portada. Verifica el tamaño y formato.');
    } finally {
      setUploadingPortada(false);
    }
  };

  /* ─── render ─── */
  return (
    <div className="adm-slides-layout adm-section-enter">

      {/* ══ LEFT COLUMN ══════════════════════════════════════════ */}
      <div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div className="adm-page-label">Gestión de contenido</div>
            <h2 style={{
              fontFamily: "'Libre Baskerville', serif", fontSize: '1.3rem',
              fontWeight: 400, color: 'var(--adm-ink)', margin: 0, lineHeight: 1.3,
            }}>
              Publicaciones registradas
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 3 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
              color: 'var(--adm-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {publicaciones.length} {publicaciones.length === 1 ? 'publicación' : 'publicaciones'}
            </span>
            <button
              type="button"
              className="adm-btn adm-btn-primary adm-btn-sm"
              onClick={handleNewPublicacion}
            >
              <Plus size={11} /> Nueva publicación
            </button>
          </div>
        </div>

        {/* Publicaciones list */}
        <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>

          {/* Loading */}
          {loading && (
            <div style={{ padding: '52px 24px', textAlign: 'center' }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                color: 'var(--adm-ink-4)', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Cargando...
              </span>
            </div>
          )}

          {/* Empty */}
          {!loading && publicaciones.length === 0 && (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Book size={26} style={{ color: 'var(--adm-ink-4)', margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: 'var(--adm-ink-3)' }}>
                No hay publicaciones registradas
              </div>
            </div>
          )}

          {/* Rows */}
          {!loading && publicaciones.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div>
                {publicaciones.map((pub, i) => (
                  <motion.div
                    key={pub._id}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 20px', borderBottom: '1px solid var(--adm-rule)',
                      background: selectedId === pub._id ? 'var(--adm-paper-3)' : 'transparent',
                      transition: 'background 0.12s',
                      borderLeft: selectedId === pub._id
                        ? '2px solid var(--adm-blue)'
                        : '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedId !== pub._id)
                        e.currentTarget.style.background = 'var(--adm-paper-2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        selectedId === pub._id ? 'var(--adm-paper-3)' : 'transparent';
                    }}
                  >
                    {/* Cover thumbnail */}
                    <div style={{
                      width: 36, height: 48, borderRadius: 4, flexShrink: 0, marginRight: 14,
                      overflow: 'hidden', background: 'var(--adm-paper-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid var(--adm-rule)',
                    }}>
                      {pub.portadaUrl
                        ? <img src={pub.portadaUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <Book size={14} style={{ color: 'var(--adm-ink-4)' }} />
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0, marginRight: 14 }}>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500,
                        color: 'var(--adm-ink)', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4,
                      }}>
                        {pub.titulo}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                          color: 'var(--adm-ink-4)', letterSpacing: '0.04em',
                        }}>
                          {pub.volumen}{pub.anio ? ` · ${pub.anio}` : ''}
                        </span>
                        {pub.pdfUrl && (
                          <span className="adm-badge adm-badge-default">PDF</span>
                        )}
                        {!pub.isPublished && (
                          <span className="adm-badge adm-badge-default">No publicado</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleEditPublicacion(pub)}
                        className="adm-btn adm-btn-secondary adm-btn-sm"
                        title="Editar publicación"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePublicacion(pub._id!)}
                        className="adm-btn adm-btn-danger adm-btn-sm"
                        title="Eliminar publicación"
                        style={{ padding: '5px 9px' }}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ══ RIGHT COLUMN — Sticky config panel ═══════════════════ */}
      <div className="adm-slides-config">
        <AnimatePresence mode="wait">

          {/* ── Idle placeholder ── */}
          {panelMode === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div className="adm-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
                <Book size={28} style={{ color: 'var(--adm-ink-4)', margin: '0 auto 14px', display: 'block' }} />
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                  color: 'var(--adm-ink-3)', marginBottom: 18,
                }}>
                  Selecciona una publicación para editar o crea una nueva
                </div>
                <button
                  type="button"
                  className="adm-btn adm-btn-primary adm-btn-sm"
                  onClick={handleNewPublicacion}
                >
                  <Plus size={11} /> Nueva publicación
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Active form ── */}
          {panelMode === 'active' && (
            <motion.div
              key={formMode === 'create' ? 'create' : selectedId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>

                {/* Card header */}
                <div style={{
                  padding: '14px 20px', borderBottom: '1px solid var(--adm-rule)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div className="adm-page-label" style={{ marginBottom: 3 }}>
                      {formMode === 'create' ? 'Nueva publicación' : 'Editar publicación'}
                    </div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                      fontWeight: 500, color: 'var(--adm-ink)',
                    }}>
                      {formMode === 'create'
                        ? 'Nueva publicación'
                        : currentPublicacion.titulo || 'Sin título'
                      }
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="adm-btn adm-btn-secondary adm-btn-sm"
                    style={{ padding: '5px 8px' }}
                    title="Cerrar"
                  >
                    <X size={12} />
                  </button>
                </div>

                {/* Scrollable form body */}
                <form onSubmit={handleSavePublicacion}>
                  <div style={{
                    maxHeight: 'calc(100vh - 290px)',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'var(--adm-rule-dark) transparent',
                    padding: '20px',
                  }}>

                    {/* ── Información básica ── */}
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500,
                      letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                      color: 'var(--adm-ink-3)', marginBottom: 12,
                    }}>
                      Información básica
                    </div>

                    <div className="adm-grid-2" style={{ marginBottom: 10 }}>
                      <div className="adm-field">
                        <label className="adm-label">Título</label>
                        <input
                          type="text" name="titulo" value={currentPublicacion.titulo}
                          onChange={handleChange} className="adm-input"
                          placeholder="Ej: Conoce tus Docentes" required
                        />
                      </div>
                      <div className="adm-field">
                        <label className="adm-label">Volumen</label>
                        <input
                          type="text" name="volumen" value={currentPublicacion.volumen}
                          onChange={handleChange} className="adm-input"
                          placeholder="Ej: Volumen I" required
                        />
                      </div>
                    </div>

                    <div className="adm-field" style={{ marginBottom: 10 }}>
                      <label className="adm-label">Año de publicación</label>
                      <input
                        type="text" name="anio" value={currentPublicacion.anio}
                        onChange={handleChange} className="adm-input"
                        placeholder="Ej: 2024"
                      />
                    </div>

                    <div className="adm-field" style={{ marginBottom: 20 }}>
                      <label className="adm-label">Descripción</label>
                      <textarea
                        name="descripcion" value={currentPublicacion.descripcion}
                        onChange={handleChange} className="adm-input"
                        rows={3}
                        placeholder="Breve descripción de esta publicación..."
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    {/* ── Documento PDF ── */}
                    <div style={{ borderTop: '1px solid var(--adm-rule)', paddingTop: 16, marginBottom: 20 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12,
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500,
                        letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                        color: 'var(--adm-ink-3)',
                      }}>
                        <FileText size={11} /> Documento PDF
                      </div>

                      {currentPublicacion.pdfUrl ? (
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 14px', background: 'var(--adm-paper-2)',
                          border: '1px solid var(--adm-rule)', borderRadius: 6,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FileText size={16} style={{ color: 'var(--adm-red)', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: 'var(--adm-ink)', marginBottom: 2 }}>
                                Documento subido
                              </div>
                              <a
                                href={currentPublicacion.pdfUrl}
                                target="_blank" rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 4,
                                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                                  color: 'var(--adm-blue)', letterSpacing: '0.04em',
                                  textDecoration: 'none',
                                }}
                              >
                                Ver PDF <ExternalLink size={10} />
                              </a>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentPublicacion({ ...currentPublicacion, pdfUrl: undefined, pdfPublicId: undefined })}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-ink-4)', display: 'flex' }}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        <div className="adm-drop-zone" style={{ padding: '24px 20px', textAlign: 'center', position: 'relative' }}>
                          {uploadingPdf ? (
                            <div style={{ padding: '4px 0' }}>
                              <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                                color: 'var(--adm-ink-3)', letterSpacing: '0.06em',
                                marginBottom: 8,
                              }}>
                                <span>Subiendo PDF...</span>
                                <span>{pdfProgress}%</span>
                              </div>
                              <div style={{ width: '100%', height: 3, background: 'var(--adm-rule)', borderRadius: 2 }}>
                                <div style={{
                                  height: '100%', borderRadius: 2,
                                  background: 'var(--adm-blue)',
                                  width: `${pdfProgress}%`, transition: 'width 0.2s',
                                }} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <input
                                type="file" accept="application/pdf"
                                onChange={handlePdfUpload}
                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                              />
                              <Upload size={20} style={{ color: 'var(--adm-ink-4)', margin: '0 auto 8px', display: 'block' }} />
                              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--adm-ink-2)', fontWeight: 500, marginBottom: 4 }}>
                                Seleccionar archivo PDF
                              </div>
                              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--adm-ink-4)', letterSpacing: '0.06em' }}>
                                Formato: PDF · Máx. 20MB
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ── Imagen de portada ── */}
                    <div style={{ borderTop: '1px solid var(--adm-rule)', paddingTop: 16, marginBottom: 20 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12,
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500,
                        letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                        color: 'var(--adm-ink-3)',
                      }}>
                        <ImageIcon size={11} /> Imagen de portada
                      </div>

                      {currentPublicacion.portadaUrl ? (
                        <div style={{
                          background: 'var(--adm-paper-2)', border: '1px solid var(--adm-rule)',
                          borderRadius: 6, padding: 12,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: 'var(--adm-ink)' }}>
                              Portada actual
                            </div>
                            <button
                              type="button"
                              onClick={() => setCurrentPublicacion({ ...currentPublicacion, portadaUrl: undefined, portadaPublicId: undefined })}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-ink-4)', display: 'flex' }}
                            >
                              <X size={15} />
                            </button>
                          </div>
                          <div style={{
                            aspectRatio: '3/4', maxWidth: 120, margin: '0 auto',
                            overflow: 'hidden', borderRadius: 4,
                            border: '1px solid var(--adm-rule)',
                          }}>
                            <img
                              src={currentPublicacion.portadaUrl} alt="Portada"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="adm-drop-zone" style={{ padding: '24px 20px', textAlign: 'center', position: 'relative' }}>
                          {uploadingPortada ? (
                            <div style={{ padding: '4px 0' }}>
                              <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                                color: 'var(--adm-ink-3)', letterSpacing: '0.06em',
                                marginBottom: 8,
                              }}>
                                <span>Subiendo imagen...</span>
                                <span>{portadaProgress}%</span>
                              </div>
                              <div style={{ width: '100%', height: 3, background: 'var(--adm-rule)', borderRadius: 2 }}>
                                <div style={{
                                  height: '100%', borderRadius: 2,
                                  background: 'var(--adm-blue)',
                                  width: `${portadaProgress}%`, transition: 'width 0.2s',
                                }} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <input
                                type="file" accept="image/*"
                                onChange={handlePortadaUpload}
                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                              />
                              <ImageIcon size={20} style={{ color: 'var(--adm-ink-4)', margin: '0 auto 8px', display: 'block' }} />
                              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--adm-ink-2)', fontWeight: 500, marginBottom: 4 }}>
                                Seleccionar imagen de portada
                              </div>
                              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--adm-ink-4)', letterSpacing: '0.06em' }}>
                                Formatos: JPG, PNG · Máx. 5MB
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ── Estado de publicación ── */}
                    <div style={{ borderTop: '1px solid var(--adm-rule)', paddingTop: 16 }}>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13, color: 'var(--adm-ink-2)',
                      }}>
                        <input
                          type="checkbox"
                          checked={currentPublicacion.isPublished}
                          onChange={handlePublishedChange}
                          style={{ width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }}
                        />
                        Publicar (visible al público)
                      </label>
                    </div>

                  </div>

                  {/* Footer actions */}
                  <div style={{
                    padding: '14px 20px',
                    borderTop: '1px solid var(--adm-rule)',
                    display: 'flex', gap: 8,
                  }}>
                    <button
                      type="submit"
                      className="adm-btn adm-btn-primary"
                      disabled={submitting}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      {submitting ? (
                        <>
                          <Loader
                            size={11}
                            style={{ animation: 'adm-spin 0.7s linear infinite', flexShrink: 0 }}
                          />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save size={11} /> Guardar
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="adm-btn adm-btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};

export default PublicacionesDocentesManager;
