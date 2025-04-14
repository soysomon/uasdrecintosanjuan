import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_ROUTES from '../../config/api';

// Definición de interfaces
interface Slide {
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  cta: {
    text: string;
    link: string;
  };
  image: string;
  color: string;
  order: number;
  displayMode?: 'normal' | 'hover';
}

const defaultSlides: Slide[] = [
  {
    title: "UASD RECINTO SAN JUAN",
    subtitle: "",
    description: "Convocatoria para Becas 2025",
    cta: { text: "Explorar más", link: "/admisiones" },
    image: '/images/graduacion.jpg',
    color: "#003087",
    order: 0,
    displayMode: 'normal',
  },
  {
    title: "MAESTRÍA EN GESTIÓN EDUCATIVA",
    subtitle: "POSGRADOS",
    description: "Especialización de alto nivel para profesionales de la educación",
    cta: { text: "Conocer oferta completa", link: "/carreras/postgrado" },
    image: '/images/postgrado.png',
    color: "#45046A",
    order: 1,
    displayMode: 'normal',
  },
  {
    title: "LICENCIATURA EN INFORMÁTICA",
    subtitle: "TECNOLOGÍA",
    description: "Prepárate para liderar la transformación digital del futuro",
    cta: { text: "Explorar programa", link: "/carreras/grado" },
    image: '/images/informatica.jpg',
    color: "#004A98",
    order: 2,
    displayMode: 'normal',
  },
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const slideDuration = 8000;
  const progressInterval = 50;

  const handleSlideChange = useCallback((direction: 'next' | 'prev') => {
    setIsAutoPlaying(false);
    setProgress(0);
    setImageError(false);
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [slides.length]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(API_ROUTES.SLIDES);
        console.log('Respuesta de la API:', res.data);
        if (res.data.length > 0) {
          const formattedSlides = res.data.map((slide: any) => ({
            title: slide.title,
            subtitle: slide.subtitle || "",
            description: slide.description,
            cta: slide.cta,
            image: slide.image || '/images/fallback.jpg',
            color: slide.color,
            order: slide.order,
            displayMode: slide.displayMode || 'normal',
          }));
          setSlides(formattedSlides);
          if (currentSlide >= formattedSlides.length) {
            setCurrentSlide(0);
          }
        } else {
          console.warn('La API no devolvió slides, usando defaultSlides');
          setSlides(defaultSlides);
        }
      } catch (err) {
        console.error('Error al cargar slides:', err);
        setSlides(defaultSlides);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    setProgress(0);
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (progressInterval / slideDuration) * 100;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, progressInterval);
    const slideTimer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0);
      setImageError(false);
    }, slideDuration);
    return () => {
      clearTimeout(slideTimer);
      clearInterval(progressTimer);
    };
  }, [isAutoPlaying, currentSlide, slides.length]);

  const sortedSlides = useMemo(() => {
    return [...slides].sort((a, b) => a.order - b.order);
  }, [slides]);

  return (
    <section className="relative bg-white h-auto sm:min-h-[60vh] md:min-h-[65vh] w-full overflow-hidden">
      {sortedSlides.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="relative flex items-center justify-center w-full h-full"
          >
            <div className="w-full transform sm:scale-100 scale-110 sm:mx-0 mx-4 sm:h-full h-auto relative group">
              <div className="absolute inset-0 overflow-hidden">
                {imageError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">No se pudo cargar la imagen</p>
                  </div>
                ) : (
                  <img
                    src={sortedSlides[currentSlide].image}
                    alt={sortedSlides[currentSlide].title}
                    className="w-full h-full sm:object-cover object-contain object-center"
                    onError={() => setImageError(true)}
                    loading="lazy"
                  />
                )}
                {sortedSlides[currentSlide].displayMode === 'hover' && (
                  <>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{
                        backdropFilter: 'blur(3px)',
                        WebkitBackdropFilter: 'blur(3px)',
                        backgroundColor: `${sortedSlides[currentSlide].color}AA`,
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                      <div className="max-w-3xl px-2 sm:px-4 text-center">
                        {sortedSlides[currentSlide].subtitle && (
                          <span className="inline-block bg-white/20 px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-white text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2">
                            {sortedSlides[currentSlide].subtitle}
                          </span>
                        )}
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                          {sortedSlides[currentSlide].title}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-white/90 mb-2 sm:mb-4 font-light">
                          {sortedSlides[currentSlide].description}
                        </p>
                        <Link
                          to={sortedSlides[currentSlide].cta.link}
                          className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
                        >
                          {sortedSlides[currentSlide].cta.text}
                          <ArrowRight className="ml-1 sm:ml-2 w-3 sm:w-4 h-3 sm:h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
                {sortedSlides[currentSlide].displayMode !== 'hover' && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right, ${sortedSlides[currentSlide].color}E6 0%, ${sortedSlides[currentSlide].color}CC 50%, ${sortedSlides[currentSlide].color}99 100%)`,
                    }}
                  ></div>
                )}
              </div>
              {sortedSlides[currentSlide].displayMode !== 'hover' && (
                <div className="relative h-full max-w-7xl mx-auto flex items-center">
                  <div className="w-full px-2 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
                    {sortedSlides[currentSlide].subtitle && (
                      <span className="inline-block bg-white/20 px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-white text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2">
                        {sortedSlides[currentSlide].subtitle}
                      </span>
                    )}
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                      {sortedSlides[currentSlide].title}
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-white/90 mb-2 sm:mb-4 font-light">
                      {sortedSlides[currentSlide].description}
                    </p>
                    <Link
                      to={sortedSlides[currentSlide].cta.link}
                      className="group inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
                    >
                      {sortedSlides[currentSlide].cta.text}
                      <ArrowRight className="ml-1 sm:ml-2 w-3 sm:w-4 h-3 sm:h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      {sortedSlides.length > 0 && (
        <div className="relative bottom-2 sm:bottom-4 left-0 right-0 flex flex-col items-center z-10">
          {isAutoPlaying && (
            <div className="w-24 sm:w-32 h-1 bg-white/30 rounded-full mb-1 sm:mb-2 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          )}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleSlideChange('prev')}
              className="p-1 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
            </button>
            <div className="flex gap-1 sm:gap-2">
              {sortedSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoPlaying(false);
                    setProgress(0);
                    setImageError(false);
                  }}
                  className={`h-1.5 sm:h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-white w-4 sm:w-6' : 'bg-white/40 w-1.5 sm:w-2 hover:bg-white/60'
                  }`}
                  aria-label={`Ir al slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => handleSlideChange('next')}
              className="p-1 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
              aria-label="Siguiente slide"
            >
              <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
            </button>
            <button
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              className="p-1 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20 ml-1 sm:ml-2"
              aria-label={isAutoPlaying ? "Pausar reproducción automática" : "Iniciar reproducción automática"}
            >
              {isAutoPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 sm:w-4 h-3 sm:h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 sm:w-4 h-3 sm:h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>
          </div>
          {isAutoPlaying && (
            <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 sm:mt-1">
              {Math.ceil((slideDuration - (progress * slideDuration / 100)) / 1000)}s
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;