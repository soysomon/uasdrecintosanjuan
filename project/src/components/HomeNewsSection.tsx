import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Share2 } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
}

interface NewsItem {
  _id: string;
  title: string;
  sections: Section[];
  date: string;
  category: string;
}


const HomeNewsSection: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isShareOpen, setIsShareOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/news');
      // Ordenar por fecha (asumiendo que 'date' es una cadena válida) y tomar las 3 más recientes
      const sortedNews = res.data.sort((a: NewsItem, b: NewsItem) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
      setNewsItems(sortedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
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

  const filteredNews = newsItems.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleShareNews = (news: NewsItem) => {
    const url = `http://localhost:5173/noticias/${news._id}`;
    const title = news.title;
    if (navigator.share) {
      navigator.share({
        title,
        url,
      }).catch((err) => console.error('Error sharing:', err));
    } else {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank');
    }
  };

  return (
    <section className="py-6 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 mt-1">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
          </div>
        </div>

    {isShareOpen === 'section' && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-16 right-6 w-12 bg-gray-200 text-gray-900 flex flex-col items-center py-3 space-y-3 overflow-hidden rounded-xl shadow-lg"
      >
        <button onClick={() => handleShareNews({ _id: '', title: 'Últimas Noticias', sections: [], date: '', category: '' })} className="focus:outline-none">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.77 7h-4.23l1.52-4.94C16.38 1.39 15.54 1 14.82 1H9.18C8.46 1 7.62 1.39 7.34 2.06L8.46 7H4.23c-1.24 0-2.25 1.01-2.25 2.25v9.5c0 1.24 1.01 2.25 2.25 2.25h13.54c1.24 0 2.25-1.01 2.25-2.25v-9.5C21 8.01 19.99 7 18.77 7zm-6.54 10h-2v-2h2v2zm2.5-4.5h-5v-2h5v2zm2.5 4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"/>
          </svg>
        </button>
        <button onClick={() => setIsShareOpen(null)} className="focus:outline-none">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </motion.div>
    )}

    {/* Barra de búsqueda */}
    <div className="relative mb-10">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar noticias..."
        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
      />
    </div>

    {/* Noticias (solo las 3 más recientes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredNews.map((n, i) => (
            <div key={n._id} style={{ willChange: 'auto' }}>
              {/* Usar CSS puro en lugar de motion para la animación de hover */}
              <div
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative transform hover:scale-105"
                style={{ transformOrigin: 'center', transformBox: 'view-box' }}
              >
                {n.sections[0] && getImageUrl(n.sections[0]) && (
                  <img
                    src={getImageUrl(n.sections[0])}
                    alt={n.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{n.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{n.date}</p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/noticias/${n._id}`}
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
                    >
                      Leer más
                    </Link>
                    <button
                      onClick={() => setIsShareOpen(n._id)}
                      className="text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeNewsSection;



