import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { FileText, List, Edit3, Shield, DollarSign, Users } from 'lucide-react';
import Confetti from 'react-confetti';
import { useAuth } from '../auth/hooks/useAuth';
import SecurityManager from '../components/SecurityManager';
import EstadosFinancierosManager from '../components/EstadosFinancierosManager';
import NewsCreate from '../admin/news/NewsCreate';
import NewsManage from '../admin/news/NewsManage';
import NewsEdit from '../admin/news/NewsEdit';
import { NewsService } from '../admin/news/NewsService';
import UserManager from '../components/UserManager';
import AdminShell from '../components/admin/AdminShell';

interface CategoryStats {
  [key: string]: number;
}
interface Stats {
  totalNews: number;
  byCategory: CategoryStats;
}

const FEATURE_KEY      = 'multi-image-news-v1';
const FEATURE_DURATION = 12 * 60 * 60 * 1000;

// Micro-animation for tab panel swap
const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

const AdminPanelPage: React.FC = () => {
  const [activeTab, setActiveTab]           = useState<'create' | 'manage' | 'edit' | 'security' | 'estados' | 'users'>('create');
  const [editingNewsId, setEditingNewsId]   = useState<string | null>(null);
  const [stats, setStats]                   = useState<Stats>({ totalNews: 0, byCategory: {} });
  const [showConfetti, setShowConfetti]     = useState(false);
  const [showFeatureBanner, setShowFeatureBanner] = useState(false);

  const { isSuperAdmin, token } = useAuth();

  /* ── Stats ── */
  const fetchStats = async () => {
    try {
      const news = await NewsService.fetchNews();
      const totalNews   = news.length;
      const byCategory  = news.reduce((acc: CategoryStats, item: any) => {
        const cat = item.category || 'Sin categoría';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});
      setStats({ totalNews, byCategory });
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar las estadísticas.');
    }
  };

  /* ── Feature banner ── */
  useEffect(() => {
    const stored = localStorage.getItem(FEATURE_KEY);
    if (!stored) {
      localStorage.setItem(FEATURE_KEY, Date.now().toString());
      setShowFeatureBanner(true);
    } else {
      const savedTime = parseInt(stored, 10);
      if (Date.now() - savedTime < FEATURE_DURATION) setShowFeatureBanner(true);
    }
  }, []);

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  const handleEdit = (id: string) => {
    setEditingNewsId(id);
    setActiveTab('edit');
  };

  const handleSuccess = () => {
    setShowConfetti(true);
    setEditingNewsId(null);
    setActiveTab('manage');
    fetchStats();
  };

  /* ── Derived stat: top category ── */
  const topCategory = Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <AdminShell title="Noticias e información" subtitle="REDACCIÓN">

      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {/* ── Feature banner ── */}
      <AnimatePresence>
        {showFeatureBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="adm-banner"
          >
            <span className="adm-banner-dot" />
            <p className="adm-banner-text">
              <strong style={{ color: 'var(--adm-ink)' }}>Actualización.</strong>{' '}
              Ya puedes subir múltiples imágenes a la vez en la sección de noticias.
            </p>
            <button
              className="adm-banner-close"
              onClick={() => setShowFeatureBanner(false)}
              aria-label="Cerrar anuncio"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page header ── */}
      <div className="adm-page-header adm-section-enter">
        <div className="adm-page-label">Panel de administración</div>
        <h1 className="adm-page-title">Noticias e información</h1>
      </div>

      {/* ── Stats ── */}
      <div className="adm-stats-grid">
        <div className="adm-stat">
          <div className="adm-stat-label">Total noticias</div>
          <div className="adm-stat-value">{stats.totalNews}</div>
          <div className="adm-stat-sub">publicadas</div>
        </div>

        {topCategory && (
          <div className="adm-stat">
            <div className="adm-stat-label">Categoría líder</div>
            <div
              className="adm-stat-value"
              style={{ fontSize: '1.1rem', letterSpacing: '-0.01em', marginTop: 4 }}
            >
              {topCategory[0]}
            </div>
            <div className="adm-stat-sub">{topCategory[1]} artículos</div>
          </div>
        )}

        {Object.entries(stats.byCategory)
          .sort((a, b) => b[1] - a[1])
          .slice(1, 3)
          .map(([cat, count]) => (
            <div key={cat} className="adm-stat">
              <div className="adm-stat-label">{cat}</div>
              <div className="adm-stat-value">{count}</div>
              <div className="adm-stat-sub">artículos</div>
            </div>
          ))}
      </div>

      {/* ── Tab bar ── */}
      <div className="adm-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'create'}
          onClick={() => setActiveTab('create')}
          className={`adm-tab${activeTab === 'create' ? ' active' : ''}`}
        >
          <FileText size={13} />
          Crear noticia
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'manage'}
          onClick={() => setActiveTab('manage')}
          className={`adm-tab${activeTab === 'manage' ? ' active' : ''}`}
        >
          <List size={13} />
          Administrar
        </button>

        {editingNewsId && (
          <button
            role="tab"
            aria-selected={activeTab === 'edit'}
            onClick={() => setActiveTab('edit')}
            className={`adm-tab${activeTab === 'edit' ? ' active' : ''}`}
          >
            <Edit3 size={13} />
            Editar noticia
          </button>
        )}

        <button
          role="tab"
          aria-selected={activeTab === 'estados'}
          onClick={() => setActiveTab('estados')}
          className={`adm-tab${activeTab === 'estados' ? ' active' : ''}`}
        >
          <DollarSign size={13} />
          Estados financieros
        </button>

        {isSuperAdmin && (
          <>
            <button
              role="tab"
              aria-selected={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
              className={`adm-tab${activeTab === 'security' ? ' active' : ''}`}
            >
              <Shield size={13} />
              Seguridad
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
              className={`adm-tab${activeTab === 'users' ? ' active' : ''}`}
            >
              <Users size={13} />
              Usuarios
            </button>
          </>
        )}
      </div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {activeTab === 'create'  && <NewsCreate onSuccess={handleSuccess} />}
          {activeTab === 'manage'  && <NewsManage onEdit={handleEdit} />}
          {activeTab === 'edit'    && editingNewsId && (
            <NewsEdit newsId={editingNewsId} onSuccess={handleSuccess} />
          )}
          {activeTab === 'estados' && <EstadosFinancierosManager />}
          {activeTab === 'security' && isSuperAdmin && <SecurityManager token={token} />}
          {activeTab === 'users'    && isSuperAdmin && <UserManager token={token} />}
        </motion.div>
      </AnimatePresence>

      <Toaster position="bottom-right" />
    </AdminShell>
  );
};

export default AdminPanelPage;
