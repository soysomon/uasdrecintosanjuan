// src/admin/AdminPanelPage.tsx
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
import { NewsService } from '../admin/news/NewsService'; // Importamos NewsService

interface CategoryStats {
  [key: string]: number;
}

interface Stats {
  totalNews: number;
  byCategory: CategoryStats;
}

const AdminPanelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'edit' | 'security' | 'estados'>('create');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ totalNews: 0, byCategory: {} });
  const [showConfetti, setShowConfetti] = useState(false);
  const { isSuperAdmin, token } = useAuth();

  // Función para obtener y calcular estadísticas
  const fetchStats = async () => {
    try {
      const news = await NewsService.fetchNews(); // Obtenemos las noticias usando NewsService
      console.log('Noticias obtenidas para estadísticas:', news); // Depuración

      // Calculamos las estadísticas
      const totalNews = news.length;
      const byCategory = news.reduce((acc: CategoryStats, newsItem: any) => {
        const category = newsItem.category || 'Sin categoría';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      setStats({ totalNews, byCategory });
    } catch (err) {
      const error = err as Error;
      console.error('Error al obtener estadísticas:', error);
      toast.error('No se pudieron cargar las estadísticas.');
    }
  };

  // Obtenemos las estadísticas al montar el componente y cuando se crea/edita una noticia
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
    fetchStats(); // Actualizamos las estadísticas después de crear/editar una noticia
  };

  return (
    <div className="min-h-screen bg-white pt-32">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              Panel de Administración
            </h1>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-5">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Noticias</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalNews}</p>
            </div>
            <div className="h-10 border-l border-gray-200"></div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Más Popular</p>
              <p className="text-lg font-medium text-blue-700">
                {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex mb-6 bg-white rounded-lg shadow p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'create' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="mr-2" size={18} />
            Crear Noticia
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'manage' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Loader className="mr-2" size={18} />
            Administrar Noticias
          </button>
          <Link
            to="/slides-editor"
            className="flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all text-gray-600 hover:bg-gray-100"
          >
            <ImageIcon className="mr-2" size={18} />
            Editor de Slides
          </Link>
          <Link
  to="/memorias-editor"
  className="flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all text-gray-600 hover:bg-gray-100"
>
  <FileText className="mr-2" size={18} />
  Editor de Memorias
</Link>
          <button
            onClick={() => setActiveTab('estados')}
            className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'estados' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="mr-2" size={18} />
            Estados Financieros
          </button>
          <Link
            to="/docentes-editor"
            className="flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all text-gray-600 hover:bg-gray-100"
          >
            <Users className="mr-2" size={18} />
            Editor de Docentes
          </Link>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'security' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-2" size={18} />
              Seguridad
            </button>
          )}
          {isSuperAdmin && (
            <Link
              to="/admin/users"
              className="flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all bg-purple-100 text-purple-800 hover:bg-purple-200"
            >
              <Users className="mr-2" size={18} />
              Gestión de Usuarios
              <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                Super
              </span>
            </Link>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'create' && <NewsCreate onSuccess={handleSuccess} />}
          {activeTab === 'manage' && <NewsManage onEdit={handleEdit} />}
          {activeTab === 'edit' && editingNewsId && <NewsEdit newsId={editingNewsId} onSuccess={handleSuccess} />}
          {activeTab === 'security' && isSuperAdmin && <SecurityManager token={token} />}
          {activeTab === 'estados' && <EstadosFinancierosManager />}
        </AnimatePresence>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminPanelPage;