import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { FileText, Image as ImageIcon, Users, Loader } from 'lucide-react';
import Confetti from 'react-confetti';
import { useAuth } from '../auth/hooks/useAuth';
import SecurityManager from '../components/SecurityManager';
import EstadosFinancierosManager from '../components/EstadosFinancierosManager';
import NewsCreate from '../admin/news/NewsCreate';
import NewsManage from '../admin/news/NewsManage';
import NewsEdit from '../admin/news/NewsEdit';
import { NewsService } from '../admin/news/NewsService';

interface CategoryStats {
  [key: string]: number;
}

interface Stats {
  totalNews: number;
  byCategory: CategoryStats;
}

/* ==============================
   Feature Announcement (12h)
================================ */
const FEATURE_KEY = 'multi-image-news-v1';
const FEATURE_DURATION = 12 * 60 * 60 * 1000; // 12 horas

const AdminPanelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'edit' | 'security' | 'estados'>('create');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ totalNews: 0, byCategory: {} });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFeatureBanner, setShowFeatureBanner] = useState(false);

  const { isSuperAdmin, token } = useAuth();

  /* ==============================
     Estadísticas
  ================================ */
  const fetchStats = async () => {
    try {
      const news = await NewsService.fetchNews();

      const totalNews = news.length;
      const byCategory = news.reduce((acc: CategoryStats, newsItem: any) => {
        const category = newsItem.category || 'Sin categoría';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      setStats({ totalNews, byCategory });
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar las estadísticas.');
    }
  };

  /* ==============================
     Feature Banner Logic
  ================================ */
  useEffect(() => {
    const stored = localStorage.getItem(FEATURE_KEY);

    if (!stored) {
      localStorage.setItem(FEATURE_KEY, Date.now().toString());
      setShowFeatureBanner(true);
    } else {
      const savedTime = parseInt(stored, 10);
      if (Date.now() - savedTime < FEATURE_DURATION) {
        setShowFeatureBanner(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
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

  return (
    <div className="min-h-screen bg-white pt-32">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <div className="container mx-auto p-6">

        {/* ==============================
            Feature Announcement Banner
        ================================ */}
        <AnimatePresence>
          {showFeatureBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mb-6 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Enhorabuena.</span>{' '}
                  Ya puedes subir múltiples imágenes a la vez en la sección de noticias.
                </p>
              </div>

              <button
                onClick={() => setShowFeatureBanner(false)}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Cerrar anuncio"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==============================
            Header
        ================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Panel de Administración
          </h1>

          <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-5">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Noticias</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalNews}</p>
            </div>
            <div className="h-10 border-l border-gray-200" />
            <div className="text-center">
              <p className="text-sm text-gray-500">Más Popular</p>
              <p className="text-lg font-medium text-blue-700">
                {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ==============================
            Tabs
        ================================ */}
        <div className="flex mb-6 bg-white rounded-lg shadow p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="mr-2" size={18} />
            Crear Noticia
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'manage'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Loader className="mr-2" size={18} />
            Administrar Noticias
          </button>

          <Link
            to="/slides-editor"
            className="flex items-center py-3 px-4 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
          >
            <ImageIcon className="mr-2" size={18} />
            Editor de Slides
          </Link>

          <Link
            to="/memorias-editor"
            className="flex items-center py-3 px-4 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
          >
            <FileText className="mr-2" size={18} />
            Editor de Memorias
          </Link>

          <button
            onClick={() => setActiveTab('estados')}
            className={`flex items-center py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'estados'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="mr-2" size={18} />
            Estados Financieros
          </button>

          <Link
            to="/docentes-editor"
            className="flex items-center py-3 px-4 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
          >
            <Users className="mr-2" size={18} />
            Editor de Docentes
          </Link>

          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'security'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-2" size={18} />
              Seguridad
            </button>
          )}
        </div>

        {/* ==============================
            Content
        ================================ */}
        <AnimatePresence mode="wait">
          {activeTab === 'create' && <NewsCreate onSuccess={handleSuccess} />}
          {activeTab === 'manage' && <NewsManage onEdit={handleEdit} />}
          {activeTab === 'edit' && editingNewsId && (
            <NewsEdit newsId={editingNewsId} onSuccess={handleSuccess} />
          )}
          {activeTab === 'security' && isSuperAdmin && <SecurityManager token={token} />}
          {activeTab === 'estados' && <EstadosFinancierosManager />}
        </AnimatePresence>
      </div>

      <Toaster />
    </div>
  );
};

export default AdminPanelPage;