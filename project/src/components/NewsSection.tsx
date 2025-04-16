import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight, Clock, Tag, ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_ROUTES from '../config/api';

interface ImageDisplayOptions {
  size: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
  caption?: string;
  cropMode: 'cover' | 'contain' | 'none';
}

interface NewsImage {
  id?: string;
  url: string;
  publicId?: string;
  displayOptions: ImageDisplayOptions;
}

interface Section {
  images: NewsImage[];
  text: string;
  imageUrl?: string; // Mantenemos para compatibilidad con el formato antiguo
}

interface NewsItem {
  _id: string;
  title: string;
  sections: Section[];
  date: string;
  category: string;
}

const ITEMS_PER_PAGE = 12;

const NewsSection: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNews();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_ROUTES.NEWS);
      // Ordenar noticias por fecha (de más reciente a más antigua)
      const sortedNews = [...res.data].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setNewsItems(sortedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get image URL (compatible with both old and new formats)
  const getImageUrl = (section: Section): string | undefined => {
    // First try new format
    if (section.images && section.images.length > 0) {
      return section.images[0].url;
    }
    // Fall back to old format
    else if (section.imageUrl) {
      return section.imageUrl;
    }
    return undefined;
  };

  // Extract unique categories
  const categories = ['Todas', ...Array.from(new Set(newsItems.map(item => item.category)))];

  // Filter news by search term and category
  const filteredNews = newsItems.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || n.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  // Featured news (first item) from current page
  const featuredNews = currentItems.length > 0 ? currentItems[0] : null;
  // Regular news (remaining items) from current page
  const regularNews = currentItems.length > 1 ? currentItems.slice(1) : [];

  // Format date function with more elegant styling
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Get first paragraph of news content
  const getExcerpt = (sections: Section[]) => {
    const contentSection = sections.find(s => s.text);
    if (contentSection) {
      const text = contentSection.text;
      return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }
    return '';
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to first or last page
  const goToFirstPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToLastPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(totalPages);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Less than max pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // More than max pages, show selected range
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <section className="pt-28 pb-24 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-serif font-normal text-gray-900 mb-8 md:mb-0 relative"
          >
            <span className="inline-block border-b border-gray-400 pb-1">
              Últimas Noticias
            </span>
          </motion.h2>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar noticias..."
              className="w-full pl-10 p-2 border-b border-gray-200 focus:outline-none focus:border-gray-900 bg-transparent text-gray-800 font-serif"
            />
          </div>
        </div>

        {/* Category filters - más elegantes y minimalistas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-3 mb-16 justify-center"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-serif transition-all ${
                activeCategory === category
                  ? 'text-white bg-gray-900'
                  : 'text-gray-700 bg-white border border-gray-200 hover:border-gray-400'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          /* Skeleton loader with refined styling */
          <div className="space-y-16">
            <div className="w-full h-96 bg-gray-100 animate-pulse"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 h-64 animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif text-gray-700 mb-3">No se encontraron noticias</h3>
            <p className="text-gray-500 font-serif italic">Intenta con otra búsqueda o categoría</p>
          </div>
        ) : (
          <>
            {/* Featured news - diseño destacado */}
            {featuredNews && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-24"
              >
                <Link to={`/noticias/${featuredNews._id}`} className="block group">
                  <div className="grid md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-7 lg:col-span-8 order-2 md:order-1">
                      <span className="inline-block text-xs font-medium uppercase tracking-wider border border-gray-900 px-2 py-1 mb-5 text-gray-900">
                        {featuredNews.category}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 mb-6 leading-tight group-hover:text-gray-700 transition-colors">
                        {featuredNews.title}
                      </h3>
                      <p className="text-gray-600 mb-6 font-serif leading-relaxed">
                        {getExcerpt(featuredNews.sections)}
                      </p>
                      <div className="flex items-center text-gray-500">
                        <time className="text-sm font-serif italic">{formatDate(featuredNews.date)}</time>
                        <span className="mx-3 text-xs">•</span>
                        <span className="text-sm font-serif inline-flex items-center">
                          Leer artículo
                          <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-5 lg:col-span-4 order-1 md:order-2">
                      <div className="aspect-w-4 aspect-h-5 overflow-hidden">
                        <img
                          src={featuredNews.sections[0] ? getImageUrl(featuredNews.sections[0]) : '/placeholder-news.jpg'}
                          alt={featuredNews.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Divider after featured news */}
            {regularNews.length > 0 && (
              <div className="border-t border-gray-100 mb-16"></div>
            )}

            {/* Regular news grid - estilo minimalista y elegante */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {regularNews.map((news, i) => (
                <motion.article
                  key={news._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group"
                >
                  <Link to={`/noticias/${news._id}`} className="block">
                    <div className="aspect-w-16 aspect-h-9 mb-5 overflow-hidden">
                      <img
                        src={news.sections[0] ? getImageUrl(news.sections[0]) : '/placeholder-news.jpg'}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                        {news.category}
                      </span>
                      <h3 className="text-xl font-serif mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 mb-3 font-serif line-clamp-2 text-sm">
                        {getExcerpt(news.sections)}
                      </p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <time className="font-serif italic">
                          {formatDate(news.date)}
                        </time>
                        <span className="mx-2">•</span>
                        <span className="text-gray-900 font-serif inline-flex items-center">
                          Leer
                          <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Pagination controls with first/last page buttons */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <nav className="inline-flex items-center">
                  {/* First page button */}
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Ir a la primera página"
                  >
                    <ChevronsLeft size={18} />
                  </button>
                  
                  {/* Previous page button */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {/* Page numbers */}
                  {getPageNumbers().map(number => (
                    <button
                      key={number}
                      onClick={() => goToPage(number)}
                      className={`flex items-center justify-center w-10 h-10 text-sm font-serif transition-colors ${
                        currentPage === number
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      aria-label={`Ir a página ${number}`}
                      aria-current={currentPage === number ? 'page' : undefined}
                    >
                      {number}
                    </button>
                  ))}
                  
                  {/* Next page button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Página siguiente"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  {/* Last page button - exactly what you requested */}
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Ir a la última página"
                  >
                    <ChevronsRight size={18} />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default NewsSection;