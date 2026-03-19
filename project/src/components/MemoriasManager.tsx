// src/components/MemoriasManager.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit2, Check, AlertTriangle,
  FileText, Youtube, Loader, X, ChevronUp, ChevronDown,
} from 'lucide-react';
import MemoriasPdfUploader from './MemoriasPdfUploader';
import API_ROUTES from '../config/api';

/* ─── Types (unchanged) ─────────────────────────────── */

export interface ContentSection {
  sectionType: 'text' | 'stats' | 'table' | 'gallery' | 'timeline' | 'list' | 'quote' | 'contact';
  title?: string;
  content: any;
  order: number;
}

export interface MemoriaItem {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  pdfUrl: string;
  pdfPublicId?: string;
  videoUrl: string;
  order: number;
  isPublished: boolean;
  contentSections?: ContentSection[];
  createdAt?: string;
  updatedAt?: string;
}

/* ─── Helpers ────────────────────────────────────────── */

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const regExp = /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[7].length === 11 ? match[7] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const validatePdf = (url: string): boolean => {
  if (!url) return false;
  if (url.includes('cloudinary.com')) {
    return /^https:\/\/res\.cloudinary\.com\/([^/]+)\/(.+)$/.test(url);
  }
  return true;
};

const EMPTY_MEMORIA: Omit<MemoriaItem, 'order'> = {
  title: '', slug: '', description: '',
  pdfUrl: '', videoUrl: '', isPublished: true, contentSections: [],
};

/* ─── Section content defaults ───────────────────────── */

const defaultContent = (type: ContentSection['sectionType']): any => {
  switch (type) {
    case 'text':     return { text: '' };
    case 'stats':    return { items: [{ label: '', value: '', description: '' }] };
    case 'table':    return { headers: ['Columna 1', 'Columna 2'], rows: [['', '']] };
    case 'gallery':  return { images: [{ url: '', caption: '' }] };
    case 'timeline': return { events: [{ date: '', title: '', description: '' }] };
    case 'list':     return { items: [{ title: '', description: '' }] };
    case 'quote':    return { text: '', author: '', position: '' };
    case 'contact':  return { address: '', phone: '', email: '', schedule: '', website: '' };
    default:         return {};
  }
};

/* ─── Sub-editors ─────────────────────────────────────── */

const SubField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <label className="adm-label">{label}</label>
    {children}
  </div>
);

const TextSectionEditor: React.FC<{ content: any; onChange: (c: any) => void }> = ({ content, onChange }) => (
  <SubField label="Texto">
    <textarea
      className="adm-input adm-textarea"
      value={content.text || ''}
      onChange={(e) => onChange({ ...content, text: e.target.value })}
      placeholder="Ingrese el texto para esta sección..."
    />
  </SubField>
);

const StatsSectionEditor: React.FC<{ content: any; onChange: (c: any) => void }> = ({ content, onChange }) => {
  const items = content.items || [];
  const update = (i: number, patch: any) => {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange({ ...content, items: next });
  };
  const add = () => onChange({ ...content, items: [...items, { label: '', value: '', description: '' }] });
  const remove = (i: number) => onChange({ ...content, items: items.filter((_: any, idx: number) => idx !== i) });

  return (
    <div>
      {items.map((item: any, i: number) => (
        <div key={i} className="adm-card" style={{ padding: '12px 14px', marginBottom: 10, position: 'relative' }}>
          <button type="button" onClick={() => remove(i)}
            style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-ink-3)' }}>
            <X size={13} />
          </button>
          <div className="adm-grid-2" style={{ marginBottom: 8 }}>
            <SubField label="Etiqueta">
              <input className="adm-input" value={item.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Ej: Estudiantes" />
            </SubField>
            <SubField label="Valor">
              <input className="adm-input" value={item.value} onChange={(e) => update(i, { value: e.target.value })} placeholder="Ej: 1,500+" />
            </SubField>
          </div>
          <SubField label="Descripción">
            <input className="adm-input" value={item.description} onChange={(e) => update(i, { description: e.target.value })} placeholder="Descripción adicional (opcional)" />
          </SubField>
        </div>
      ))}
      <button type="button" onClick={add} className="adm-btn adm-btn-secondary adm-btn-sm">
        <Plus size={12} /> Añadir estadística
      </button>
    </div>
  );
};

const TimelineSectionEditor: React.FC<{ content: any; onChange: (c: any) => void }> = ({ content, onChange }) => {
  const events = content.events || [];
  const update = (i: number, patch: any) => { const n = [...events]; n[i] = { ...n[i], ...patch }; onChange({ ...content, events: n }); };
  const add = () => onChange({ ...content, events: [...events, { date: '', title: '', description: '' }] });
  const remove = (i: number) => onChange({ ...content, events: events.filter((_: any, idx: number) => idx !== i) });

  return (
    <div>
      {events.map((ev: any, i: number) => (
        <div key={i} className="adm-card" style={{ padding: '12px 14px', marginBottom: 10, position: 'relative' }}>
          <button type="button" onClick={() => remove(i)}
            style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-ink-3)' }}>
            <X size={13} />
          </button>
          <div className="adm-grid-2" style={{ marginBottom: 8 }}>
            <SubField label="Fecha / Período">
              <input className="adm-input" value={ev.date} onChange={(e) => update(i, { date: e.target.value })} placeholder="Ej: 2018-2020" />
            </SubField>
            <SubField label="Título">
              <input className="adm-input" value={ev.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="Ej: Nombre del coordinador" />
            </SubField>
          </div>
          <SubField label="Descripción">
            <textarea className="adm-input adm-textarea" style={{ minHeight: 60 }} value={ev.description} onChange={(e) => update(i, { description: e.target.value })} placeholder="Descripción del evento o período" />
          </SubField>
        </div>
      ))}
      <button type="button" onClick={add} className="adm-btn adm-btn-secondary adm-btn-sm">
        <Plus size={12} /> Añadir evento
      </button>
    </div>
  );
};

const ListSectionEditor: React.FC<{ content: any; onChange: (c: any) => void }> = ({ content, onChange }) => {
  const items = content.items || [];
  const update = (i: number, patch: any) => { const n = [...items]; n[i] = { ...n[i], ...patch }; onChange({ ...content, items: n }); };
  const add = () => onChange({ ...content, items: [...items, { title: '', description: '' }] });
  const remove = (i: number) => onChange({ ...content, items: items.filter((_: any, idx: number) => idx !== i) });

  return (
    <div>
      {items.map((item: any, i: number) => (
        <div key={i} className="adm-card" style={{ padding: '12px 14px', marginBottom: 10, position: 'relative' }}>
          <button type="button" onClick={() => remove(i)}
            style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-ink-3)' }}>
            <X size={13} />
          </button>
          <SubField label="Título del elemento">
            <input className="adm-input" value={item.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="Ej: Apoyo Psicológico" />
          </SubField>
          <SubField label="Descripción">
            <textarea className="adm-input adm-textarea" style={{ minHeight: 60 }} value={item.description} onChange={(e) => update(i, { description: e.target.value })} placeholder="Descripción detallada" />
          </SubField>
        </div>
      ))}
      <button type="button" onClick={add} className="adm-btn adm-btn-secondary adm-btn-sm">
        <Plus size={12} /> Añadir elemento
      </button>
    </div>
  );
};

const ContactSectionEditor: React.FC<{ content: any; onChange: (c: any) => void }> = ({ content, onChange }) => {
  const f = (field: string, value: string) => onChange({ ...content, [field]: value });
  const fields: { key: string; label: string; placeholder: string }[] = [
    { key: 'address',  label: 'Dirección',         placeholder: 'Edificio Administrativo, 2do nivel' },
    { key: 'phone',    label: 'Teléfono',           placeholder: '(809) XXX-XXXX Ext. 123' },
    { key: 'email',    label: 'Correo electrónico', placeholder: 'correo@sanjuan.uasd.edu.do' },
    { key: 'schedule', label: 'Horario de atención',placeholder: 'Lunes a Viernes 8:00 AM - 4:00 PM' },
    { key: 'website',  label: 'Sitio web',          placeholder: 'https://sanjuan.uasd.edu.do' },
  ];
  return (
    <div>
      {fields.map(({ key, label, placeholder }) => (
        <SubField key={key} label={label}>
          <input className="adm-input" type={key === 'email' ? 'email' : 'text'}
            value={content[key] || ''} onChange={(e) => f(key, e.target.value)} placeholder={placeholder} />
        </SubField>
      ))}
    </div>
  );
};

/* ─── ContentSectionsManager ──────────────────────────── */

const SECTION_TYPES: { value: ContentSection['sectionType']; label: string }[] = [
  { value: 'text',     label: 'Texto' },
  { value: 'stats',    label: 'Estadísticas' },
  { value: 'table',    label: 'Tabla' },
  { value: 'gallery',  label: 'Galería' },
  { value: 'timeline', label: 'Cronología' },
  { value: 'list',     label: 'Lista' },
  { value: 'quote',    label: 'Cita / Testimonio' },
  { value: 'contact',  label: 'Contacto' },
];

const renderSectionEditor = (section: ContentSection, index: number, update: (i: number, c: any) => void) => {
  const onChange = (content: any) => update(index, content);
  switch (section.sectionType) {
    case 'text':     return <TextSectionEditor content={section.content} onChange={onChange} />;
    case 'stats':    return <StatsSectionEditor content={section.content} onChange={onChange} />;
    case 'timeline': return <TimelineSectionEditor content={section.content} onChange={onChange} />;
    case 'list':     return <ListSectionEditor content={section.content} onChange={onChange} />;
    case 'contact':  return <ContactSectionEditor content={section.content} onChange={onChange} />;
    default:
      return (
        <div style={{ padding: '12px 14px', background: 'var(--adm-paper-2)', borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--adm-ink-3)' }}>
          Editor para "{section.sectionType}" no implementado aún.
        </div>
      );
  }
};

const ContentSectionsManager: React.FC<{
  sections: ContentSection[];
  onChange: (s: ContentSection[]) => void;
}> = ({ sections, onChange }) => {
  const [selectedType, setSelectedType] = useState<ContentSection['sectionType']>('text');

  const add = () => {
    onChange([...sections, { sectionType: selectedType, title: '', content: defaultContent(selectedType), order: sections.length }]);
  };

  const remove = (i: number) => {
    onChange(sections.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, order: idx })));
  };

  const move = (i: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? i - 1 : i + 1;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next.map((s, idx) => ({ ...s, order: idx })));
  };

  const updateTitle = (i: number, title: string) => {
    const next = [...sections];
    next[i] = { ...next[i], title };
    onChange(next);
  };

  const updateContent = (i: number, content: any) => {
    const next = [...sections];
    next[i] = { ...next[i], content };
    onChange(next);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <hr className="adm-divider" />
      <div style={{ marginBottom: 14 }}>
        <label className="adm-label">Secciones de contenido</label>
      </div>

      {sections.length === 0 ? (
        <div style={{
          padding: '24px 16px', textAlign: 'center',
          background: 'var(--adm-paper-2)',
          border: '1.5px dashed var(--adm-rule-dark)',
          borderRadius: 8, marginBottom: 14,
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--adm-ink-3)' }}>
            Sin secciones de contenido adicional
          </span>
        </div>
      ) : (
        <div style={{ marginBottom: 12 }}>
          {sections.map((section, i) => (
            <div key={i} className="adm-card" style={{ marginBottom: 10, padding: 0, overflow: 'hidden' }}>
              {/* Section header */}
              <div className="adm-card-header" style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <span className="adm-badge adm-badge-default">{section.sectionType}</span>
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) => updateTitle(i, e.target.value)}
                    placeholder="Título de la sección (opcional)"
                    className="adm-input"
                    style={{ flex: 1, padding: '5px 9px', fontSize: 12.5 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button type="button" onClick={() => move(i, 'up')} disabled={i === 0}
                    className="adm-btn adm-btn-secondary adm-btn-sm" style={{ padding: '4px 7px' }} title="Subir">
                    <ChevronUp size={11} />
                  </button>
                  <button type="button" onClick={() => move(i, 'down')} disabled={i === sections.length - 1}
                    className="adm-btn adm-btn-secondary adm-btn-sm" style={{ padding: '4px 7px' }} title="Bajar">
                    <ChevronDown size={11} />
                  </button>
                  <button type="button" onClick={() => remove(i)}
                    className="adm-btn adm-btn-danger adm-btn-sm" style={{ padding: '4px 7px' }} title="Eliminar sección">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              {/* Section editor */}
              <div style={{ padding: '14px 16px' }}>
                {renderSectionEditor(section, i, updateContent)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add section row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ContentSection['sectionType'])}
          className="adm-input adm-select"
          style={{ width: 'auto', minWidth: 160 }}
        >
          {SECTION_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="button" onClick={add} className="adm-btn adm-btn-secondary adm-btn-sm">
          <Plus size={12} /> Añadir sección
        </button>
      </div>
    </div>
  );
};

/* ─── Main component ─────────────────────────────────── */

const MemoriasManager: React.FC = () => {
  const [memorias, setMemorias]         = useState<MemoriaItem[]>([]);
  const [loading, setLoading]           = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [showForm, setShowForm]         = useState(false);
  const [formMode, setFormMode]         = useState<'create' | 'edit'>('create');
  const [current, setCurrent]           = useState<MemoriaItem>({ ...EMPTY_MEMORIA, order: 0 });

  useEffect(() => { fetchMemorias(); }, []);

  /* ── API ── */
  const fetchMemorias = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_ROUTES.MEMORIAS);
      setMemorias(res.data);
    } catch {
      toast.error('Error al cargar las memorias', {
        icon: <AlertTriangle size={16} style={{ color: 'var(--adm-red)' }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current.title || !current.slug) {
      toast.error('El título es obligatorio', { icon: <AlertTriangle size={16} style={{ color: 'var(--adm-red)' }} /> });
      return;
    }
    if (current.pdfUrl && !validatePdf(current.pdfUrl)) {
      toast.error('El PDF proporcionado no es válido', { icon: <AlertTriangle size={16} style={{ color: 'var(--adm-red)' }} /> });
      return;
    }
    setSubmitting(true);
    try {
      if (formMode === 'create') {
        await axios.post(API_ROUTES.MEMORIAS, current);
        toast.success('Memoria creada correctamente', { icon: <Check size={16} style={{ color: 'var(--adm-green)' }} /> });
      } else {
        await axios.put(API_ROUTES.MEMORIAS_BY_ID(current._id!), current);
        toast.success('Memoria actualizada correctamente', { icon: <Check size={16} style={{ color: 'var(--adm-green)' }} /> });
      }
      setShowForm(false);
      fetchMemorias();
    } catch {
      toast.error('Error al guardar la memoria', { icon: <AlertTriangle size={16} style={{ color: 'var(--adm-red)' }} /> });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta memoria?')) return;
    setLoading(true);
    try {
      await axios.delete(API_ROUTES.MEMORIAS_BY_ID(id));
      toast.success('Memoria eliminada correctamente', { icon: <Check size={16} style={{ color: 'var(--adm-green)' }} /> });
      fetchMemorias();
    } catch {
      setLoading(false);
      toast.error('Error al eliminar la memoria', { icon: <AlertTriangle size={16} style={{ color: 'var(--adm-red)' }} /> });
    }
  };

  /* ── Form helpers ── */
  const openCreate = () => {
    setCurrent({ ...EMPTY_MEMORIA, order: memorias.length + 1 });
    setFormMode('create');
    setShowForm(true);
  };

  const openEdit = (m: MemoriaItem) => {
    setCurrent(m);
    setFormMode('edit');
    setShowForm(true);
  };

  const patch = (key: keyof MemoriaItem, value: any) =>
    setCurrent((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setCurrent((prev) => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    patch('videoUrl', getYoutubeEmbedUrl(e.target.value));
  };

  /* ── Render ── */
  return (
    <div className="adm-section-enter">

      {/* ── Action row ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={openCreate} className="adm-btn adm-btn-primary adm-btn-sm">
          <Plus size={13} /> Nueva memoria
        </button>
      </div>

      {/* ── Form (slide-down) ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden', marginBottom: 20 }}
          >
            <form onSubmit={handleSave}>
              <div className="adm-card">
                {/* Card header */}
                <div className="adm-card-header">
                  <span className="adm-card-title">
                    {formMode === 'create' ? 'Nueva memoria' : `Editando: ${current.title}`}
                  </span>
                  <span className="adm-badge adm-badge-default">
                    {formMode === 'create' ? 'Creación' : 'Edición'}
                  </span>
                </div>

                <div className="adm-card-body">
                  {/* Title + slug */}
                  <div className="adm-grid-2">
                    <div className="adm-field">
                      <label className="adm-label">Título</label>
                      <input
                        type="text"
                        className="adm-input"
                        value={current.title}
                        onChange={handleTitleChange}
                        placeholder="Ej: Postgrado, UCOTESIS"
                        required
                      />
                    </div>
                    <div className="adm-field">
                      <label className="adm-label">URL amigable (slug)</label>
                      <input
                        type="text"
                        className="adm-input"
                        value={current.slug}
                        onChange={(e) => patch('slug', e.target.value)}
                        placeholder="generado-automaticamente"
                        style={{ background: 'var(--adm-paper-2)', color: 'var(--adm-ink-3)' }}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="adm-field">
                    <label className="adm-label">Descripción</label>
                    <textarea
                      className="adm-input adm-textarea"
                      value={current.description}
                      onChange={(e) => patch('description', e.target.value)}
                      placeholder="Breve descripción de esta sección de memorias"
                    />
                  </div>

                  {/* YouTube */}
                  <div className="adm-field">
                    <label className="adm-label">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Youtube size={11} style={{ color: '#ff0000' }} />
                        URL de video (YouTube)
                      </span>
                    </label>
                    <input
                      type="text"
                      className="adm-input"
                      value={current.videoUrl}
                      onChange={handleYoutubeChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    {current.videoUrl && (
                      <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9', background: '#000' }}>
                        <iframe
                          src={current.videoUrl}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Vista previa YouTube"
                        />
                      </div>
                    )}
                  </div>

                  {/* PDF */}
                  <div className="adm-field">
                    <label className="adm-label">Documento PDF</label>
                    <MemoriasPdfUploader
                      onPdfUploaded={(url, publicId) => {
                        patch('pdfUrl', url);
                        patch('pdfPublicId', publicId);
                      }}
                      currentPdfUrl={current.pdfUrl}
                      title=""
                    />
                  </div>

                  {/* Content sections */}
                  <ContentSectionsManager
                    sections={current.contentSections || []}
                    onChange={(sections) => patch('contentSections', sections)}
                  />

                  {/* Published toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={current.isPublished}
                      onChange={(e) => patch('isPublished', e.target.checked)}
                      style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--adm-ink)' }}
                    />
                    <label
                      htmlFor="isPublished"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--adm-ink-2)', cursor: 'pointer' }}
                    >
                      Publicar (visible al público)
                    </label>
                  </div>

                  {/* Form actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="adm-btn adm-btn-secondary adm-btn-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="adm-btn adm-btn-primary adm-btn-sm"
                    >
                      {submitting ? (
                        <><Loader size={12} className="animate-spin" /> Guardando...</>
                      ) : (
                        <><Check size={12} /> Guardar</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── List ── */}
      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>

        {loading && (
          <div style={{ padding: '52px 24px', textAlign: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--adm-ink-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Cargando...
            </span>
          </div>
        )}

        {!loading && memorias.length === 0 && (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <FileText size={28} style={{ color: 'var(--adm-ink-4)', margin: '0 auto 12px', display: 'block' }} />
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--adm-ink-3)', marginBottom: 16 }}>
              No hay memorias disponibles
            </div>
            <button onClick={openCreate} className="adm-btn adm-btn-secondary adm-btn-sm">
              <Plus size={12} /> Crear primera memoria
            </button>
          </div>
        )}

        {!loading && memorias.map((memoria, i) => (
          <motion.div
            key={memoria._id}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
            style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: i < memorias.length - 1 ? '1px solid var(--adm-rule)' : 'none',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--adm-paper-2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--adm-ink)' }}>
                  {memoria.title}
                </span>
                {!memoria.isPublished && (
                  <span className="adm-badge adm-badge-default">No publicado</span>
                )}
                {memoria.isPublished && (
                  <span className="adm-badge adm-badge-green">Publicado</span>
                )}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: 'var(--adm-ink-3)', marginBottom: 6 }}>
                {memoria.description || 'Sin descripción'}
              </div>
              {/* Links row */}
              <div style={{ display: 'flex', gap: 14 }}>
                {memoria.videoUrl && (
                  <a
                    href={memoria.videoUrl.replace('/embed/', '/watch?v=')}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--adm-ink-3)', letterSpacing: '0.04em', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--adm-ink)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--adm-ink-3)')}
                  >
                    <Youtube size={11} style={{ color: '#ff0000' }} /> YouTube
                  </a>
                )}
                {memoria.pdfUrl && (
                  <a
                    href={memoria.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--adm-ink-3)', letterSpacing: '0.04em', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--adm-ink)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--adm-ink-3)')}
                  >
                    <FileText size={11} /> PDF
                  </a>
                )}
              </div>
              {memoria.updatedAt && (
                <div style={{ marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--adm-ink-4)', letterSpacing: '0.04em' }}>
                  Actualizado: {new Date(memoria.updatedAt).toLocaleDateString('es-ES')}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0, paddingTop: 2 }}>
              <button
                type="button"
                onClick={() => openEdit(memoria)}
                className="adm-btn adm-btn-secondary adm-btn-sm"
                title="Editar"
              >
                <Edit2 size={11} /> Editar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(memoria._id!)}
                className="adm-btn adm-btn-danger adm-btn-sm"
                title="Eliminar"
                style={{ padding: '5px 9px' }}
              >
                <Trash2 size={11} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MemoriasManager;
