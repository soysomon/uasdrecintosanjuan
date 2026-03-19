import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, User, Loader, X, Search,
  GraduationCap, Briefcase, Award, Calendar, Globe, Save, Youtube,
} from 'lucide-react';
import DocenteImgUploader from './DocenteImgUploader';
import API_ROUTES from '../config/api';

// ── Interfaces ──────────────────────────────────────────────────
export interface DocenteItem {
  _id?: string;
  nombre: string;
  apellidos: string;
  slug: string;
  tipo: 'residente' | 'no_residente';
  cargo?: string;
  especialidad?: string;
  departamento?: string;
  fotoPerfil?: string;
  fotoPublicId?: string;
  videoUrl?: string;
  descripcionGeneral?: string;
  educacion?: { titulo: string; institucion: string; anio: string }[];
  idiomas?: string[];
  experienciaProfesional?: { cargo: string; institucion: string; periodo: string }[];
  reconocimientos?: { titulo: string; otorgadoPor: string; anio: string }[];
  participacionEventos?: { nombre: string; lugar: string; anio: string }[];
  order?: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const emptyDocente: DocenteItem = {
  nombre: '', apellidos: '', slug: '', tipo: 'residente',
  cargo: '', especialidad: '', departamento: '',
  descripcionGeneral: '', videoUrl: '',
  educacion: [], idiomas: [],
  experienciaProfesional: [], reconocimientos: [], participacionEventos: [],
  isPublished: true,
};

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.03, duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ── Section title helper ─────────────────────────────────────────
const SectionTitle: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
    fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500,
    letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--adm-ink-3)',
  }}>
    <Icon size={11} />
    {label}
  </div>
);

// ── Array item row helper ────────────────────────────────────────
const ArrayItem: React.FC<{
  main: string; sub?: string; onRemove: () => void;
}> = ({ main, sub, onRemove }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: '8px 10px', background: 'var(--adm-paper-2)',
    border: '1px solid var(--adm-rule)', borderRadius: 6, marginBottom: 6,
  }}>
    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 500,
        color: 'var(--adm-ink)',
      }}>{main}</div>
      {sub && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          color: 'var(--adm-ink-3)', letterSpacing: '0.04em',
        }}>{sub}</div>
      )}
    </div>
    <button
      type="button" onClick={onRemove}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--adm-ink-4)', padding: '0 0 0 8px', flexShrink: 0, display: 'flex',
      }}
    >
      <X size={13} />
    </button>
  </div>
);

// ── AddForm helper ───────────────────────────────────────────────
const AddFormBox: React.FC<{ children: React.ReactNode; onAdd: () => void; label: string }> = ({
  children, onAdd, label,
}) => (
  <div style={{
    background: 'var(--adm-paper)', border: '1px solid var(--adm-rule)',
    borderRadius: 6, padding: 10,
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
      {children}
    </div>
    <button
      type="button" onClick={onAdd}
      className="adm-btn adm-btn-secondary adm-btn-sm"
      style={{ width: '100%', justifyContent: 'center' }}
    >
      <Plus size={11} /> {label}
    </button>
  </div>
);

// ── Section divider ──────────────────────────────────────────────
const SectionDivider: React.FC<{
  icon: React.ElementType; label: string; children: React.ReactNode;
}> = ({ icon, label, children }) => (
  <div style={{ borderTop: '1px solid var(--adm-rule)', paddingTop: 16, marginBottom: 20 }}>
    <SectionTitle icon={icon} label={label} />
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────────── */

const DocentesManager: React.FC = () => {
  const [docentes, setDocentes]     = useState<DocenteItem[]>([]);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMode, setFormMode]     = useState<'create' | 'edit'>('create');
  const [panelMode, setPanelMode]   = useState<'idle' | 'active'>('idle');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'residente' | 'no_residente'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDocente, setCurrentDocente] = useState<DocenteItem>(emptyDocente);

  // Array item temp states
  const [newEducacion, setNewEducacion]         = useState({ titulo: '', institucion: '', anio: '' });
  const [newExperiencia, setNewExperiencia]     = useState({ cargo: '', institucion: '', periodo: '' });
  const [newReconocimiento, setNewReconocimiento] = useState({ titulo: '', otorgadoPor: '', anio: '' });
  const [newEvento, setNewEvento]               = useState({ nombre: '', lugar: '', anio: '' });
  const [newIdioma, setNewIdioma]               = useState('');

  useEffect(() => { fetchDocentes(); }, []);

  // ── Data fetching ──────────────────────────────────────────────
  const fetchDocentes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ROUTES.DOCENTES);
      setDocentes(res.data);
    } catch (err) {
      toast.error('Error al cargar los docentes');
      console.error('Error fetching docentes:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Slug generation ────────────────────────────────────────────
  const generateSlug = (nombre: string, apellidos: string) =>
    `${nombre.toLowerCase()} ${apellidos.toLowerCase()}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...currentDocente, [name]: value };
    if (name === 'nombre' || name === 'apellidos') {
      updated.slug = generateSlug(
        name === 'nombre' ? value : currentDocente.nombre,
        name === 'apellidos' ? value : currentDocente.apellidos,
      );
    }
    setCurrentDocente(updated);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentDocente({ ...currentDocente, [name]: value });
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDocente({ ...currentDocente, isPublished: e.target.checked });
  };

  // ── Panel mode helpers ─────────────────────────────────────────
  const resetNewFields = () => {
    setNewEducacion({ titulo: '', institucion: '', anio: '' });
    setNewExperiencia({ cargo: '', institucion: '', periodo: '' });
    setNewReconocimiento({ titulo: '', otorgadoPor: '', anio: '' });
    setNewEvento({ nombre: '', lugar: '', anio: '' });
    setNewIdioma('');
  };

  const handleNewDocente = () => {
    setCurrentDocente({ ...emptyDocente });
    setFormMode('create');
    setPanelMode('active');
    setSelectedId(null);
    resetNewFields();
  };

  const handleEditDocente = (docente: DocenteItem) => {
    setCurrentDocente({ ...docente });
    setFormMode('edit');
    setPanelMode('active');
    setSelectedId(docente._id || null);
    resetNewFields();
  };

  const handleCancel = () => {
    setPanelMode('idle');
    setSelectedId(null);
  };

  // ── CRUD ───────────────────────────────────────────────────────
  const handleSaveDocente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDocente.nombre || !currentDocente.apellidos || !currentDocente.slug) {
      toast.error('El nombre y apellidos son obligatorios');
      return;
    }
    setSubmitting(true);
    try {
      if (formMode === 'create') {
        await axios.post(API_ROUTES.DOCENTES, currentDocente);
        toast.success('Docente creado correctamente');
      } else {
        await axios.put(API_ROUTES.DOCENTES_BY_ID(currentDocente._id!), currentDocente);
        toast.success('Docente actualizado correctamente');
      }
      setPanelMode('idle');
      setSelectedId(null);
      fetchDocentes();
    } catch (err) {
      toast.error('Error al guardar el docente');
      console.error('Error saving docente:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDocente = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este docente?')) return;
    try {
      setLoading(true);
      await axios.delete(API_ROUTES.DOCENTES_BY_ID(id));
      toast.success('Docente eliminado correctamente');
      if (selectedId === id) { setPanelMode('idle'); setSelectedId(null); }
      fetchDocentes();
    } catch (err) {
      setLoading(false);
      toast.error('Error al eliminar el docente');
      console.error('Error deleting docente:', err);
    }
  };

  const handleImageUploaded = (url: string, publicId: string) => {
    setCurrentDocente({ ...currentDocente, fotoPerfil: url, fotoPublicId: publicId });
  };

  // ── Array operations ───────────────────────────────────────────
  const addEducacion = () => {
    if (!newEducacion.titulo || !newEducacion.institucion) return;
    setCurrentDocente({ ...currentDocente, educacion: [...(currentDocente.educacion || []), { ...newEducacion }] });
    setNewEducacion({ titulo: '', institucion: '', anio: '' });
  };
  const removeEducacion = (i: number) => {
    const arr = [...(currentDocente.educacion || [])]; arr.splice(i, 1);
    setCurrentDocente({ ...currentDocente, educacion: arr });
  };

  const addExperiencia = () => {
    if (!newExperiencia.cargo || !newExperiencia.institucion) return;
    setCurrentDocente({ ...currentDocente, experienciaProfesional: [...(currentDocente.experienciaProfesional || []), { ...newExperiencia }] });
    setNewExperiencia({ cargo: '', institucion: '', periodo: '' });
  };
  const removeExperiencia = (i: number) => {
    const arr = [...(currentDocente.experienciaProfesional || [])]; arr.splice(i, 1);
    setCurrentDocente({ ...currentDocente, experienciaProfesional: arr });
  };

  const addReconocimiento = () => {
    if (!newReconocimiento.titulo) return;
    setCurrentDocente({ ...currentDocente, reconocimientos: [...(currentDocente.reconocimientos || []), { ...newReconocimiento }] });
    setNewReconocimiento({ titulo: '', otorgadoPor: '', anio: '' });
  };
  const removeReconocimiento = (i: number) => {
    const arr = [...(currentDocente.reconocimientos || [])]; arr.splice(i, 1);
    setCurrentDocente({ ...currentDocente, reconocimientos: arr });
  };

  const addEvento = () => {
    if (!newEvento.nombre || !newEvento.lugar) return;
    setCurrentDocente({ ...currentDocente, participacionEventos: [...(currentDocente.participacionEventos || []), { ...newEvento }] });
    setNewEvento({ nombre: '', lugar: '', anio: '' });
  };
  const removeEvento = (i: number) => {
    const arr = [...(currentDocente.participacionEventos || [])]; arr.splice(i, 1);
    setCurrentDocente({ ...currentDocente, participacionEventos: arr });
  };

  const addIdioma = () => {
    if (!newIdioma.trim()) return;
    setCurrentDocente({ ...currentDocente, idiomas: [...(currentDocente.idiomas || []), newIdioma.trim()] });
    setNewIdioma('');
  };
  const removeIdioma = (i: number) => {
    const arr = [...(currentDocente.idiomas || [])]; arr.splice(i, 1);
    setCurrentDocente({ ...currentDocente, idiomas: arr });
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('/embed/')) return url;
    const regExp = /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // ── Filtered list ──────────────────────────────────────────────
  const filteredDocentes = docentes.filter(d => {
    if (filterType !== 'all' && d.tipo !== filterType) return false;
    if (searchTerm) {
      const sl = searchTerm.toLowerCase();
      return d.nombre.toLowerCase().includes(sl)
        || d.apellidos.toLowerCase().includes(sl)
        || (d.departamento && d.departamento.toLowerCase().includes(sl));
    }
    return true;
  });

  const emptyLabel = searchTerm
    ? 'No se encontraron docentes con ese término'
    : 'No hay docentes registrados';

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
              Perfiles de docentes
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 3 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
              color: 'var(--adm-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {filteredDocentes.length} {filteredDocentes.length === 1 ? 'docente' : 'docentes'}
            </span>
            <button
              type="button"
              className="adm-btn adm-btn-primary adm-btn-sm"
              onClick={handleNewDocente}
            >
              <Plus size={11} /> Nuevo docente
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="adm-card" style={{ marginBottom: 14, padding: '13px 16px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={12} style={{
                position: 'absolute', left: 10, top: '50%',
                transform: 'translateY(-50%)', color: 'var(--adm-ink-4)', pointerEvents: 'none',
              }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o departamento..."
                className="adm-input"
                style={{ paddingLeft: 30 }}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="adm-input adm-select"
              style={{ width: 'auto', minWidth: 190 }}
            >
              <option value="all">Todos los docentes</option>
              <option value="residente">Docentes Residentes</option>
              <option value="no_residente">Docentes No Residentes</option>
            </select>
          </div>
        </div>

        {/* Docentes list */}
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
          {!loading && filteredDocentes.length === 0 && (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <User size={26} style={{ color: 'var(--adm-ink-4)', margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: 'var(--adm-ink-3)' }}>
                {emptyLabel}
              </div>
            </div>
          )}

          {/* Rows */}
          {!loading && filteredDocentes.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div key={`${filterType}-${searchTerm}`}>
                {filteredDocentes.map((docente, i) => (
                  <motion.div
                    key={docente._id}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 20px', borderBottom: '1px solid var(--adm-rule)',
                      background: selectedId === docente._id ? 'var(--adm-paper-3)' : 'transparent',
                      transition: 'background 0.12s',
                      borderLeft: selectedId === docente._id
                        ? '2px solid var(--adm-blue)'
                        : '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedId !== docente._id)
                        e.currentTarget.style.background = 'var(--adm-paper-2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        selectedId === docente._id ? 'var(--adm-paper-3)' : 'transparent';
                    }}
                  >
                    {/* Photo circle */}
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0, marginRight: 14,
                      overflow: 'hidden', background: 'var(--adm-paper-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid var(--adm-rule)',
                    }}>
                      {docente.fotoPerfil
                        ? <img src={docente.fotoPerfil} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <User size={16} style={{ color: 'var(--adm-ink-4)' }} />
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0, marginRight: 14 }}>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500,
                        color: 'var(--adm-ink)', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4,
                      }}>
                        {docente.nombre} {docente.apellidos}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className={`adm-badge ${docente.tipo === 'residente' ? 'adm-badge-green' : 'adm-badge-blue'}`}>
                          {docente.tipo === 'residente' ? 'Residente' : 'No residente'}
                        </span>
                        {docente.departamento && (
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
                            color: 'var(--adm-ink-4)', letterSpacing: '0.04em',
                            whiteSpace: 'nowrap', overflow: 'hidden',
                            textOverflow: 'ellipsis', maxWidth: 200,
                          }}>
                            {docente.departamento}
                          </span>
                        )}
                        {!docente.isPublished && (
                          <span className="adm-badge adm-badge-default">No publicado</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleEditDocente(docente)}
                        className="adm-btn adm-btn-secondary adm-btn-sm"
                        title="Editar docente"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocente(docente._id!)}
                        className="adm-btn adm-btn-danger adm-btn-sm"
                        title="Eliminar docente"
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
                <User size={28} style={{ color: 'var(--adm-ink-4)', margin: '0 auto 14px', display: 'block' }} />
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                  color: 'var(--adm-ink-3)', marginBottom: 18,
                }}>
                  Selecciona un docente para editar o crea un nuevo perfil
                </div>
                <button
                  type="button"
                  className="adm-btn adm-btn-primary adm-btn-sm"
                  onClick={handleNewDocente}
                >
                  <Plus size={11} /> Nuevo docente
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
                      {formMode === 'create' ? 'Nuevo perfil' : 'Editar perfil'}
                    </div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                      fontWeight: 500, color: 'var(--adm-ink)',
                    }}>
                      {formMode === 'create'
                        ? 'Nuevo docente'
                        : `${currentDocente.nombre} ${currentDocente.apellidos}`.trim() || 'Sin nombre'
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
                <form onSubmit={handleSaveDocente}>
                  <div style={{
                    maxHeight: 'calc(100vh - 290px)',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'var(--adm-rule-dark) transparent',
                    padding: '20px',
                  }}>

                    {/* ── Información básica ── */}
                    <SectionTitle icon={User} label="Información básica" />

                    <div className="adm-grid-2" style={{ marginBottom: 10 }}>
                      <div className="adm-field">
                        <label className="adm-label">Nombre</label>
                        <input
                          type="text" name="nombre" value={currentDocente.nombre}
                          onChange={handleNameChange} className="adm-input"
                          placeholder="Ej: Juan" required
                        />
                      </div>
                      <div className="adm-field">
                        <label className="adm-label">Apellidos</label>
                        <input
                          type="text" name="apellidos" value={currentDocente.apellidos}
                          onChange={handleNameChange} className="adm-input"
                          placeholder="Ej: Pérez García" required
                        />
                      </div>
                    </div>

                    <div className="adm-grid-2" style={{ marginBottom: 10 }}>
                      <div className="adm-field">
                        <label className="adm-label">URL amigable</label>
                        <input
                          type="text" name="slug" value={currentDocente.slug}
                          onChange={handleChange} className="adm-input"
                          readOnly
                          style={{ background: 'var(--adm-paper-3)', cursor: 'default', color: 'var(--adm-ink-3)' }}
                          placeholder="auto-generado"
                        />
                      </div>
                      <div className="adm-field">
                        <label className="adm-label">Tipo de docente</label>
                        <select
                          name="tipo" value={currentDocente.tipo}
                          onChange={handleChange}
                          className="adm-input adm-select" required
                        >
                          <option value="residente">Docente Residente</option>
                          <option value="no_residente">Docente No Residente</option>
                        </select>
                      </div>
                    </div>

                    <div className="adm-field" style={{ marginBottom: 10 }}>
                      <label className="adm-label">Cargo</label>
                      <input
                        type="text" name="cargo" value={currentDocente.cargo || ''}
                        onChange={handleChange} className="adm-input"
                        placeholder="Ej: Profesor de Matemáticas"
                      />
                    </div>

                    <div className="adm-grid-2" style={{ marginBottom: 10 }}>
                      <div className="adm-field">
                        <label className="adm-label">Especialidad</label>
                        <input
                          type="text" name="especialidad" value={currentDocente.especialidad || ''}
                          onChange={handleChange} className="adm-input"
                          placeholder="Ej: Matemático e Investigador"
                        />
                      </div>
                      <div className="adm-field">
                        <label className="adm-label">Departamento</label>
                        <input
                          type="text" name="departamento" value={currentDocente.departamento || ''}
                          onChange={handleChange} className="adm-input"
                          placeholder="Ej: Facultad de Ciencias"
                        />
                      </div>
                    </div>

                    <div className="adm-field" style={{ marginBottom: 20 }}>
                      <label className="adm-label">Descripción general</label>
                      <textarea
                        name="descripcionGeneral" value={currentDocente.descripcionGeneral || ''}
                        onChange={handleChange} className="adm-input"
                        rows={4}
                        placeholder="Breve biografía o descripción del docente..."
                        style={{ resize: 'vertical', whiteSpace: 'pre-wrap' }}
                      />
                    </div>

                    {/* ── Fotografía ── */}
                    <SectionDivider icon={User} label="Fotografía del docente">
                      <DocenteImgUploader
                        onImageUploaded={handleImageUploaded}
                        currentImageUrl={currentDocente.fotoPerfil}
                        title="Fotografía del Docente"
                      />
                    </SectionDivider>

                    {/* ── Formación académica ── */}
                    <SectionDivider icon={GraduationCap} label="Formación académica">
                      <div style={{ marginBottom: 8 }}>
                        {(currentDocente.educacion || []).length === 0 ? (
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                            color: 'var(--adm-ink-4)', fontStyle: 'italic', marginBottom: 8,
                          }}>Sin títulos registrados</div>
                        ) : (
                          (currentDocente.educacion || []).map((edu, idx) => (
                            <ArrayItem
                              key={idx}
                              main={edu.titulo}
                              sub={`${edu.institucion}${edu.anio ? ` · ${edu.anio}` : ''}`}
                              onRemove={() => removeEducacion(idx)}
                            />
                          ))
                        )}
                      </div>
                      <AddFormBox onAdd={addEducacion} label="Añadir formación">
                        <input
                          type="text" value={newEducacion.titulo}
                          onChange={(e) => setNewEducacion({ ...newEducacion, titulo: e.target.value })}
                          placeholder="Título académico" className="adm-input"
                        />
                        <input
                          type="text" value={newEducacion.institucion}
                          onChange={(e) => setNewEducacion({ ...newEducacion, institucion: e.target.value })}
                          placeholder="Institución" className="adm-input"
                        />
                        <input
                          type="text" value={newEducacion.anio}
                          onChange={(e) => setNewEducacion({ ...newEducacion, anio: e.target.value })}
                          placeholder="Año (opcional)" className="adm-input"
                        />
                      </AddFormBox>
                    </SectionDivider>

                    {/* ── Idiomas ── */}
                    <SectionDivider icon={Globe} label="Idiomas">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                        {(currentDocente.idiomas || []).length === 0 ? (
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                            color: 'var(--adm-ink-4)', fontStyle: 'italic',
                          }}>Sin idiomas registrados</div>
                        ) : (
                          (currentDocente.idiomas || []).map((idioma, idx) => (
                            <div key={idx} style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              padding: '3px 8px', background: 'var(--adm-paper-2)',
                              border: '1px solid var(--adm-rule)', borderRadius: 100,
                              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                              color: 'var(--adm-ink-2)',
                            }}>
                              {idioma}
                              <button
                                type="button" onClick={() => removeIdioma(idx)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-ink-4)', padding: 0, display: 'flex' }}
                              >
                                <X size={11} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input
                          type="text" value={newIdioma}
                          onChange={(e) => setNewIdioma(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIdioma(); } }}
                          placeholder="Ej: Español, Inglés, Francés..."
                          className="adm-input" style={{ flex: 1 }}
                        />
                        <button
                          type="button" onClick={addIdioma}
                          className="adm-btn adm-btn-secondary adm-btn-sm"
                          style={{ padding: '5px 10px' }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </SectionDivider>

                    {/* ── Experiencia profesional ── */}
                    <SectionDivider icon={Briefcase} label="Experiencia profesional">
                      <div style={{ marginBottom: 8 }}>
                        {(currentDocente.experienciaProfesional || []).length === 0 ? (
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                            color: 'var(--adm-ink-4)', fontStyle: 'italic', marginBottom: 8,
                          }}>Sin experiencia registrada</div>
                        ) : (
                          (currentDocente.experienciaProfesional || []).map((exp, idx) => (
                            <ArrayItem
                              key={idx}
                              main={exp.cargo}
                              sub={`${exp.institucion}${exp.periodo ? ` · ${exp.periodo}` : ''}`}
                              onRemove={() => removeExperiencia(idx)}
                            />
                          ))
                        )}
                      </div>
                      <AddFormBox onAdd={addExperiencia} label="Añadir experiencia">
                        <input
                          type="text" value={newExperiencia.cargo}
                          onChange={(e) => setNewExperiencia({ ...newExperiencia, cargo: e.target.value })}
                          placeholder="Cargo" className="adm-input"
                        />
                        <input
                          type="text" value={newExperiencia.institucion}
                          onChange={(e) => setNewExperiencia({ ...newExperiencia, institucion: e.target.value })}
                          placeholder="Institución" className="adm-input"
                        />
                        <input
                          type="text" value={newExperiencia.periodo}
                          onChange={(e) => setNewExperiencia({ ...newExperiencia, periodo: e.target.value })}
                          placeholder="Período (opcional)" className="adm-input"
                        />
                      </AddFormBox>
                    </SectionDivider>

                    {/* ── Reconocimientos ── */}
                    <SectionDivider icon={Award} label="Reconocimientos">
                      <div style={{ marginBottom: 8 }}>
                        {(currentDocente.reconocimientos || []).length === 0 ? (
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                            color: 'var(--adm-ink-4)', fontStyle: 'italic', marginBottom: 8,
                          }}>Sin reconocimientos registrados</div>
                        ) : (
                          (currentDocente.reconocimientos || []).map((rec, idx) => (
                            <ArrayItem
                              key={idx}
                              main={rec.titulo}
                              sub={`${rec.otorgadoPor ? rec.otorgadoPor : ''}${rec.anio ? ` · ${rec.anio}` : ''}`}
                              onRemove={() => removeReconocimiento(idx)}
                            />
                          ))
                        )}
                      </div>
                      <AddFormBox onAdd={addReconocimiento} label="Añadir reconocimiento">
                        <input
                          type="text" value={newReconocimiento.titulo}
                          onChange={(e) => setNewReconocimiento({ ...newReconocimiento, titulo: e.target.value })}
                          placeholder="Título del reconocimiento" className="adm-input"
                        />
                        <input
                          type="text" value={newReconocimiento.otorgadoPor}
                          onChange={(e) => setNewReconocimiento({ ...newReconocimiento, otorgadoPor: e.target.value })}
                          placeholder="Otorgado por (opcional)" className="adm-input"
                        />
                        <input
                          type="text" value={newReconocimiento.anio}
                          onChange={(e) => setNewReconocimiento({ ...newReconocimiento, anio: e.target.value })}
                          placeholder="Año (opcional)" className="adm-input"
                        />
                      </AddFormBox>
                    </SectionDivider>

                    {/* ── Participación en eventos ── */}
                    <SectionDivider icon={Calendar} label="Participación en eventos">
                      <div style={{ marginBottom: 8 }}>
                        {(currentDocente.participacionEventos || []).length === 0 ? (
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                            color: 'var(--adm-ink-4)', fontStyle: 'italic', marginBottom: 8,
                          }}>Sin eventos registrados</div>
                        ) : (
                          (currentDocente.participacionEventos || []).map((evt, idx) => (
                            <ArrayItem
                              key={idx}
                              main={evt.nombre}
                              sub={`${evt.lugar}${evt.anio ? ` · ${evt.anio}` : ''}`}
                              onRemove={() => removeEvento(idx)}
                            />
                          ))
                        )}
                      </div>
                      <AddFormBox onAdd={addEvento} label="Añadir evento">
                        <input
                          type="text" value={newEvento.nombre}
                          onChange={(e) => setNewEvento({ ...newEvento, nombre: e.target.value })}
                          placeholder="Nombre del evento" className="adm-input"
                        />
                        <input
                          type="text" value={newEvento.lugar}
                          onChange={(e) => setNewEvento({ ...newEvento, lugar: e.target.value })}
                          placeholder="Lugar" className="adm-input"
                        />
                        <input
                          type="text" value={newEvento.anio}
                          onChange={(e) => setNewEvento({ ...newEvento, anio: e.target.value })}
                          placeholder="Año (opcional)" className="adm-input"
                        />
                      </AddFormBox>
                    </SectionDivider>

                    {/* ── Video YouTube ── */}
                    <SectionDivider icon={Youtube} label="Video YouTube">
                      <div className="adm-field" style={{ marginBottom: 10 }}>
                        <label className="adm-label">URL del video</label>
                        <input
                          type="text" name="videoUrl" value={currentDocente.videoUrl || ''}
                          onChange={handleChange} className="adm-input"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      {currentDocente.videoUrl && (
                        <div style={{
                          borderRadius: 6, overflow: 'hidden',
                          aspectRatio: '16/9', background: '#000',
                        }}>
                          <iframe
                            src={getYoutubeEmbedUrl(currentDocente.videoUrl)}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="YouTube preview"
                          />
                        </div>
                      )}
                    </SectionDivider>

                    {/* ── Estado de publicación ── */}
                    <div style={{ borderTop: '1px solid var(--adm-rule)', paddingTop: 16 }}>
                      <SectionTitle icon={User} label="Estado de publicación" />
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13, color: 'var(--adm-ink-2)',
                      }}>
                        <input
                          type="checkbox"
                          checked={currentDocente.isPublished}
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

export default DocentesManager;
