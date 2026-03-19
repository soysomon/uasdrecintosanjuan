// src/admin/news/NewsManage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { NewsService } from './NewsService';
import {
  Search, Edit2, Trash2, FileText,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';

const NEWS_PER_PAGE = 20;

const rowVariants = {
  hidden:  { opacity: 0, y: 7 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.035, duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  }),
};

const categoryBadge = (cat: string) => {
  if (cat === 'Académico') return 'adm-badge adm-badge-blue';
  if (cat === 'Cultural')  return 'adm-badge adm-badge-amber';
  return 'adm-badge adm-badge-default';
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  });

/* ─────────────────────────────────────────────────── */

const NewsManage: React.FC<{ onEdit: (id: string) => void }> = ({ onEdit }) => {
  const [newsItems, setNewsItems]           = useState<any[]>([]);
  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [currentPage, setCurrentPage]       = useState(1);
  const [loading, setLoading]               = useState(false);

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await NewsService.fetchNews();
      setNewsItems(
        data.sort((a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setCurrentPage(1);
    } catch {
      toast.error('Error al cargar noticias.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta noticia?')) return;
    try {
      await NewsService.deleteNews(id);
      toast.success('Noticia eliminada.');
      fetchNews();
    } catch {
      toast.error('Error al eliminar la noticia.');
    }
  };

  /* ── Filters ── */
  const filteredNews = newsItems.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages   = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * NEWS_PER_PAGE,
    currentPage * NEWS_PER_PAGE
  );

  /* ── Pagination helpers ── */
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getVisiblePages = (): (number | '...')[] => {
    const delta = 1;
    const pages: (number | '...')[] = [];
    if (currentPage > 2 + delta) {
      pages.push(1);
      if (currentPage > 3 + delta) pages.push('...');
    }
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 1 - delta) {
      if (currentPage < totalPages - 2 - delta) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  /* ─────────────────────────────────────────────────── */

  return (
    <div className="adm-section-enter" style={{ paddingBottom: 32 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="adm-page-label">Gestión de contenido</div>
          <h2 style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: '1.3rem',
            fontWeight: 400,
            color: 'var(--adm-ink)',
            margin: 0,
            lineHeight: 1.3,
          }}>
            Noticias publicadas
          </h2>
        </div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5,
          color: 'var(--adm-ink-3)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          paddingBottom: 3,
        }}>
          {filteredNews.length} {filteredNews.length === 1 ? 'resultado' : 'resultados'}
        </span>
      </div>

      {/* ── Filters ── */}
      <div className="adm-card" style={{ marginBottom: 14, padding: '13px 16px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={12}
              style={{
                position: 'absolute', left: 10, top: '50%',
                transform: 'translateY(-50%)', color: 'var(--adm-ink-4)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por título..."
              className="adm-input"
              style={{ paddingLeft: 30 }}
            />
          </div>
          {/* Category select */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="adm-input adm-select"
            style={{ width: 'auto', minWidth: 170 }}
          >
            <option value="Todas">Todas las categorías</option>
            <option value="General">General</option>
            <option value="Académico">Académico</option>
            <option value="Cultural">Cultural</option>
          </select>
        </div>
      </div>

      {/* ── List card ── */}
      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>

        {/* Loading */}
        {loading && (
          <div style={{ padding: '52px 24px', textAlign: 'center' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5, color: 'var(--adm-ink-4)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Cargando...
            </span>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredNews.length === 0 && (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <FileText
              size={26}
              style={{ color: 'var(--adm-ink-4)', margin: '0 auto 12px', display: 'block' }}
            />
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13.5, color: 'var(--adm-ink-3)',
            }}>
              No se encontraron noticias
            </div>
          </div>
        )}

        {/* News rows */}
        {!loading && filteredNews.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div key={`${currentPage}-${selectedCategory}-${searchTerm}`}>
              {paginatedNews.map((news, i) => (
                <motion.div
                  key={news._id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '13px 20px',
                    borderBottom: '1px solid var(--adm-rule)',
                    transition: 'background 0.12s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--adm-paper-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13.5, fontWeight: 500,
                      color: 'var(--adm-ink)',
                      marginBottom: 5,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {news.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10, color: 'var(--adm-ink-3)',
                        letterSpacing: '0.04em',
                      }}>
                        {formatDate(news.date)}
                      </span>
                      <span className={categoryBadge(news.category || 'General')}>
                        {news.category || 'General'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => onEdit(news._id)}
                      className="adm-btn adm-btn-secondary adm-btn-sm"
                      title="Editar noticia"
                    >
                      <Edit2 size={11} />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(news._id)}
                      className="adm-btn adm-btn-danger adm-btn-sm"
                      title="Eliminar noticia"
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

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center',
          alignItems: 'center', gap: 4, marginTop: 18,
        }}>
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="adm-btn adm-btn-secondary adm-btn-sm"
            style={{ padding: '5px 8px' }}
          >
            <ChevronsLeft size={12} />
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="adm-btn adm-btn-secondary adm-btn-sm"
            style={{ padding: '5px 8px' }}
          >
            <ChevronLeft size={12} />
          </button>

          {getVisiblePages().map((page, idx) =>
            page === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  padding: '0 4px',
                  color: 'var(--adm-ink-4)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                }}
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => goToPage(page as number)}
                className={`adm-btn adm-btn-sm ${currentPage === page ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
                style={{
                  width: 30, padding: '5px 0',
                  justifyContent: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, letterSpacing: '0.02em',
                }}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="adm-btn adm-btn-secondary adm-btn-sm"
            style={{ padding: '5px 8px' }}
          >
            <ChevronRight size={12} />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="adm-btn adm-btn-secondary adm-btn-sm"
            style={{ padding: '5px 8px' }}
          >
            <ChevronsRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsManage;
