import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Map,
  Volume2,
  Info,
  Sun,
  Moon,
  ArrowLeft,
  ArrowRight,
  X,
  Camera,
} from 'lucide-react';
import logouasd from '../img/logouasd.png';

interface Photo {
  url: string;
  title: string;
  description: string;
}

interface Path {
  id: string;
  name: string;
  color: string;
  description: string;
  coverImage: string;
  photos: Photo[];
}

const CampusTour = () => {
  const [currentPath, setCurrentPath] = useState<Path | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef(null);

  const photoUrls = [
    "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-60.jpg",
    "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/Entrada+Principal_Recinto_Sanjuan.jpg"
  ];

  const paths: Path[] = [
    { 
      id: 'herencia', 
      name: 'Herencia', 
      color: '#E63946',
      description: 'Explora nuestra historia y patrimonio arquitectónico',
      coverImage: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-60.jpg",
      photos: [
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/2.jpg",
          title: "Fachada Principal",
          description: "La entrada histórica del campus, que refleja la arquitectura dominicana contemporánea."
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/6.jpg",
          title: "Arte",
          description: "Vista emblemático universitaria."
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-11.jpg",
          title: "Monumento Duarte",
          description: "Estatuta emblematica."
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/5.jpg",
          title: "Entrada Histórica",
          description: "Un punto de referencia que data de los inicios del campus."
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-15.jpg",
          title: "Fachada Lateral",
          description: "Otra perspectiva de la arquitectura del campus."
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/Entrada+Principal_Recinto_Sanjuan.jpg",
          title: "Entrada Principal",
          description: "La entrada principal del Recinto San Juan, un ícono del campus."
        }
      ]
    },
    {
      id: 'descubrimiento',
      name: 'Descubrimiento',
      color: '#457B9D',
      description: 'Espacios académicos donde florece el conocimiento',
      coverImage: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-21.jpg",
      photos: [
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/9.jpg",
          title: "Biblioteca Central",
          description: "Centro de recursos para la investigación y el estudio."
        },
      ]
    },
    {
      id: 'comunidad',
      name: 'Comunidad',
      color: '#2A9D8F',
      description: 'La vida estudiantil y los espacios de encuentro',
      coverImage: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-24.jpg",
      photos: [
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-45.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-42.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/10.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/2.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/3.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/4.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/7.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-13.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-14.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-16.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-17.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-18.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-20.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-21.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-22.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-24.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-25.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-26.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-27.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-28.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-29.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-30.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-31.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-32.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-33.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-34.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-35.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-36.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-37.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-38.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-40.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-41.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-42.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-43.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-44.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-45.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-46.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-47.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-48.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-49.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-50.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-51.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-52.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-53.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-54.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-55.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-56.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-57.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-58.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-59.jpg",
          title: "",
          description: ""
        },
        {
          url: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-60.jpg",
          title: "",
          description: ""
        },
      ]
    },
  ];

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showFullscreen) {
        setShowFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showFullscreen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePathSelect = (pathId: string) => {
    const selectedPath = paths.find(p => p.id === pathId);
    if (selectedPath) {
      setCurrentPath(selectedPath);
      setShowIntro(false);
      setCurrentPhotoIndex(0);
    }
  };

  const toggleNightMode = () => setIsNightMode(!isNightMode);

  const nextPhoto = () => {
    if (currentPath) {
      setCurrentPhotoIndex((prev) => 
        prev === currentPath.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (currentPath) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? currentPath.photos.length - 1 : prev - 1
      );
    }
  };

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-blue-900">
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2
            }}
          >
            <div className="text-6xl font-bold text-white mb-4">UASD</div>
            <div className="text-xl text-white/80">Recinto San Juan</div>
          </motion.div>
          <div className="mt-8 text-white/60">Cargando tour virtual...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen overflow-hidden ${isNightMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col pt-28`}>
      <div className="relative z-10 flex-1 flex flex-col">
        {showIntro ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }}
            className="flex flex-col flex-1 bg-white text-center px-4"
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2, duration: 0.6 }}
              className="py-6 flex justify-center"
            >
              <div className="h-16 w-34 rounded-lg overflow-hidden mr-4 bg-white p-1">
                <img
                  src={logouasd}
                  alt="Logo UASD"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <h2 className="text-blue-900 font-bold text-xl">Universidad Autónoma</h2>
                <p className="text-gray-500 text-sm">de Santo Domingo • Recinto San Juan</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-6xl mx-auto mt-12 mb-24 flex flex-col items-center text-center px-4"
            >
              <h1 className="text-5xl md:text-6xl font-serif font-light text-gray-900 tracking-tight mb-6 leading-tight">
                Explora Nuestro <span className="text-blue-900 font-bold">Campus</span>
              </h1>
              <div className="w-24 h-1 bg-blue-900 mb-8"></div>
              <p className="text-gray-700 max-w-2xl text-lg leading-relaxed font-light mb-12">
                Descubre los espacios que forman la experiencia educativa en la UASD Recinto San Juan, a través de un recorrido virtual inmersivo por su historia, arquitectura y vida universitaria.
              </p>
              <div className="relative w-full max-w-4xl h-[500px] overflow-hidden rounded-xl shadow-lg border border-gray-200 mb-10">
                <img
                  src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/Entrada+Principal_Recinto_Sanjuan.jpg"
                  alt="Recinto San Juan"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                Comenzar recorrido
                <ChevronRight size={18} className="ml-2" />
              </button>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="max-w-6xl mx-auto px-4"
            >
              <h3 className="text-left text-3xl text-gray-900 font-semibold mb-16 border-b pb-4 border-gray-200">
                Descubre nuestros recorridos guiados
              </h3>
              <div className="space-y-28">
                {paths.map((path, index) => (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    className={`flex flex-col lg:flex-row items-start gap-10 ${
                      index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <div className="w-full lg:w-1/2 h-[550px] overflow-hidden rounded-lg shadow-sm border border-gray-200">
                      <img 
                        src={path.coverImage}
                        alt={path.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                      <h4 className="text-2xl font-serif text-gray-900 mb-4 tracking-tight">
                        {path.name}
                      </h4>
                      <p className="text-gray-700 text-base leading-relaxed mb-6 font-light">
                        {path.description}
                      </p>
                      <button
                        onClick={() => handlePathSelect(path.id)}
                        className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                      >
                        Iniciar recorrido
                        <ChevronRight size={16} className="ml-2" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mt-auto py-8 border-t border-gray-100 text-center text-gray-500 text-sm"
            >
              <p>Universidad Autónoma de Santo Domingo — Recinto San Juan © {new Date().getFullYear()}</p>
            </motion.div>
          </motion.div>
        ) : currentPath ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full h-full flex flex-1 flex-col"
          >
            <div className="flex-1 relative overflow-hidden">
              <div className="w-full h-full relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhotoIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-full"
                  >
                    <img 
                      src={currentPath.photos[currentPhotoIndex].url} 
                      alt={currentPath.photos[currentPhotoIndex].title} 
                      className={`w-full h-full object-cover ${isNightMode ? 'brightness-75' : ''}`}
                    />
                  </motion.div>
                </AnimatePresence>
                
                <button 
                  onClick={prevPhoto}
                  className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                
                <button 
                  onClick={nextPhoto}
                  className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
                >
                  <ArrowRight size={24} />
                </button>
                
                <button 
                  onClick={() => setShowFullscreen(true)}
                  className="absolute top-20 right-6 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
                >
                  <Camera size={20} />
                </button>
                
                <button 
                  onClick={() => setShowIntro(true)}
                  className="absolute top-24 left-6 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors flex items-center"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  <span>Volver</span>
                </button>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute top-1/3 left-1/4 w-12 h-12 cursor-pointer"
                >
                  <div className="absolute w-full h-full rounded-full bg-white opacity-20 animate-ping"></div>
                  <div className="absolute w-6 h-6 top-3 left-3 rounded-full bg-white flex items-center justify-center">
                    <Info size={14} className="text-blue-900" />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-white"
                >
                  <h2 className="text-3xl font-bold mb-2">{currentPath.photos[currentPhotoIndex].title}</h2>
                  <p className="text-lg max-w-2xl">
                    {currentPath.photos[currentPhotoIndex].description}
                  </p>
                  <div className="mt-6 flex items-center">
                    <div className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full"
                        style={{ width: `${((currentPhotoIndex + 1) / currentPath.photos.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 text-sm opacity-80">
                      {currentPhotoIndex + 1} de {currentPath.photos.length}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Apple-style preview section for upcoming images */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={`w-full py-4 ${isNightMode ? 'bg-gray-800' : 'bg-white/90'}`}
            >
              <div className="flex items-center justify-between px-4 mb-4">
                <h3 className={`text-lg font-semibold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  Próximas Imágenes
                </h3>
                <button 
                  onClick={toggleNightMode}
                  className={`p-2 rounded-full ${isNightMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-800'}`}
                >
                  {isNightMode ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>
              <div className="flex overflow-x-auto space-x-4 px-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {currentPath.photos.slice(currentPhotoIndex + 1).map((photo, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden shadow-md cursor-pointer border-2 ${
                      isNightMode ? 'border-gray-700' : 'border-gray-200'
                    } transition-all duration-300 hover:shadow-lg`}
                    onClick={() => goToPhoto(currentPhotoIndex + 1 + index)}
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-black/20 flex items-end p-2 opacity-0 hover:opacity-100 transition-opacity duration-300`}>
                      <p className="text-white text-xs font-medium truncate">{photo.title || 'Sin título'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </div>

      {showFullscreen && currentPath && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
        >
          <button 
            onClick={() => setShowFullscreen(false)}
            className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-colors"
          >
            <X size={28} />
          </button>
          
          <img 
            src={currentPath.photos[currentPhotoIndex].url} 
            alt={currentPath.photos[currentPhotoIndex].title} 
            className="max-w-full max-h-full object-contain"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-2xl font-bold text-white">{currentPath.photos[currentPhotoIndex].title}</h2>
            <p className="text-white/80">{currentPath.photos[currentPhotoIndex].description}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CampusTour;