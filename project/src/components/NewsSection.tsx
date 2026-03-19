import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, ChevronsRight, ChevronsLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_ROUTES from '../config/api';
import { getCache, setCache } from '../utils/apiCache';
import LazyImage from './LazyImage';

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
  imageUrl?: string;
  videoUrl?: string;
}

interface NewsItem {
  _id: string;
  title: string;
  sections: Section[];
  date: string;
  category: string;
}

const ITEMS_PER_PAGE = 13;

const NewsSection: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const fetchNews = async () => {
    // ── Cache hit: zero-latency render ──
    const cached = getCache<NewsItem[]>('news');
    if (cached) {
      const sorted = [...cached].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setNewsItems(sorted);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.get(API_ROUTES.NEWS);
      setCache('news', res.data, 120_000); // 2 min TTL
      const sortedNews = [...res.data].sort((a: NewsItem, b: NewsItem) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setNewsItems(sortedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getYouTubeThumbnail = (videoUrl: string): string => {
    const match = videoUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
  };

  const getImageUrl = (section: Section): string | undefined => {
    if (section.images?.length) return section.images[0].url;
    if (section.imageUrl)       return section.imageUrl;
    if (section.videoUrl)       return getYouTubeThumbnail(section.videoUrl) || undefined;
    return undefined;
  };

  const sectionHasVideo = (section: Section): boolean =>
    !!(section.videoUrl && !section.images?.length && !section.imageUrl);

  const categories = ['Todas', ...Array.from(new Set(newsItems.map(item => item.category)))];

  const filteredNews = newsItems.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || n.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  const featuredNews = currentItems.length > 0 ? currentItems[0] : null;
  const regularNews = currentItems.length > 1 ? currentItems.slice(1) : [];

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('T')[0].split('-');
    return new Date(`${year}-${month}-${day}T12:00:00`).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getExcerpt = (sections: Section[]) => {
    const contentSection = sections.find(s => s.text);
    if (contentSection) {
      const text = contentSection.text;
      return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }
    return '';
  };

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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const milestoneInterval = 10; // Show pages at intervals of 10 (e.g., 10, 20, 30...)
    
    // Always include the first page
    pages.push(1);

    // Calculate milestone pages (e.g., 10, 20, 30...)
    let milestone = milestoneInterval;
    while (milestone <= totalPages) {
      if (milestone !== 1 && milestone !== totalPages) {
        // Add milestone if it's not the first or last page
        if (Math.abs(milestone - currentPage) <= 5 || milestone % 10 === 0) {
          pages.push(milestone);
        }
      }
      milestone += milestoneInterval;
    }

    // Add pages around the current page
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Always include the last page if there are more than 1 page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    // Sort pages numerically
    const sortedPages = [...new Set(pages.filter(p => typeof p === 'number'))].sort((a, b) => Number(a) - Number(b));

    // Add ellipses between non-consecutive pages
    const finalPages: (number | string)[] = [];
    for (let i = 0; i < sortedPages.length; i++) {
      finalPages.push(sortedPages[i]);
      if (i < sortedPages.length - 1 && sortedPages[i + 1] - sortedPages[i] > 1) {
        finalPages.push('...');
      }
    }

    return finalPages;
  };

  return (
    <section className="pt-28 pb-24" style={{ backgroundColor: 'var(--color-surface)' }}>
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
              className="px-4 py-2 text-sm font-serif transition-all"
              style={activeCategory === category
                ? { backgroundColor: 'var(--color-primary)', color: '#ffffff' }
                : { color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }
              }
            >
              {category}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="space-y-16">
            <div className="skeleton w-full h-96 rounded"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-64 rounded"></div>
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
                    <div className="md:col-span-5 lg:col-span-4 order-1 md:order-2 relative">
                      <LazyImage
                        src={featuredNews.sections[0] ? getImageUrl(featuredNews.sections[0]) || '/placeholder-news.jpg' : '/placeholder-news.jpg'}
                        alt={featuredNews.title}
                        wrapperClassName="aspect-w-4 aspect-h-5 overflow-hidden"
                        imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                      {featuredNews.sections[0] && sectionHasVideo(featuredNews.sections[0]) && (
                        <span className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white pointer-events-none">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {regularNews.length > 0 && (
              <div className="border-t mb-16" style={{ borderColor: 'var(--color-border-subtle)' }}></div>
            )}

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
                    <div className="relative mb-5">
                      <LazyImage
                        src={news.sections[0] ? getImageUrl(news.sections[0]) || '/placeholder-news.jpg' : '/placeholder-news.jpg'}
                        alt={news.title}
                        wrapperClassName="aspect-w-16 aspect-h-9 overflow-hidden"
                        imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {news.sections[0] && sectionHasVideo(news.sections[0]) && (
                        <span className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white pointer-events-none">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </span>
                      )}
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

            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <nav className="inline-flex items-center">
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

                  {getPageNumbers().map((number, index) => (
                    typeof number === 'number' ? (
                      <button
                        key={index}
                        onClick={() => goToPage(number)}
                        className="flex items-center justify-center w-10 h-10 text-sm font-serif transition-colors"
                        style={currentPage === number
                          ? { backgroundColor: 'var(--color-primary)', color: '#ffffff' }
                          : { color: 'var(--color-text-secondary)' }
                        }
                        aria-label={`Ir a página ${number}`}
                        aria-current={currentPage === number ? 'page' : undefined}
                      >
                        {number}
                      </button>
                    ) : (
                      <span
                        key={index}
                        className="flex items-center justify-center w-10 h-10 text-sm font-serif"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {number}
                      </span>
                    )
                  ))}

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