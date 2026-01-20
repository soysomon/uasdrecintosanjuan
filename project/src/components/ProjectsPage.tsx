import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, ChevronRight,ArrowRight , X } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  description?: string;
  link?: string;
  status?: string;
  date?: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  projects: Project[];
  imageSrc?: string;
}

const sections: Section[] = [
  {
    id: 'academic',
    title: 'Recursos Académicos',
    description: 'Documentación y recursos para el desarrollo académico',
    projects: [
      { title: 'Biografías de docentes', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdfs/CONOCE_TU_DOCENTE_1_1743832355527.pdf', date: '2024' },
      { title: 'Conoce tus Docentes - Galería multimedia', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdfs/CONOCE_TU_DOCENTE_1_1743832355527.pdf', date: '2024' },
      { title: 'Diplomado en Cosmiatría Especializada', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Diplomado+en+Cosmiatr%C3%ADa+Especializada.pdf', date: '2024' },
    ],
    imageSrc: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Recursos+Acad%C3%A9micos.jpg"
  },
  {
    id: 'feasibility',
    title: 'Estudios de Factibilidad',
    description: 'Análisis para nuevos programas académicos',
    projects: [
      { title: 'Licenciatura en Historia', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Estudios+de+Factibilidad.pdf'},
      { title: 'Licenciatura en Música', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/INFORME+DEL+ESTUDIO+DE+FACTIBILIDAD+MUSICA.pdf' , status: 'Planificado' },
      { title: 'Licenciatura en Trabajo Social', link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Informe-trabajo-social.pdf',status: 'En revisión' },
      { title: 'Licenciatura en Sociología',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Informe-sociologia.pdf', status: 'Planificado' },
      { title: 'Licenciatura en Biología',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Informe-Biologia.pdf', status: 'En proceso' },
    ],
    imageSrc: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Estudios+de+Factibilidad.jpg"
  },
  {
    id: 'institutional',
    title: 'Documentos Institucionales',
    description: 'Documentación oficial y reportes institucionales',
    projects: [
      { title: 'Informe de actividades 2018-2022', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/INFORME-DE-ACTIVIDADES-2018-2022.pdf'},
      { title: 'Manual de Procedimientos UCOTESIS', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Manual-de-Procedimientos-de-la-Unidad-de-Cursos-Optativos-de-Tesis-Ucotesis.pdf', date: '2023' },
      { title: 'Plan Estratégico 2022-2026', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/PLAN-ESTRATEGICO-UASD-RECINTO-SAN-JUAN-DE-LA-MAGUANA.pdf', date: '2022' },
      { title: 'Plan Operativo 2023', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/PLAN-OPERATIVO-ANUAL-RECINTO-SAN-JUAN-2023-1.pdf', date: '2023' },
      { title: 'Ley de Creación de la UASD', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Ley+de+Creacio%CC%81n+de+la+UASD.pdf', date: '2026' },

    ],
    imageSrc: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Documentos+Institucionales.jpg"
  },
  {
    id: 'expansion',
    title: 'Proyectos de Expansión',
    description: 'Iniciativas de crecimiento institucional',
    projects: [
      { title: 'SubCentro UASD en Elías Piña',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto-Sub-Centro-UASD-en-Elias-Pin%CC%83a.pdf', status: 'En ejecución' },
      {title: 'Proyecto de Apertura del Subcentro UASD en Elías Piña', link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto-Sub-Centro-UASD-en-Elias-Pin%CC%83a.pdf',},
      { title: 'Comedor Universitario', link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto-y-Presupuesto-del-Comedor-UASD-San-Juan-de-la-Maguana.pdf',status: 'Planificado' },
      { title: 'Programa de Premédica',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Facultad-de-Ciencias-de-la-Salud-uasd.pdf', status: 'Aprobado' },
      { title: 'Licenciatura en Matemáticas',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Estudio-de-Factibilidad-Para-Licenciatura-en-Matematica.pdf', status: 'En revisión' },
    ],
    imageSrc: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Proyectos+de+Expansi%C3%B3n.jpg"
  },
  {
    id: 'specialized',
    title: 'Proyectos Especializados',
    description: 'Proyectos técnicos y de investigación',
    projects: [
      { title: 'Arquitectura',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto-Arquitectura.pdf', status: 'En desarrollo' },
      { title: 'Aula Modelo Nivel Inicial',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto-Aula-Modelo-Nivel-Inicial.pdf', status: 'Completado' },
      { title: 'Liceo Experimental',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto-Liceo-Experimental-UASD-Recinto-San-Juan.pdf', status: 'En planificación' },
      { title: 'Laboratorio de suelo',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto-de-instalacio%CC%81n-de-laboratorio-de-suelo.pdf', status: 'En ejecución' },
      { title: 'Cultivos Experimentales',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto-para-Cultivos-Experimentales.pdf', status: 'Activo' },
      {title:'Proyecto: Diplomado en Investigación-Acción',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Diplomado-Desarrollo-Profesional.pdf'},
      {title:'Proyecto: Viabilidad de la Carrera de Biología',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto-Viabilidad+de+la+Carrera+de+Biolog%C3%ADa.pdf'},
      {title:'Proyecto: Viabilidad de la Carrera de Sociología',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto+Estudio+de+factibilidad+para+la+Licenciatura+en+Sociolog%C3%ADa.pdf'},
      {title:'Proyecto: Ingeniería Civil',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto+Ingenier%C3%ADa+Civil.pdf'},
      {title:'Proyecto: Psicología Escolar',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto+Psicolog%C3%ADa+Escolar.pdf'},
      {title:'Proyecto: Artes Plásticas',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto+Artes+Pl%C3%A1sticas.pdf'},
      {title:'Proyecto: Artes Industriales',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto+Artes+Industriales.pdf'},
      {title:'Proyecto: Cultivos Experimentales',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto+para+Cultivos+Experimentales.pdf'},
      {title:'Proyecto: Publicidad',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto+Publicidad.pdf'},
      {title:'Proyecto: Cine',link:'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proyecto+Cine.pdf'},
    ],
    imageSrc: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Proyectos+Especializados.jpg"
  },
  {
    id: 'resolutions',
    title: 'Resoluciones Oficiales',
    description: 'Documentos normativos y resoluciones',
    projects: [
    // { title: 'Proclama CCE-007-2022 - Director General UASD San Juan', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proclama+Director+General+del+Recinto+San+Juan.pdf', date: '2022' },
      { title: 'Cambio de Centro a Recinto (No. CM-2020-004)', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Aprobacio%CC%81n-elevacio%CC%81n-de-Centro-a-Recinto-e1637585027448.jpeg', date: '2020' },
      { title: 'Oficinas UASD Elias Piña', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Resolucion-oficinas-UASD-Elias-Pi%C3%B1a.pdf', date: '2021' },
      { title: 'Apertura Pre-Médica (No. 2022-137)', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Resolucion-aprobacion-Premedica.pdf', date: '2022' },
      { title: 'Apertura Ciencias Políticas (No. 036-2022)', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Resolucion-Ciencias-Politicas.pdf', date: '2022' },
      { title: 'Apertura Ingeniería Civil (No. 073-2022)', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Resolucion-Ing.-Civil.pdf', date: '2022' },
      { title: 'Apertura Psicología Escolar (No. 2022-410)', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Resolucion-Psicologia-Escolar.pdf', date: '2022' },
      { title: 'Apertura Licenciatura en Letras (No. 2021-106)', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/RESOLUCION-CU-2021-106-CU-23-AGOSTO-2021.pdf', date: '2021' },
      { title: 'Apertura Licenciatura en Letras (No. 2021-106)', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/RESOLUCION-CU-2021-106-CU-23-AGOSTO-2021.pdf', date: '2021' },
      { title: 'Proclama Oficial CCE 007-2022: Elecciones de Directivos - Recinto San Juan', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proclama+CCE+007-2022+Ganadores+Elecciones+Director+General+y+Subdirectores+Recinto+San+Juan.pdf', date: '2022' },
      { title: 'Proclama Electoral 2018-2022: Director y Subdirector - UASD Recinto San Juan de la Maguana', link: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Proclama+Director+y+Subdirector+2018-2022+UASD+Recinto+San+Juan+de+la+Maguana.pdf', date: '2022' },

    ],
    imageSrc: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Resoluciones+Oficiales.jpg"
  }
];

// Featured achievements
const achievements = [
  {
    id: 'achievement1',
    title: 'Elevación a Recinto UASD San Juan',
    description: 'Un hito histórico para el desarrollo educativo de la región sur.',
    year: '2020',
    imageSrc: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-23.jpg"
  },
  {
    id: 'achievement2',
    title: 'Apertura de nuevas carreras',
    description: 'Expandiendo las oportunidades educativas con 5 nuevas licenciaturas.',
    year: '2022',
    imageSrc: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/APERTURA+5+CARRERAS.jpg"
  },
  {
    id: 'achievement3',
    title: 'Proyectos de investigación',
    description: 'Fomentando la innovación a través de investigaciones especializadas.',
    year: '2023',
    imageSrc: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Proyectos+de+investigaci%C3%B3n.jpg"
  }
];

export function ProjectsPage() {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [currentAchievement, setCurrentAchievement] = useState(0);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const achievementSliderRef = useRef<HTMLDivElement>(null);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  
  // Rotate through achievements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAchievement((prev) => (prev + 1) % achievements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // GSAP animations setup
  useEffect(() => {
    // Achievement animations
    if (achievementSliderRef.current) {
      gsap.from(".achievement-item", {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      });
    }

    // Projects section animations
    if (projectsContainerRef.current) {
      sections.forEach((section, index) => {
        const sectionElement = sectionRefs.current[index];
        
        if (sectionElement) {
          // Image animation
          gsap.fromTo(
            `#${section.id}-image`,
            { 
              opacity: 0,
              x: index % 2 === 0 ? 100 : -100
            },
            {
              opacity: 1,
              x: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionElement,
                start: "top 70%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );
          
          // Content animation
          gsap.fromTo(
            `#${section.id}-content`,
            { 
              opacity: 0,
              y: 50
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.3,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionElement,
                start: "top 70%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );
          
          // Project list staggered animation
          gsap.fromTo(
            `#${section.id} .project-item`,
            { 
              opacity: 0,
              y: 20
            },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.6,
              delay: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionElement,
                start: "top 70%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Kept mostly intact as requested */}
      <div className="pt-24 md:pt-28">
        <div className="relative h-[60vh] bg-[#004D40] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/Proyectos+y+Resoluciones.jpg"
              alt="Proyectos UASD"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#004D40]/70 to-[#004D40]/90" />
          
          {/* Animated geometric shapes */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/4 right-0 w-96 h-96 bg-white/10"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full"
          />
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: -45 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="absolute top-0 left-1/3 w-64 h-64 bg-white/10"
          />

          <div className="relative z-10 max-w-6xl mx-auto h-full flex items-center">
            <div className="px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <h1 className="text-5xl font-light tracking-tight text-white leading-tight mb-6">
                  Proyectos y Resoluciones
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-xl font-light text-white">
                  Iniciativas de innovación, desarrollo y expansión que impulsan el crecimiento 
                  académico y profesional de nuestra institución.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
        </div>

        {/* Featured Achievements - Heidelberg-inspired minimalist design */}
        <div className="bg-white py-24" ref={achievementSliderRef}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-light text-black mb-4">Logros Destacados</h2>
              <div className="w-16 h-px bg-black mx-auto"></div>
            </div>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={achievements[currentAchievement].id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="flex flex-col md:flex-row items-stretch gap-12"
                >
                  <div className="flex-1 md:order-2 achievement-item">
                    <img 
                      src={achievements[currentAchievement].imageSrc} 
                      alt={achievements[currentAchievement].title}
                      className="w-full h-full object-cover rounded-none"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center md:pr-12 achievement-item">
                    <span className="text-sm font-medium text-gray-500 mb-4">
                      {achievements[currentAchievement].year}
                    </span>
                    <h3 className="text-2xl font-light text-black mb-6">
                      {achievements[currentAchievement].title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      {achievements[currentAchievement].description}
                    </p>
                    <div className="flex space-x-4">
                      {achievements.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentAchievement(index)}
                          className={`w-8 h-1 transition-colors duration-300 ${
                            currentAchievement === index ? 'bg-black' : 'bg-gray-200'
                          }`}
                          aria-label={`Ver logro ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Projects Sections with minimalist Heidelberg-inspired design */}
        <div ref={projectsContainerRef} className="py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-24 text-center">
              <h2 className="text-3xl font-light text-black mb-4">Categorías de Proyectos</h2>
              <div className="w-16 h-px bg-black mx-auto"></div>
            </div>

            <div className="space-y-32">
              {sections.map((section, index) => (
                <div 
                  key={section.id}
                  id={section.id}
                  ref={el => sectionRefs.current[index] = el}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}
                >
                  {/* Image container */}
                  <div className="flex-1" id={`${section.id}-image`}>
                    <div className="overflow-hidden">
                      <img
                        src={section.imageSrc}
                        alt={section.title}
                        className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1" id={`${section.id}-content`}>
                    <span className="text-xs uppercase tracking-widest text-gray-500">
                      Categoría
                    </span>
                    <h3 className="text-2xl font-light text-black mt-2 mb-6">
                      {section.title}
                    </h3>
                    <div className="w-16 h-px bg-black mb-6"></div>
                    <p className="text-lg text-gray-600 mb-12">
                      {section.description}
                    </p>

                    <div className="space-y-1">
                      {section.projects.slice(0, 3).map((project) => (
                        <div 
                          key={project.title}
                          className={`project-item border-b border-gray-200 py-4 transition-all duration-300 ${
                            activeProject === project.title ? 'bg-gray-50' : ''
                          }`}
                          onMouseEnter={() => setActiveProject(project.title)}
                          onMouseLeave={() => setActiveProject(null)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-light text-lg text-black">{project.title}</h4>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                {project.status && (
                                  <span className="mr-4">{project.status}</span>
                                )}
                                {project.date && (
                                  <span>{project.date}</span>
                                )}
                              </div>
                            </div>
                            {project.link && (
                              <a 
                                href={project.link} 
                                className="ml-6 flex items-center text-black hover:text-gray-600 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span className="mr-2 text-sm">Ver</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 transform group-hover:translate-x-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {section.projects.length > 3 && (
                      <button
                        onClick={() => setSelectedSection(section)}
                        className="mt-8 inline-flex items-center text-black font-light hover:text-gray-600 transition-colors border-b border-black pb-1"
                      >
                        <span>Ver todos los proyectos</span>
                        <ChevronRight className="ml-1 w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

      {/* Modal */}
      <AnimatePresence>
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-28 p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedSection(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedSection(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              <div className="flex items-center mb-8">
                <div className="p-3 bg-[#003087]/10 rounded-xl text-[#003087]">
                </div>
                <h3 className="text-2xl font-bold text-black ml-4 font-sf-pro">
                  {selectedSection.title}
                </h3>
              </div>

              <p className="text-lg text-gray-600 mb-8 font-sf-pro">
                {selectedSection.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSection.projects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-black font-sf-pro">
                          {project.title}
                        </h4>
                        {project.status && (
                          <p className="text-sm text-gray-600 mt-1 font-sf-pro">
                            Estado: <span className="font-medium">{project.status}</span>
                          </p>
                        )}
                        {project.date && (
                          <p className="text-sm text-gray-600 mt-1 font-sf-pro">
                            <span className="font-medium">{project.date}</span>
                          </p>
                        )}
                      </div>
                      {project.link && (
                        <a
                          href={project.link}
                          className="flex items-center justify-center w-8 h-8 bg-[#003087]/10 rounded-full text-[#003087] hover:bg-[#003087]/20 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
    </div>
    </div>
  );
}