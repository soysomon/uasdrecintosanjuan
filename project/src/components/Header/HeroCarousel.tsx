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

interface SlideProps {
  slides: Slide[];
  currentSlide: number;
  imageError: boolean;
  setImageError: (error: boolean) => void;
  handleSlideChange: (direction: 'next' | 'prev' | number) => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
  progress: number;
  slideDuration: number;
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

// Subcomponente para móviles
const MobileSlide: React.FC<SlideProps> = ({
  slides,
  currentSlide,
  imageError,
  setImageError,
  handleSlideChange,
  isAutoPlaying,
  setIsAutoPlaying,
  progress,
  slideDuration,
}) => {
  // Depuración: Verificar los datos recibidos
  console.log('MobileSlide - Slides:', slides);
  console.log('MobileSlide - Current Slide:', currentSlide);

  return (
    <section className="relative bg-white w-full overflow-hidden flex flex-col items-center">
      <div className="w-full h-auto min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full transform scale-100 mx-4 relative group"
          >
            <div className="relative w-full min-h-[200px] overflow-hidden">
              {imageError ? (
                <div className="w-full min-h-[200px] flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500">No se pudo cargar la imagen</p>
                </div>
              ) : (
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="w-full h-auto object-contain object-center"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              )}
              {slides[currentSlide].displayMode === 'hover' && (
                <>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      backdropFilter: 'blur(3px)',
                      WebkitBackdropFilter: 'blur(3px)',
                      backgroundColor: `${slides[currentSlide].color}AA`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                    <div className="max-w-3xl px-2 text-center">
                      {slides[currentSlide].subtitle && (
                        <span className="inline-block bg-white/20 px-1 py-0.5 rounded-md text-white text-[10px] font-semibold mb-1">
                          {slides[currentSlide].subtitle}
                        </span>
                      )}
                      <h1 className="text-lg font-bold text-white mb-1 leading-tight">
                        {slides[currentSlide].title}
                      </h1>
                      <p className="text-xs text-white/90 mb-2 font-light">
                        {slides[currentSlide].description}
                      </p>
                      <Link
                        to={slides[currentSlide].cta.link}
                        className="inline-flex items-center px-3 py-1 bg-white text-gray-900 rounded-md font-medium hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg text-xs"
                      >
                        {slides[currentSlide].cta.text}
                        <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </>
              )}
              {slides[currentSlide].displayMode !== 'hover' && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, ${slides[currentSlide].color}E6 0%, ${slides[currentSlide].color}CC 50%, ${slides[currentSlide].color}99 100%)`,
                  }}
                ></div>
              )}
            </div>
            {slides[currentSlide].displayMode !== 'hover' && (
              <div className="relative w-full max-w-7xl mx-auto flex items-center">
                <div className="w-full px-2 py-6">
                  {slides[currentSlide].subtitle && (
                    <span className="inline-block bg-white/20 px-1 py-0.5 rounded-md text-white text-[10px] font-semibold mb-1">
                      {slides[currentSlide].subtitle}
                    </span>
                  )}
                  <h1 className="text-lg font-bold text-white mb-1 leading-tight">
                    {slides[currentSlide].title}
                  </h1>
                  <p className="text-xs text-white/90 mb-2 font-light">
                    {slides[currentSlide].description}
                  </p>
                  <Link
                    to={slides[currentSlide].cta.link}
                    className="group inline-flex items-center px-3 py-1 bg-white text-gray-900 rounded-md font-medium hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg text-xs"
                  >
                    {slides[currentSlide].cta.text}
                    <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-full relative bottom-0 left-0 right-0 flex flex-col items-center z-10">
        {isAutoPlaying && (
          <div className="w-24 h-1 bg-white/30 rounded-full mb-1 overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSlideChange('prev')}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-3 h-3 text-white" />
          </button>
          <div className="flex gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  handleSlideChange(index);
                  setIsAutoPlaying(false);
                  setImageError(false);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white w-4' : 'bg-white/40 w-1.5 hover:bg-white/60'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => handleSlideChange('next')}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
            aria-label="Siguiente slide"
          >
            <ChevronRight className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20 ml-1"
            aria-label={isAutoPlaying ? "Pausar reproducción automática" : "Iniciar reproducción automática"}
          >
            {isAutoPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 text-white"
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
                className="w-3 h-3 text-white"
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
          <p className="text-[10px] text-white/70 mt-0.5">
            {Math.ceil((slideDuration - (progress * slideDuration / 100)) / 1000)}s
          </p>
        )}
      </div>
    </section>
  );
};

// Subcomponente para web
const DesktopSlide: React.FC<SlideProps> = ({
  slides,
  currentSlide,
  imageError,
  setImageError,
  handleSlideChange,
  isAutoPlaying,
  setIsAutoPlaying,
  progress,
  slideDuration,
}) => {
  return (
    <section className="relative bg-white min-h-[60vh] md:min-h-[65vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-full h-full relative group">
            <div className="absolute inset-0 overflow-hidden">
              {imageError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500">No se pudo cargar la imagen</p>
                </div>
              ) : (
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-cover object-center"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              )}
              {slides[currentSlide].displayMode === 'hover' && (
                <>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      backdropFilter: 'blur(3px)',
                      WebkitBackdropFilter: 'blur(3px)',
                      backgroundColor: `${slides[currentSlide].color}AA`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                    <div className="max-w-3xl px-4 text-center">
                      {slides[currentSlide].subtitle && (
                        <span className="inline-block bg-white/20 px-2 py-1 rounded-md text-white text-xs font-semibold mb-2">
                          {slides[currentSlide].subtitle}
                        </span>
                      )}
                      <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 leading-tight">
                        {slides[currentSlide].title}
                      </h1>
                      <p className="text-sm md:text-base text-white/90 mb-4 font-light">
                        {slides[currentSlide].description}
                      </p>
                      <Link
                        to={slides[currentSlide].cta.link}
                        className="inline-flex items-center px-4 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        {slides[currentSlide].cta.text}
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </>
              )}
              {slides[currentSlide].displayMode !== 'hover' && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, ${slides[currentSlide].color}E6 0%, ${slides[currentSlide].color}CC 50%, ${slides[currentSlide].color}99 100%)`,
                  }}
                ></div>
              )}
            </div>
            {slides[currentSlide].displayMode !== 'hover' && (
              <div className="relative h-full max-w-7xl mx-auto flex items-center">
                <div className="w-full px-4 md:px-8 py-8 md:py-12">
                  {slides[currentSlide].subtitle && (
                    <span className="inline-block bg-white/20 px-2 py-1 rounded-md text-white text-xs font-semibold mb-2">
                      {slides[currentSlide].subtitle}
                    </span>
                  )}
                  <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 leading-tight">
                    {slides[currentSlide].title}
                  </h1>
                  <p className="text-sm md:text-base text-white/90 mb-4 font-light">
                    {slides[currentSlide].description}
                  </p>
                  <Link
                    to={slides[currentSlide].cta.link}
                    className="group inline-flex items-center px-4 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg text-sm"
                  >
                    {slides[currentSlide].cta.text}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center z-10">
        {isAutoPlaying && (
          <div className="w-32 h-1 bg-white/30 rounded-full mb-2 overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSlideChange('prev')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  handleSlideChange(index);
                  setIsAutoPlaying(false);
                  setImageError(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white w-6' : 'bg-white/40 w-2 hover:bg-white/60'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => handleSlideChange('next')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
            aria-label="Siguiente slide"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20 ml-2"
            aria-label={isAutoPlaying ? "Pausar reproducción automática" : "Iniciar reproducción automática"}
          >
            {isAutoPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
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
                className="w-4 h-4 text-white"
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
          <p className="text-xs text-white/70 mt-1">
            {Math.ceil((slideDuration - (progress * slideDuration / 100)) / 1000)}s
          </p>
        )}
      </div>
    </section>
  );
};

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const slideDuration = 8000;
  const progressInterval = 50;

  // Detectar si es móvil o web
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // Equivalente al breakpoint 'sm' de Tailwind
    };

    checkMobile(); // Verificar al cargar
    window.addEventListener('resize', checkMobile); // Actualizar al cambiar el tamaño de la ventana

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSlideChange = useCallback((direction: 'next' | 'prev' | number) => {
    setIsAutoPlaying(false);
    setProgress(0);
    setImageError(false);
    if (typeof direction === 'number') {
      setCurrentSlide(direction);
    } else if (direction === 'next') {
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
    const sorted = [...slides].sort((a, b) => a.order - b.order);
    console.log('Sorted Slides:', sorted); // Para depuración
    return sorted;
  }, [slides]);

  return (
    <>
      {slides.length > 0 ? (
        isMobile ? (
          <MobileSlide
            slides={sortedSlides}
            currentSlide={currentSlide}
            imageError={imageError}
            setImageError={setImageError}
            handleSlideChange={handleSlideChange}
            isAutoPlaying={isAutoPlaying}
            setIsAutoPlaying={setIsAutoPlaying}
            progress={progress}
            slideDuration={slideDuration}
          />
        ) : (
          <DesktopSlide
            slides={sortedSlides}
            currentSlide={currentSlide}
            imageError={imageError}
            setImageError={setImageError}
            handleSlideChange={handleSlideChange}
            isAutoPlaying={isAutoPlaying}
            setIsAutoPlaying={setIsAutoPlaying}
            progress={progress}
            slideDuration={slideDuration}
          />
        )
      ) : (
        <div className="flex items-center justify-center min-h-[50vh] text-gray-500">
          No hay slides disponibles
        </div>
      )}
    </>
  );
};

export default HeroCarousel;