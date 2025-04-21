// src/admin/news/NewsManage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { NewsService } from './NewsService';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { gsap } from 'gsap';

const NewsManage: React.FC<{ onEdit: (id: string) => void }> = ({ onEdit }) => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const newsListRef = useRef<HTMLDivElement>(null);

  const NEWS_PER_PAGE = 20;

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    // Animar la entrada de las noticias con GSAP
    if (newsListRef.current) {
      const items = newsListRef.current.children;
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, [currentPage, newsItems, selectedCategory, searchTerm]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await NewsService.fetchNews();
      // Ordenar las noticias por fecha descendente
      const sortedData = data.sort((a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setNewsItems(sortedData);
      setCurrentPage(1); // Resetear a la primera página al recargar las noticias
    } catch (err) {
      toast.error('Error al cargar noticias.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta noticia?')) {
      try {
        await NewsService.deleteNews(id);
        toast.success('Noticia eliminada.');
        fetchNews();
      } catch (err) {
        toast.error('Error al eliminar la noticia.');
      }
    }
  };

  // Filtrar por búsqueda y categoría
  const filteredNews = newsItems
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todas' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    // Ordenar nuevamente después de filtrar para asegurar el orden
    .sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Paginación
  const totalPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * NEWS_PER_PAGE,
    currentPage * NEWS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para generar el array de páginas visibles
  const getVisiblePages = () => {
    const delta = 1; // Número de páginas adicionales a mostrar a cada lado de la página actual
    const pages = [];
    
    // Siempre mostrar la primera página
    if (currentPage > 2 + delta) {
      pages.push(1);
      // Agregar puntos suspensivos si es necesario
      if (currentPage > 3 + delta) {
        pages.push('...');
      }
    }

    // Páginas alrededor de la página actual
    const rangeStart = Math.max(1, currentPage - delta);
    const rangeEnd = Math.min(totalPages, currentPage + delta);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Siempre mostrar la última página
    if (currentPage < totalPages - 1 - delta) {
      // Agregar puntos suspensivos si es necesario
      if (currentPage < totalPages - 2 - delta) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-sans">
        Administrar Noticias
      </h2>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
        {/* Campo de búsqueda */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar noticias por título..."
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300 font-sans"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Selector de categoría */}
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // Resetear a la primera página al cambiar la categoría
            }}
            className="py-2 px-4 bg-gray-100 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 font-sans"
          >
            <option value="Todas">Todas las categorías</option>
            <option value="General">General</option>
            <option value="Académico">Académico</option>
            <option value="Cultural">Cultural</option>
          </select>
        </div>
      </div>

      {/* Lista de noticias */}
      {loading ? (
        <div className="text-center text-gray-600 font-sans">Cargando...</div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center text-gray-600 font-sans">
          No se encontraron noticias
        </div>
      ) : (
        <>
          <div ref={newsListRef} className="space-y-3">
            {paginatedNews.map((news) => (
              <div
                key={news._id}
                className="flex items-center justify-between py-3 px-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 font-sans">
                    {news.title}
                  </h3>
                  <div className="mt-1 text-sm text-gray-500 font-sans">
                    <span>
                      {new Date(news.date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        timeZone: 'UTC', // Forzar que se muestre en UTC
                      })}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{news.category}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(news._id)}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteNews(news._id)}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación Mejorada */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-6 space-x-1">
              {/* Botón para ir a la primera página */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Primera página"
              >
                <ChevronsLeft size={16} />
              </button>

              {/* Botón para página anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Números de página */}
              {getVisiblePages().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageChange(page as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md font-sans ${
                      currentPage === page
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              {/* Botón para página siguiente */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Página siguiente"
              >
                <ChevronRight size={16} />
              </button>

              {/* Botón para ir a la última página */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Última página"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsManage;