import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Loader, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import API_ROUTES from '../../config/api';
import { PublicacionDocente } from '../../components/PublicacionesDocentesManager';

interface DocenteCount {
  residentes: number;
  noResidentes: number;
}

const DocentesPage: React.FC = () => {
  const [docenteCount, setDocenteCount] = useState<DocenteCount>({ residentes: 0, noResidentes: 0 });
  const [publicaciones, setPublicaciones] = useState<PublicacionDocente[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(true);
  const [currentSection, setCurrentSection] = useState('intro');
  const sectionRefs = useRef<{[key: string]: React.RefObject<HTMLDivElement>}>({
    intro: useRef(null),
    categories: useRef(null),
    publications: useRef(null),
  });

  useEffect(() => {
    fetchDocenteCount();
    fetchPublicaciones();
    
    // Intersection Observer para detectar secciones visibles
    const observers: IntersectionObserver[] = [];
    
    Object.entries(sectionRefs.current).forEach(([id, ref]) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCurrentSection(id);
            }
          });
        },
        { threshold: 0.3 }
      );
      
      if (ref.current) {
        observer.observe(ref.current);
        observers.push(observer);
      }
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const fetchDocenteCount = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ROUTES.DOCENTES);

      // Calcular conteo por tipo
      const counts = response.data.reduce((acc: DocenteCount, docente: any) => {
        if (docente.tipo === 'residente' && docente.isPublished) {
          acc.residentes += 1;
        } else if (docente.tipo === 'no_residente' && docente.isPublished) {
          acc.noResidentes += 1;
        }
        return acc;
      }, { residentes: 0, noResidentes: 0 });

      setDocenteCount(counts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching docente counts:', err);
      setLoading(false);
      toast.error('Error al cargar información de docentes', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    }
  };

  const fetchPublicaciones = async () => {
    try {
      setLoadingPublicaciones(true);
      const response = await axios.get(API_ROUTES.PUBLICACIONES_DOCENTES);

      // Filtrar solo publicaciones publicadas
      const publicadas = response.data.filter((pub: PublicacionDocente) => pub.isPublished);

      // Ordenar por volumen
      publicadas.sort((a: PublicacionDocente, b: PublicacionDocente) => {
        // Extraer números del volumen (si es posible)
        const numA = parseInt(a.volumen.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.volumen.replace(/\D/g, '')) || 0;
        return numA - numB;
      });

      setPublicaciones(publicadas);
      setLoadingPublicaciones(false);
    } catch (err) {
      console.error('Error fetching publicaciones:', err);
      setLoadingPublicaciones(false);
      toast.error('Error al cargar publicaciones', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    }
  };
  
  // Variant para transición de fade con blur
  const fadeInVariant = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
    },
    exit: { 
      opacity: 0, 
      filter: "blur(10px)",
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  // Variant para animación de texto al entrar en viewport
  const textRevealVariant = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };
  
  const sectionVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      
      {/* Navegación lateral tipo codeart.mk */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="space-y-8">
          {Object.keys(sectionRefs.current).map((section) => (
            <div 
              key={section}
              className="flex items-center cursor-pointer group"
              onClick={() => sectionRefs.current[section].current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div 
                className={`h-0.5 w-8 mr-3 bg-opacity-80 transition-all duration-500 ${
                  currentSection === section ? 'w-12 bg-blue-600' : 'bg-gray-300 group-hover:bg-blue-400'
                }`}
              ></div>
              <span 
                className={`text-xs uppercase tracking-widest transition-all duration-300 ${
                  currentSection === section ? 'text-blue-600 opacity-100' : 'text-gray-400 opacity-70 group-hover:opacity-100'
                }`}
              >
                {section === 'intro' ? 'Inicio' : section === 'categories' ? 'Docentes' : 'Publicaciones'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sección Intro */}
      <motion.section 
        ref={sectionRefs.current.intro}
        className="min-h-screen flex items-center justify-center py-24 px-4 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariant}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={textRevealVariant}
            className="overflow-hidden"
          >
            <h1 className="text-6xl md:text-8xl font-light text-blue-600 mb-12">
              Equipo Docente
            </h1>
          </motion.div>
          
          <motion.div
            variants={textRevealVariant}
            className="overflow-hidden"
          >
            <p className="text-2xl font-light text-gray-600 max-w-3xl mb-16 leading-relaxed">
              Conoce a nuestros profesionales destacados que forman el pilar fundamental 
              de la calidad educativa en <span className="text-blue-600">UASD Recinto San Juan</span>.
            </p>
          </motion.div>
          
          <motion.div
            variants={textRevealVariant}
            className="overflow-hidden"
          >
            <div 
              className="inline-block cursor-pointer px-8 py-4 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              onClick={() => sectionRefs.current.categories.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explorar →
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Sección Categorías */}
      <motion.section 
        ref={sectionRefs.current.categories}
        className="min-h-screen py-24 px-4 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={textRevealVariant}
            className="overflow-hidden mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-light text-blue-600">Categorías</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Docentes Residentes */}
            <motion.div 
              variants={fadeInVariant}
              whileHover={{ y: -15 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <Link to="/docentes/residentes" className="block group">
                <div className="relative">
                <img
                  src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/Docente+Residente.png" 
                  alt="Docentes Residentes" 
                  className="h-96 w-full object-cover mb-8"
                />
                  <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <h3 className="text-3xl font-light text-blue-600 mb-4">Docentes Residentes</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Nuestros docentes residentes conforman el cuerpo académico permanente del recinto, 
                    dedicados a tiempo completo a la formación de nuestros estudiantes.
                  </p>
                  
                  {loading ? (
                    <div className="flex items-center">
                      <Loader size={16} className="animate-spin mr-2 text-blue-600" />
                      <span className="text-blue-600">Cargando...</span>
                    </div>
                  ) : (
                    <div className="text-blue-600 font-light">
                      {docenteCount.residentes} docentes activos
                    </div>
                  )}
                  
                  <div className="mt-8 flex items-center">
                    <span className="text-blue-600 mr-3">Ver más</span>
                    <span className="h-px w-10 bg-blue-600 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></span>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* Docentes No Residentes */}
            <motion.div 
              variants={fadeInVariant}
              whileHover={{ y: -15 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <Link to="/docentes/no-residentes" className="block group">
                <div className="relative">
                <img
                  src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/DOCENTES+NO+RESIDENTES.jpg.png" 
                  alt="Docentes Residentes" 
                  className="h-96 w-full object-cover mb-8"
                />
                  <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <h3 className="text-3xl font-light text-blue-600 mb-4">Docentes No Residentes</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Profesionales que colaboran en programas específicos, aportando experiencia 
                    especializada en diversas áreas del conocimiento.
                  </p>
                  
                  {loading ? (
                    <div className="flex items-center">
                      <Loader size={16} className="animate-spin mr-2 text-blue-600" />
                      <span className="text-blue-600">Cargando...</span>
                    </div>
                  ) : (
                    <div className="text-blue-600 font-light">
                      {docenteCount.noResidentes} docentes colaboradores
                    </div>
                  )}
                  
                  <div className="mt-8 flex items-center">
                    <span className="text-blue-600 mr-3">Ver más</span>
                    <span className="h-px w-10 bg-blue-600 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Sección Publicaciones */}
      <motion.section 
        ref={sectionRefs.current.publications}
        className="min-h-screen py-24 px-4 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={textRevealVariant}
            className="overflow-hidden mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-light text-blue-600">Publicaciones</h2>
          </motion.div>
          
          {loadingPublicaciones ? (
            <div className="flex justify-center items-center py-32">
              <Loader size={24} className="animate-spin text-blue-600" />
            </div>
          ) : publicaciones.length === 0 ? (
            <motion.div 
              variants={fadeInVariant}
              className="py-32 text-center"
            >
              <p className="text-2xl font-light text-gray-400">
                No hay publicaciones disponibles en este momento.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {publicaciones.map((publicacion, index) => (
                <motion.div 
                  key={publicacion._id}
                  variants={fadeInVariant}
                  custom={index}
                  whileHover={{ y: -20 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  <a
                    href={publicacion.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group h-full"
                  >
                    <div className="relative h-full flex flex-col">
                      <div className="mb-6 overflow-hidden h-72">
                        {publicacion.portadaUrl ? (
                          <img
                            src={publicacion.portadaUrl}
                            alt={publicacion.titulo}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                        ) : (
                          <div className="bg-gray-100 w-full h-full"></div>
                        )}
                      </div>
                      
                      <div className="mb-2 text-sm tracking-wide text-blue-600">
                        {publicacion.volumen} • {publicacion.anio}
                      </div>
                      
                      <h3 className="text-xl font-light text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                        {publicacion.titulo}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-6 flex-grow">
                        {publicacion.descripcion || 'Publicación que presenta los perfiles, trayectorias y contribuciones de los docentes destacados del recinto.'}
                      </p>
                      
                      <div className="mt-auto flex items-center">
                        <span className="text-blue-600 text-sm mr-3">Ver PDF</span>
                        <span className="h-px w-6 bg-blue-600 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></span>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default DocentesPage;