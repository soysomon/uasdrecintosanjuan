import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import logoUASD from '../img/logouasd.png';
import API_ROUTES from '../config/api';

interface ImageDisplayOptions {
  size: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
  caption?: string;
  cropMode: 'cover' | 'contain' | 'none';
  layout?: 'horizontal' | 'vertical';
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
  author?: string;
  readTime?: string;
}

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const articleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';

    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      /youtube\.com\/shorts\/([^"?\/\s]{11})/i,
      /youtube\.com\/live\/([^"?\/\s]{11})/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    if (url.includes('/embed/')) {
      return url;
    }

    console.warn('No se pudo parsear la URL de YouTube:', url);
    return url;
  };

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(API_ROUTES.NEWS_BY_ID(id!));
        const wordCount = res.data.sections.reduce(
          (count: number, section: Section) =>
            count + (section.text ? section.text.split(/\s+/).length : 0),
          0
        );
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        setNews({
          ...res.data,
          readTime: `${readTime} min de lectura`,
        });

        await fetchRelatedNews(res.data.category, res.data._id, res.data.date);
      } catch (err) {
        console.error('Error al obtener noticia:', err);
        setError('No se pudo cargar la noticia.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const fetchRelatedNews = async (category: string, currentId: string, currentDate: string) => {
    try {
      const prevNewsRes = await axios.get(API_ROUTES.NEWS, {
        params: {
          limit: 4,
          date_lt: currentDate,
          sort: '-date',
          _id_ne: currentId,
        },
      });

      if (prevNewsRes.data.length >= 4) {
        setRelatedNews(prevNewsRes.data.slice(0, 4));
        return;
      }

      const categoryNewsRes = await axios.get(API_ROUTES.NEWS, {
        params: {
          category,
          limit: 4,
          _id_ne: currentId,
          sort: '-date',
        },
      });

      if (categoryNewsRes.data.length > 0) {
        const combined = [...prevNewsRes.data, ...categoryNewsRes.data];
        const uniqueNews = Array.from(new Map(combined.map((item) => [item._id, item])).values());
        setRelatedNews(uniqueNews.slice(0, 4));
        return;
      }

      const recentNewsRes = await axios.get(API_ROUTES.NEWS, {
        params: {
          limit: 4,
          _id_ne: currentId,
          sort: '-date',
        },
      });

      setRelatedNews(recentNewsRes.data.slice(0, 4));
    } catch (err) {
      console.error('Error al obtener noticias relacionadas:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const articleTop = element.getBoundingClientRect().top + scrollTop;
      const articleHeight = element.offsetHeight;

      if (scrollTop < articleTop) {
        setReadingProgress(0);
      } else if (scrollTop > articleTop + articleHeight - windowHeight) {
        setReadingProgress(100);
      } else {
        const scrolledArticleHeight = scrollTop - articleTop;
        const readableArticleHeight = articleHeight - windowHeight;
        const percentage = Math.max(
          0,
          Math.min(100, (scrolledArticleHeight / readableArticleHeight) * 100)
        );
        setReadingProgress(percentage);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const getImageUrl = (section: Section): string | undefined => {
    if (section.images && section.images.length > 0) {
      return section.images[0].url;
    } else if (section.imageUrl) {
      return section.imageUrl;
    }
    return undefined;
  };

  if (isLoading) {
    return (
      <div className="py-12 min-h-screen bg-white animate-pulse">
        <div className="max-w-2xl mx-auto px-5">
          <div className="h-8 bg-gray-100 rounded w-2/3 mb-8"></div>
          <div className="flex space-x-4 mb-12">
            <div className="h-4 bg-gray-100 rounded w-24"></div>
            <div className="h-4 bg-gray-100 rounded w-20"></div>
          </div>
          <div className="h-96 bg-gray-100 rounded-lg mb-12"></div>
          <div className="space-y-4">
            <div className="h-3 bg-gray-100 rounded w-full"></div>
            <div className="h-3 bg-gray-100 rounded w-full"></div>
            <div className="h-3 bg-gray-100 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h2 className="text-xl font-serif text-red-800 mb-2">Error</h2>
            <p className="text-red-600 font-light">{error}</p>
            <Link
              to="/noticias"
              className="mt-6 inline-block px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors duration-300"
            >
              Volver a noticias
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!news) return null;

  const getExcerpt = (sections: Section[]) => {
    for (const section of sections) {
      if (section.text) {
        const paragraphs = section.text.split('\n');
        return paragraphs[0].substring(0, 150) + '...';
      }
    }
    return '';
  };

  const getFirstImage = (sections: Section[]) => {
    for (const section of sections) {
      const imageUrl = getImageUrl(section);
      if (imageUrl) {
        return imageUrl;
      }
    }
    return '/placeholder-news.jpg';
  };

  const renderSectionImage = (image: NewsImage, isFeatured: boolean = false) => {
    const displayOptions = image.displayOptions;
    const caption = displayOptions?.caption;

    if (isFeatured) {
      return (
        <figure className="my-12 -mx-5 md:mx-0 md:-mx-20 lg:-mx-32">
          <div className="overflow-hidden rounded-lg">
            <div className="relative">
              <img
                src={image.url}
                alt="Imagen destacada de la noticia"
                className="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity max-h-[70vh]"
                onClick={() => handleImageClick(image.url)}
              />
            </div>
          </div>
          {caption && (
            <figcaption className="text-sm text-gray-500 mt-3 font-serif italic text-center px-5 md:px-0">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    const containerClasses = `${
      displayOptions.alignment === 'left'
        ? 'mr-auto'
        : displayOptions.alignment === 'right'
        ? 'ml-auto'
        : 'mx-auto'
    } ${
      displayOptions.size === 'small'
        ? 'max-w-sm'
        : displayOptions.size === 'medium'
        ? 'max-w-lg'
        : displayOptions.size === 'large'
        ? 'max-w-xl'
        : 'w-full'
    }`;

    return (
      <figure className="my-10">
        <div className={`overflow-hidden rounded-lg ${containerClasses}`}>
          <div className="relative">
            <img
              src={image.url}
              alt="Imagen de la noticia"
              className={`w-full cursor-pointer hover:opacity-95 transition-opacity ${
                displayOptions.cropMode === 'cover'
                  ? 'object-cover h-64 md:h-80'
                  : displayOptions.cropMode === 'contain'
                  ? 'object-contain h-64 md:h-80'
                  : 'object-none'
              }`}
              onClick={() => handleImageClick(image.url)}
            />
          </div>
        </div>
        {caption && (
          <figcaption className="text-sm text-gray-500 mt-3 font-serif italic text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  };

  const renderSectionContent = (section: Section, index: number) => {
    return (
      <div key={index} className="mb-8">
        {section.images && section.images.length > 0 && (
          <div className="my-12">
            {section.images.length === 1 || index === 0 ? (
              renderSectionImage(section.images[0], true)
            ) : section.images[0].displayOptions.layout === 'horizontal' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.images.map((image, idx) => (
                  <figure
                    key={idx}
                    className="overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(image.url)}
                  >
                    <div className="relative">
                      <img
                        src={image.url}
                        alt={`Imagen ${idx + 1} de la sección`}
                        className={`w-full h-64 sm:h-80 ${
                          image.displayOptions?.cropMode === 'cover'
                            ? 'object-cover'
                            : image.displayOptions?.cropMode === 'contain'
                            ? 'object-contain'
                            : 'object-none'
                        }`}
                      />
                      {image.displayOptions?.caption && (
                        <figcaption className="text-sm text-gray-500 mt-3 font-serif italic text-center">
                          {image.displayOptions.caption}
                        </figcaption>
                      )}
                    </div>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="space-y-12">
                {section.images.map((image, idx) => (
                  <div key={idx}>
                    {renderSectionImage(image, true)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section.imageUrl && (
          <figure className="my-12 -mx-5 md:mx-0 md:-mx-20 lg:-mx-32">
            <div className="overflow-hidden rounded-lg">
              <div className="relative">
                <img
                  src={section.imageUrl}
                  alt="Imagen de la noticia"
                  className="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity max-h-[70vh]"
                  onClick={() => handleImageClick(section.imageUrl!)}
                />
              </div>
            </div>
          </figure>
        )}

        {section.videoUrl && (
          <figure className="my-12">
            <div className="relative pt-[56.25%] max-w-4xl mx-auto">
              <iframe
                src={getYoutubeEmbedUrl(section.videoUrl)}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`Video de la sección ${index + 1}`}
              />
            </div>
          </figure>
        )}

        {section.text && (
          <div className="text-gray-800 leading-relaxed">
            {section.text.split('\n').map((paragraph, pIndex) => (
              <p key={pIndex} className="mb-6 text-lg font-serif leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Ajustar manualmente a UTC-4 (America/Santo_Domingo no tiene horario de verano)
    const offsetMinutes = -240; // UTC-4 en minutos
    const adjustedDate = new Date(date.getTime() + offsetMinutes * 60 * 1000);
    return adjustedDate.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white shadow-sm">
        <div
          className="h-full bg-black transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
          aria-hidden="true"
          role="progressbar"
          aria-valuenow={readingProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>

      <div ref={articleRef} className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-5">
          <div className="flex items-center justify-center mb-12">
            <div className="w-20 h-20 mr-3">
              <img
                src={logoUASD}
                alt="UASD Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="border-l pl-3 border-gray-200">
              <span className="block text-sm font-serif text-gray-800">
                Universidad Autónoma de Santo Domingo - Recinto San Juan
              </span>
              <span className="block text-xs font-serif italic text-gray-500">
                Primada de América
              </span>
            </div>
          </div>

          <header className="mb-10 text-center">
            <div className="mb-4">
              <span className="inline-block px-2 py-1 text-xs font-medium tracking-wider uppercase border border-gray-900 text-gray-900">
                {news.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-gray-900 leading-tight mb-6 max-w-xl mx-auto">
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-x-5 text-sm text-gray-500 font-light">
              <time className="font-serif italic">{formatDate(news.date)}</time>
              <span className="hidden sm:inline">•</span>
              <span className="font-serif">{news.readTime}</span>
              {news.author && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="font-serif">Por {news.author}</span>
                </>
              )}
            </div>
          </header>

          <div ref={contentRef}>
            <article className="max-w-none font-serif">
              {news.sections.map((section, index) =>
                renderSectionContent(section, index)
              )}
            </article>

            <div className="my-16 border-t border-gray-200"></div>

            <div className="mb-16">
              <h3 className="text-lg font-serif mb-8 italic text-center">
                Lecturas relacionadas
              </h3>
              {relatedNews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                  {relatedNews.slice(0, 4).map((item) => (
                    <Link
                      key={item._id}
                      to={`/noticias/${item._id}`}
                      className="group block"
                    >
                      <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden">
                        <img
                          src={getFirstImage(item.sections)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-gray-500 mb-2 block font-sans">
                          {item.category}
                        </span>
                        <h4 className="font-serif mb-2 group-hover:text-gray-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2 font-serif">
                          {getExcerpt(item.sections)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="border border-gray-100 p-5 hover:border-gray-200 transition">
                    <span className="text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                      {news.category}
                    </span>
                    <h4 className="font-serif mb-2">
                      Próximas competencias deportivas en el campus UASD
                    </h4>
                    <p className="text-sm text-gray-500 font-serif">
                      Conoce el calendario de eventos deportivos para el próximo
                      trimestre.
                    </p>
                  </div>
                  <div className="border border-gray-100 p-5 hover:border-gray-200 transition">
                    <span className="text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                      {news.category}
                    </span>
                    <h4 className="font-serif mb-2">
                      Destacada participación de estudiantes en torneos nacionales
                    </h4>
                    <p className="text-sm text-gray-500 font-serif">
                      Nuestros atletas representaron con orgullo a la universidad.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-5 mb-16">
              <span className="text-sm text-gray-500 font-serif">Compartir:</span>

              <button
                onClick={() =>
                  window.open(
                    'https://www.facebook.com/sharer/sharer.php?u=' +
                      encodeURIComponent(window.location.href),
                    '_blank'
                  )
                }
                className="w-9 h-9 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Compartir en Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>

              <button
                onClick={() =>
                  window.open(
                    'https://x.com/intent/tweet?url=' +
                      encodeURIComponent(window.location.href),
                    '_blank'
                  )
                }
                className="w-9 h-9 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Compartir en X"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>

              <button
                onClick={() =>
                  window.open(
                    'https://api.whatsapp.com/send?text=' +
                      encodeURIComponent(window.location.href),
                    '_blank'
                  )
                }
                className="w-9 h-9 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Compartir en WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/noticias"
                className="inline-flex items-center px-5 py-2.5 text-sm font-serif border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Volver a noticias
              </Link>
            </div>
          </div>
        </div>
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={lightboxImage}
            alt="Imagen ampliada"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;