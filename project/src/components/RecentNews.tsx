// src/components/RecentNews.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Users, Play } from 'lucide-react';

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

const RecentNews: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/news');
      const sortedNews = [...res.data].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setNewsItems(sortedNews.slice(0, 4));
    } catch (error) {
      console.error('Error fetching recent news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (section: Section): string | undefined => {
    if (section.images && section.images.length > 0) {
      return section.images[0].url;
    } else if (section.imageUrl) {
      return section.imageUrl;
    }
    return undefined;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    const formattedDate = date.toLocaleDateString('es-ES', dateOptions).replace(',', '');
    const formattedTime = date.toLocaleTimeString('es-ES', timeOptions);
    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <section className="recent-news bg-white py-10">
      <div className="max-w-4xl mx-auto px-5">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 inline-block">
  NOTICIAS RECIENTES
  <span className="block h-1 bg-blue-600 animate-underline w-full"></span>
</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {newsItems.map((news) => (
                <Link
                  to={`/noticias/${news._id}`}
                  key={news._id}
                  className="news-item bg-white shadow-sm"
                >
                  <div className="relative w-full h-48">
                    <img
                      src={
                        news.sections[0]
                          ? getImageUrl(news.sections[0])
                          : '/placeholder-news.jpg'
                      }
                      alt={news.title}
                      className="w-full h-full object-cover mb-4"
                    />
                    <div className="absolute bottom-4 left-4 flex items-center bg-[#c00] text-white text-xs font-semibold px-2 py-1">
                      <span>{news.category.toUpperCase()}</span>
                      <Users size={12} className="ml-1" />
                      <Play size={12} className="ml-1" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">
                      {formatDate(news.date)}
                    </p>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {news.sections[0]?.text || ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link
                to="/noticias"
                className="inline-block text-white px-6 py-3 font-semibold bg-blue-600 border-2 border-blue-600 rounded-md transition-all duration-300 ease-in-out hover:bg-transparent hover:text-blue-600 hover:scale-105"
              >
                Todas las noticias →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default RecentNews;