import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Download, Share2, Info, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  url: string;
  photographer?: string;
  location?: string;
}

const categories = [
  'Todas',
  'Campus',
  'Eventos',
  'Académico',
  'Investigación',
  'Estudiantes',
  'Deportes'
];

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    title: 'Campus Principal',
    description: 'Vista aérea del campus principal de UASD San Juan',
    category: 'Campus',
    date: '2024-01-15',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585',
    location: 'Entrada Principal'
  },
  {
    id: '2',
    title: 'Graduación 2024',
    description: 'Ceremonia de graduación extraordinaria',
    category: 'Eventos',
    date: '2024-03-10',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1'
  },
  {
    id: '3',
    title: 'Laboratorio de Ciencias',
    description: 'Estudiantes realizando investigaciones',
    category: 'Académico',
    date: '2024-02-20',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d'
  },
  {
    id: '4',
    title: 'Investigación Botánica',
    description: 'Proyecto de investigación en el jardín botánico',
    category: 'Investigación',
    date: '2024-02-15',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69'
  },
  {
    id: '5',
    title: 'Vida Estudiantil',
    description: 'Estudiantes en el área común',
    category: 'Estudiantes',
    date: '2024-03-01',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644'
  },
  {
    id: '6',
    title: 'Biblioteca Central',
    description: 'Interior de la biblioteca central',
    category: 'Campus',
    date: '2024-01-20',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da'
  },
  {
    id: '7',
    title: 'Competencia Deportiva',
    description: 'Torneo interuniversitario de baloncesto',
    category: 'Deportes',
    date: '2024-03-05',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc'
  },
  {
    id: '8',
    title: 'Conferencia Internacional',
    description: 'Simposio de investigación científica',
    category: 'Eventos',
    date: '2024-02-28',
    url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678'
  },
  {
    id: '9',
    title: 'Laboratorio de Computación',
    description: 'Estudiantes en clase de programación',
    category: 'Académico',
    date: '2024-02-10',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
  },
  {
    id: '10',
    title: 'Proyecto de Investigación',
    description: 'Equipo de investigación en el laboratorio',
    category: 'Investigación',
    date: '2024-02-25',
    url: 'https://images.unsplash.com/photo-1581093458791-9cd6cd0c7b01'
  }
];

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredImages = galleryImages.filter(image => {
    const matchesCategory = selectedCategory === 'Todas' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePrevImage = () => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Bauhaus-inspired design */}
      <div className="relative bg-[#003087] py-32 mt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#003087]/95 to-[#003087]/70" />
          {/* Geometric shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 transform translate-x-1/3 translate-y-1/3 rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl mb-8"
            >
              Galería
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl mx-auto"
            >
              Explora nuestra colección de momentos memorables
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-12"
        >
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar imágenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-200 focus:border-[#003087] focus:ring-[#003087] transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-[#003087] text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                  <p className="text-sm text-white/80">{image.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          >
            <div className="absolute top-4 right-4 z-50 flex space-x-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="relative max-w-5xl w-full">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                <p className="text-white/80 mb-4">{selectedImage.description}</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-white/60">
                    <Info className="w-5 h-5 mr-2" />
                    <span>{selectedImage.category}</span>
                  </div>
                  {selectedImage.location && (
                    <div className="flex items-center text-white/60">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{selectedImage.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}