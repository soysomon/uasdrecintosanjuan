import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Award, 
  Users, 
  GraduationCap,
  Building,
  Library,
  Calendar,
  BarChart2,
  MapPin,
  ExternalLink,
  Search
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HomeNewsSection from '../components/HomeNewsSection';
import { SocialMediaSection } from '../components/SocialMediaSection';
import ChatBot from '../components/ChatBot';
import Director from "../img/Director.png";
import graduacion from "../img/graduacion.jpg"; 
import Postgrado from "../img/postgrado.png"; 
import LicInforma from "../img/informatica.jpg"; 
import Informatica from "../img/informatica.jpg"; 

import Derechos from "../img/Derechos_Image.jpg"; 

import CountUp from 'react-countup';

// Primero, modifica la definición de los slides por defecto
const defaultSlides: Slide[] = [
  {
    title: "LICENCIATURA EN CIBERSEGURIDAD",
    subtitle: "NUEVO",
    description: "MODALIDAD SEMIPRESENCIAL • UASD San Juan de la Maguana",
    cta: {
      text: "Solicitar información",
      link: "/admisiones"
    },
    image: graduacion,
    color: "#003087",
    order: 0,
    displayMode: 'normal' 

  },
  {
    title: "MAESTRÍA EN GESTIÓN EDUCATIVA",
    subtitle: "POSGRADOS",
    description: "Especialización de alto nivel para profesionales de la educación",
    cta: {
      text: "Conocer oferta completa",
      link: "/carreras/postgrado"
    },
    image: Postgrado,
    color: "#45046A",
    order: 1,
    displayMode: 'normal' 
  },
  {
    title: "LICENCIATURA EN INFORMÁTICA",
    subtitle: "TECNOLOGÍA",
    description: "Prepárate para liderar la transformación digital del futuro",
    cta: {
      text: "Explorar programa",
      link: "/carreras/grado"
    },
    image: Informatica,
    color: "#004A98",
    order: 2,
    displayMode: 'normal' 
  }
];

// Aqui modifico la inicialización del estado
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

// Servicios destacados con iconos
const featuredServices = [
  {
    icon: <GraduationCap size={36} />,
    title: "Carreras Universitarias",
    description: "Explora nuestra oferta académica",
    link: "/carreras/grado"
  },
  
  {
    icon: <Library size={36} />,
    title: "Explora nuestras Maestrias",
    description: "Accede a recursos académicos en línea",
    link: "/carreras/postgrado"
  },
  
  {
    icon: <Calendar size={36} />,
    title: "Vida Universitaria",
    description: "Actividades y eventos estudiantiles",
    link: "/vida-universitaria"
  },
  {
    icon: <Award size={36} />,
    title: "Investigación",
    description: "Proyectos y publicaciones académicas",
    link: "/investigacion"
  },
 
];

// Estadísticas institucionales
const institutionalStats = [
  {
    figure: "65+",
    label: "Programas académicos",
    icon: <BookOpen size={32} />,
  },
  {
    figure: "18,500",
    label: "Estudiantes activos",
    icon: <Users size={32} />,
  },
  {
    figure: "200+",
    label: "Docentes PhD",
    icon: <Award size={32} />,
  },
  {
    figure: "35",
    label: "Centros de investigación",
    icon: <BarChart2 size={32} />,
  }
];

// Carreras destacadas con imágenes
const featuredPrograms = [
  {
    title: "MEDICINA",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
    //link: "/carreras/medicina"
  },
  {
    title: "DERECHO",
    image: Derechos,
   // link: "/carreras/derecho"
  },
  {
    title: "LIC. INFORMATICA",
    image: Informatica, 
    //link: "/carreras/ingenieria-civil"
  }
];


function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoadingSlides, setIsLoadingSlides] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]); 
  const [progress, setProgress] = useState(0); // Nuevo estado para el progreso
  const slideDuration = 8000; // 8 segundos por slide
  const progressInterval = 50; // Actualizar el progreso cada 50ms para una animación suave
  
  // Controlar cambio de slides
  const handleSlideChange = useCallback((direction: 'next' | 'prev') => {
    setIsAutoPlaying(false);
    setProgress(0); // Reiniciar el progreso al cambiar manualmente
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [slides.length]);
  
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setIsLoadingSlides(true);
        const res = await axios.get('http://localhost:5000/api/slides');
        if (res.data.length > 0) {
          // Convertir los datos del backend al formato que espera tu componente
          const formattedSlides = res.data.map((slide: any) => ({
            title: slide.title,
            subtitle: slide.subtitle || "",
            description: slide.description,
            cta: slide.cta,
            image: slide.image,
            color: slide.color,
            order: slide.order,
            displayMode: slide.displayMode || 'normal' // Incluir displayMode
          }));
          setSlides(formattedSlides);
          // Asegurarse de que currentSlide sea válido
          if (currentSlide >= formattedSlides.length) {
            setCurrentSlide(0);
          }
        } else {
          setSlides(defaultSlides);
        }
        setIsLoadingSlides(false);
      } catch (err) {
        console.error('Error al cargar slides:', err);
        setSlides(defaultSlides);
        setIsLoadingSlides(false);
      }
    };
    
    fetchSlides();
  }, []);

  // Efecto para el autoplay y la barra de progreso
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    // Reiniciar progreso al cambiar de slide
    setProgress(0);
    
    // Intervalo para actualizar el progreso
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (progressInterval / slideDuration) * 100;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, progressInterval);
    
    // Temporizador principal para cambiar de slide
    const slideTimer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0); // Reiniciar progreso
    }, slideDuration);

    return () => {
      clearTimeout(slideTimer);
      clearInterval(progressTimer);
    };
  }, [isAutoPlaying, currentSlide, slides.length]);

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Variantes de animación
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-white mt-36 h-[65vh]">
      {/* Hero Carousel*/}
      {slides && slides.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              {/* Background con overlay optimizado */}
              <div className="absolute inset-0 overflow-hidden">
                {slides[currentSlide] && (
                  <>
                    {/* Imagen de fondo */}
                    <div className="w-full h-full relative group">
                      <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay y contenido para modo hover */}
                      {slides[currentSlide].displayMode === 'hover' && (
                        <>
                          {/* Overlay que aparece al hover */}
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                            style={{ 
                              backdropFilter: 'blur(3px)',
                              WebkitBackdropFilter: 'blur(3px)',
                              backgroundColor: `${slides[currentSlide].color}AA`,
                            }}
                          ></div>
                          
                          {/* Contenido que aparece al hover (en la misma capa que el overlay) */}
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
                      
                      {/* Overlay para modo normal */}
                      {slides[currentSlide].displayMode !== 'hover' && (
                        <div 
                          className="absolute inset-0"
                          style={{ 
                            background: `linear-gradient(to right, ${slides[currentSlide].color}E6 0%, ${slides[currentSlide].color}CC 50%, ${slides[currentSlide].color}99 100%)` 
                          }}
                        ></div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Contenido para modo normal */}
              {slides[currentSlide] && slides[currentSlide].displayMode !== 'hover' && (
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

        {/* Controles de navegación y progreso */}
        {slides && slides.length > 0 && (
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-10">
            {/* Barra de progreso */}
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
            
            {/* Botones de navegación */}
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
                      currentSlide === index 
                        ? 'bg-white w-8' 
                        : 'bg-white/40 w-3 hover:bg-white/60'
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
              
              {/* Botón de pausar/reproducir */}
              <button
                onClick={() => setIsAutoPlaying(prev => !prev)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20 ml-2"
                aria-label={isAutoPlaying ? "Pausar reproducción automática" : "Iniciar reproducción automática"}
              >
                {isAutoPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>
            </div>
            
            {/* Indicador de tiempo restante */}
            {isAutoPlaying && (
              <p className="text-xs text-white/70 mt-2">
                {Math.ceil((slideDuration - (progress * slideDuration / 100)) / 1000)}s
              </p>
            )}
          </div>
        )}
      </section>

      {/* Servicios Principales  */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredServices.slice(0, 8).map((service, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                key={index}
                className="group"
              >
                <Link to={service.link} className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-all">
                  <div className="w-16 h-16 flex items-center justify-center text-[#003087] mb-3 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Noticias Recientes*/}
<section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">NOTICIAS RECIENTES</h2>
      <p className="text-gray-600">Mantente informado sobre lo que sucede en la UASD</p>
    </div>
    
    {/* Aplicar transform-none para evitar propagación de transformaciones */}
    <div className="transform-none" style={{ transformStyle: 'flat' }}>
      <HomeNewsSection />
    </div>
    
    <div className="text-center mt-10">
      <Link to="/noticias" className="inline-flex items-center px-5 py-2 border border-[#003087] text-[#003087] rounded-md hover:bg-[#003087] hover:text-white transition-colors">
        Ver todas las noticias
        <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    </div>
  </div>
</section>

      {/* Carreras Destacadas*/}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">CARRERAS DESTACADAS</h2>
            <p className="text-gray-600">Descubre nuestros programas académicos más demandados</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPrograms.map((program, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="group"
              >
                <Link to={""} className="block">
                  <div className="relative h-64 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                      <h3 className="text-xl font-bold text-white">{program.title}</h3>
                    </div>
                  </div>
                </Link>*
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/carreras/grado" className="inline-flex items-center px-6 py-3 bg-[#003087] text-white rounded-md hover:bg-[#00276d] transition-colors shadow-md">
              Ver todas las carreras
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

   {/* Director Profile Section - Diseño de agencia de élite */}
<section className="py-24 bg-gradient-to-br from-[#051c45] via-[#002a75] to-[#001c50] relative overflow-hidden">
  {/* Elementos decorativos de fondo */}
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
  <div className="absolute -top-[500px] -right-[300px] w-[800px] h-[800px] rounded-full bg-blue-400/5 blur-3xl"></div>
  <div className="absolute -bottom-[300px] -left-[200px] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl"></div>
  
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row gap-16 items-center">
      {/* Contenedor de imagen con efectos avanzados */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 1,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        className="w-full lg:w-1/2 order-2 lg:order-1"
      >
        <div className="relative">
          {/* Marco decorativo */}
          <div className="absolute -inset-4 rounded-xl border border-blue-400/20 z-0"></div>
          
          {/* Imagen con máscara y efectos */}
          <div className="relative rounded-lg overflow-hidden shadow-2xl z-10">
            <div className="absolute inset-0 bg-gradient-to-t from-[#051c45]/90 via-[#051c45]/60 to-transparent z-10"></div>
            
            {/* Patrón de puntos sobre la imagen */}
            <div className="absolute inset-0 z-20 opacity-5 mix-blend-overlay" 
              style={{ 
                backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)',
                backgroundSize: '8px 8px' 
              }}>
            </div>
            
            <img 
              src={Director} 
              alt="Dr. Carlos Manuel Sánchez De Óleo" 
              className="w-full aspect-[3/4] object-cover object-center transform transition-transform duration-2000"
            />
            
            {/* Elemento gráfico superior */}
            <div className="absolute top-6 left-6 flex items-center z-20">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
              <div className="w-12 h-px bg-blue-400/60"></div>
            </div>
            
            {/* Texto inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <h3 className="text-2xl font-bold text-white">Dr. Carlos Manuel Sánchez De Óleo</h3>
              <p className="text-blue-200 mt-2 font-medium">Director UASD – Centro San Juan</p>
            </div>
          </div>
          
          {/* Tarjeta flotante con efectos profundos */}
          <motion.div
            initial={{ opacity: 0, y: 30, x: 30 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ 
              delay: 0.4, 
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1] 
            }}
            className="absolute -bottom-8 -right-8 bg-white p-6 rounded-lg shadow-xl z-20 max-w-xs"
          >
            <div className="flex items-center mb-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mr-3">
                <BookOpen className="w-4 h-4" />
              </span>
              <h4 className="text-lg font-semibold text-gray-900">Formación Académica</h4>
            </div>
            
            <ul className="space-y-2 text-gray-700 text-sm pl-4">
              <li className="relative before:absolute before:top-2.5 before:left-[-1rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue-500">
                <span className="font-medium">Doctorado en Matemáticas</span>
                <p className="text-gray-500">Universidad Politécnica de Valencia</p>
              </li>
              <li className="relative before:absolute before:top-2.5 before:left-[-1rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue-500">
                <span className="font-medium">Maestría en Física Aplicada</span>
                <p className="text-gray-500">Universidad de Barcelona</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Contenido con animaciones sofisticadas */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 order-1 lg:order-2 space-y-8"
      >
        <div>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100px" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-0.5 bg-blue-400 mb-6"
          ></motion.div>
          
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-4 py-1 rounded-full border border-blue-400/30 text-blue-200 text-sm font-medium mb-4"
          >
            Liderazgo Institucional
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Comprometido con la <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">excelencia académica</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-blue-100 font-medium leading-relaxed"
          >
            Director UASD – Centro San Juan de la Maguana
          </motion.p>
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg text-white/80 leading-relaxed"
        >
          Maestro de la Universidad Autónoma de Santo Domingo desde 2005, el Dr. Sánchez De Óleo 
          ha dedicado su trayectoria a la transformación de la educación superior en la región. 
          Su visión innovadora ha impulsado importantes avances en infraestructura, calidad 
          educativa y vinculación comunitaria.
        </motion.p>
        
        {/* Tarjeta de logros con efecto glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-6 rounded-lg"
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Award className="w-5 h-5 text-blue-300" />
            </div>
            <h4 className="font-semibold text-white text-lg">Logros Destacados</h4>
          </div>
          
          <ul className="space-y-3 pl-12 relative">
            <div className="absolute top-0 bottom-0 left-5 w-px bg-gradient-to-b from-blue-400/40 via-blue-400/10 to-transparent"></div>
            
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="relative"
            >
              <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-blue-400"></div>
              <p className="text-white/90 text-[15px]">Director del Proyecto LIMA para la innovación académica</p>
            </motion.li>
            
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-blue-400"></div>
              <p className="text-white/90 text-[15px]">Colaborador investigador en CERN, Ginebra</p>
            </motion.li>
            
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="relative"
            >
              <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-blue-400"></div>
              <p className="text-white/90 text-[15px]">Premio Nacional a la Excelencia Académica 2023</p>
            </motion.li>
          </ul>
        </motion.div>
        
        {/* Botón con animación elegante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            to="/director/despacho"
            className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            <span>Conocer más sobre el Director</span>
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="transition-transform group-hover:translate-x-1"
            >
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </div>
</section>

    {/* Estadísticas institucionales - Animación de contador numérico */}
<section className="py-16 bg-white relative overflow-hidden">
  {/* Elementos decorativos sutiles */}
  <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
  <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <div className="inline-block">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "40%" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-1 bg-blue-600 rounded-full mx-auto mb-4"
        ></motion.div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          UASD EN CIFRAS
        </h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-1 bg-blue-600 rounded-full mx-auto mt-1"
        ></motion.div>
      </div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
        Conoce los números que reflejan nuestro compromiso con la educación superior de calidad
      </p>
    </motion.div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {institutionalStats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.3 + (index * 0.15),
            duration: 0.7,
            ease: [0.175, 0.885, 0.32, 1.275] // Efecto "back" elegante
          }}
          whileHover={{ 
            y: -8,
            boxShadow: "0 12px 24px -8px rgba(0, 48, 135, 0.15)"
          }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 transition-all duration-300"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.5 + (index * 0.15), 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-6 text-[#003087]"
          >
            {stat.icon}
          </motion.div>
          
          <CountUp 
            start={0}
            end={parseInt(stat.figure) || 0}
            duration={2.5}
            delay={0.5 + (index * 0.15)}
            separator=","
            suffix={stat.figure.includes("+") ? "+" : ""}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 block"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + (index * 0.15) }}
            className="text-sm text-gray-600"
          >
            {stat.label}
          </motion.p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Carta Compromiso */}
      <section className="py-12 bg-[#003087] bg-[url('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsdWUlMjBncmFkaWVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-[#003087]/80"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Carta Compromiso al Ciudadano</h2>
              <p className="text-white/80 max-w-xl">Conoce nuestros compromisos de calidad y transparencia en el servicio a la comunidad académica y a la sociedad</p>
            </div>
            <Link to="/carta-compromiso" className="inline-flex items-center px-6 py-3 bg-white text-[#003087] rounded-md font-medium hover:bg-blue-50 transition-colors">
              Ver Carta
              <ExternalLink className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <SocialMediaSection />

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}

export { HomePage };