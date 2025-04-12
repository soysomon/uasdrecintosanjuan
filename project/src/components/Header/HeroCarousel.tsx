// src/components/Header/HeroCarousel.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    title: "LICENCIATURA EN CIBERSEGURIDAD",
    subtitle: "NUEVO",
    description: "MODALIDAD SEMIPRESENCIAL • UASD San Juan de la Maguana",
    cta: { text: "Solicitar información", link: "/admisiones" },
    image: '/path/to/graduacion.jpg', // Ajustar con la imagen real
    color: "#003087",
    order: 0,
    displayMode: 'normal',
  },
  {
    title: "MAESTRÍA EN GESTIÓN EDUCATIVA",
    subtitle: "POSGRADOS",
    description: "Especialización de alto nivel para profesionales de la educación",
    cta: { text: "Conocer oferta completa", link: "/carreras/postgrado" },
    image: '/path/to/postgrado.png',
    color: "#45046A",
    order: 1,
    displayMode: 'normal',
  },
  {
    title: "LICENCIATURA EN INFORMÁTICA",
    subtitle: "TECNOLOGÍA",
    description: "Prepárate para liderar la transformación digital del futuro",
    cta: { text: "Explorar programa", link: "/carreras/grado" },
    image: '/path/to/informatica.jpg',
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
  const slideDuration = 8000;
  const progressInterval = 50;

  const handleSlideChange = useCallback((direction: 'next' | 'prev') => {
    setIsAutoPlaying(false);
    setProgress(0);
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [slides.length]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/slides');
        if (res.data.length > 0) {
          const formattedSlides = res.data.map((slide: any) => ({
            title: slide.title,
            subtitle: slide.subtitle || "",
            description: slide.description,
            cta: slide.cta,
            image: slide.image,
            color: slide.color,
            order: slide.order,
            displayMode: slide.displayMode || 'normal',
          }));
          setSlides(formattedSlides);
          if (currentSlide >= formattedSlides.length) {
            setCurrentSlide(0);
          }
        } else {
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
    }, slideDuration);
    return () => {
      clearTimeout(slideTimer);
      clearInterval(progressTimer);
    };
  }, [isAutoPlaying, currentSlide, slides.length]);

  return (
    <section className="relative bg-white h-[65vh]">
      {slides.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="w-full h-full relative group">
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
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
                      <div className="max-w-3xl px-8 text-center">
                        {slides[currentSlide].subtitle && (
                          <span className="inline-block bg-white/20 px-3 py-1 rounded-md text-white text-sm font-semibold mb-3">
                            {slides[currentSlide].subtitle}
                          </span>
                        )}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                          {slides[currentSlide].title}
                        </h1>
                        <p className="text-lg text-white/90 mb-8 font-light">
                          {slides[currentSlide].description}
                        </p>
                        <Link
                          to={slides[currentSlide].cta.link}
                          className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-md font-medium hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg"
                        >
                          {slides[currentSlide].cta.text}
                          <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
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
            </div>
            {slides[currentSlide].displayMode !== 'hover' && (
              <div className="relative h-full max-w-7xl mx-auto flex items-center">
                <div className="w-1/2 px-16 py-20">
                  {slides[currentSlide].subtitle && (
                    <span className="inline-block bg-white/20 px-3 py-1 rounded-md text-white text-sm font-semibold mb-3">
                      {slides[currentSlide].subtitle}
                    </span>
                  )}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {slides[currentSlide].title}
                  </h1>
                  <p className="text-lg text-white/90 mb-8 font-light">
                    {slides[currentSlide].description}
                  </p>
                  <Link
                    to={slides[currentSlide].cta.link}
                    className="group inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-md font-medium hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg"
                  >
                    {slides[currentSlide].cta.text}
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
      {slides.length > 0 && (
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-10">
          {isAutoPlaying && (
            <div className="w-48 h-1 bg-white/30 rounded-full mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          )}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleSlideChange('prev')}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoPlaying(false);
                    setProgress(0);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-white w-8' : 'bg-white/40 w-3 hover:bg-white/60'
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
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20 ml-2"
              aria-label={isAutoPlaying ? "Pausar reproducción automática" : "Iniciar reproducción automática"}
            >
              {isAutoPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
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
                  className="w-5 h-5 text-white"
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
            <p className="text-xs text-white/70 mt-2">
              {Math.ceil((slideDuration - (progress * slideDuration / 100)) / 1000)}s
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;