import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, Upload, Loader, X, Check, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import API_ROUTES from '../config/api';

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
  displayMode?: 'normal' | 'hover'; // Nueva propiedad para el modo de visualización
}

const SlidesEditorPage: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Cargar slides al inicio
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ROUTES.SLIDES);
      if (res.data.length > 0) {
        setSlides(res.data);
      } else {
        // Si no hay slides, crear uno predeterminado
        setSlides([{
          title: 'Nuevo Slide',
          subtitle: 'NUEVO',
          description: 'Descripción del slide',
          cta: {
            text: 'Más información',
            link: '/'
          },
          image: '',
          color: '#003087',
          order: 0,
          displayMode: 'normal' // Modo de visualización predeterminado
        }]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar slides:', err);
      setLoading(false);
      toast.error('Error al cargar los slides', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });

      // Crear slide predeterminado en caso de error
      setSlides([{
        title: 'Nuevo Slide',
        subtitle: 'NUEVO',
        description: 'Descripción del slide',
        cta: {
          text: 'Más información',
          link: '/'
        },
        image: '',
        color: '#003087',
        order: 0,
        displayMode: 'normal' // Modo de visualización predeterminado
      }]);
    }
  };

  // Agregar nuevo slide
  const handleAddSlide = () => {
    const newSlide: Slide = {
      title: 'Nuevo Slide',
      subtitle: 'NUEVO',
      description: 'Descripción del slide',
      cta: {
        text: 'Más información',
        link: '/'
      },
      image: '',
      color: '#003087',
      order: slides.length,
      displayMode: 'normal' // Modo de visualización predeterminado
    };

    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  // Eliminar slide
  const handleDeleteSlide = async (index: number) => {
    if (slides.length <= 1) {
      toast.error('Debe haber al menos un slide', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar este slide?')) {
      return;
    }

    const slideToDelete = slides[index];
    setDeleting(slideToDelete._id || `temp-${index}`);

    try {
      if (slideToDelete._id) {
        await axios.delete(API_ROUTES.SLIDES_BY_ID(slideToDelete._id));
      }

      const newSlides = slides.filter((_, i) => i !== index);

      // Actualizar los órdenes de los slides restantes
      const updatedSlides = newSlides.map((slide, i) => ({
        ...slide,
        order: i
      }));

      setSlides(updatedSlides);

      // Ajustar el índice actual si es necesario
      if (currentSlideIndex >= newSlides.length) {
        setCurrentSlideIndex(Math.max(0, newSlides.length - 1));
      }

      toast.success('Slide eliminado correctamente', {
        icon: <Check className="text-green-500" size={18} />
      });
    } catch (err) {
      console.error('Error al eliminar el slide:', err);
      toast.error('Error al eliminar el slide', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    } finally {
      setDeleting(null);
    }
  };

  // Actualizar slide
  const updateSlide = (index: number, updatedData: Partial<Slide>) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = { ...updatedSlides[index], ...updatedData };
    setSlides(updatedSlides);
  };

  // Subir imagen - Modificada para usar el endpoint del servidor
  const uploadImage = async (file: File) => {
    if (!file) return;

    const slideId = `slide-${currentSlideIndex}`;
    setUploadProgress(prev => ({ ...prev, [slideId]: 0 }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Usar el endpoint del servidor en lugar de subir directamente a Cloudinary
      console.log('Enviando imagen al servidor...');
      const res = await axios.post(
        API_ROUTES.UPLOAD_IMAGE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            console.log(`Progreso de carga: ${percentCompleted}%`);
            setUploadProgress(prev => ({ ...prev, [slideId]: percentCompleted }));
          }
        }
      );

      console.log('Respuesta del servidor:', res.data);

      // Verificar la respuesta correcta del servidor
      if (res.data.success) {
        toast.success('Imagen subida correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });

        // Actualizar la imagen del slide
        updateSlide(currentSlideIndex, { image: res.data.imageUrl });

        // Limpiar progreso después de completar
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[slideId];
            return newProgress;
          });
        }, 800);

        return res.data.imageUrl;
      } else {
        throw new Error(res.data.error || 'Error al subir la imagen');
      }
    } catch (err) {
      console.error('Error al subir imagen:', err);
      toast.error('Error al subir la imagen. Por favor intenta de nuevo.', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });

      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[slideId];
        return newProgress;
      });

      return '';
    }
  };

  // Guardar todos los slides
  const handleSaveChanges = async () => {
    setSaving(true);

    try {
  // Guardar cada slide
  for (const slide of slides) {
    if (slide._id) {
      // Actualizar slide existente
      await axios.put(API_ROUTES.SLIDES_BY_ID(slide._id), slide);
    } else {
      // Crear nuevo slide
      const res = await axios.post(API_ROUTES.SLIDES, slide);
      // Actualizar el ID en el estado
      slide._id = res.data._id;
    }
  }

      toast.success('Cambios guardados correctamente', {
        icon: <Check className="text-green-500" size={18} />
      });

      // Recargar slides para asegurar consistencia
      fetchSlides();
    } catch (err) {
      toast.error('Error al guardar los cambios', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 flex justify-center items-center">
        <Loader className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-blue-600 font-medium">Cargando slides...</span>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-10 pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <Link to="/admin-panel" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="mr-2" size={18} />
                Volver al panel de administración
              </Link>

              <div className="flex space-x-3">
                <button
                  onClick={handleAddSlide}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="mr-2" size={18} />
                  Añadir Slide
                </button>

                {/* Nuevo botón para eliminar el slide actual */}
                {slides.length > 1 && (
                  <button
                    onClick={() => handleDeleteSlide(currentSlideIndex)}
                    disabled={deleting !== null}
                    className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    {deleting ? (
                      <Loader className="animate-spin mr-2" size={18} />
                    ) : (
                      <Trash2 className="mr-2" size={18} />
                    )}
                    Eliminar Slide Actual
                  </button>
                )}

                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${saving
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {saving ? (
                    <>
                      <Loader className="animate-spin mr-2" size={18} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={18} />
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Editor de Slides</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`rounded-lg overflow-hidden border-2 cursor-pointer transition-all relative ${currentSlideIndex === index
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div
                    className="h-24 relative"
                    style={{ backgroundColor: slide.color }}
                  >
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                    )}
                    <div className="absolute inset-0 p-3">
                      <p className="text-white font-medium truncate text-sm">{slide.title}</p>
                      {slide.displayMode === 'hover' && (
                        <span className="text-xs bg-blue-500 text-white px-1 rounded absolute bottom-1 right-1">
                          Hover
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón para eliminar slide */}
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(index);
                      }}
                      disabled={deleting === (slide._id || `temp-${index}`)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity shadow-md"
                      title="Eliminar slide"
                    >

                      {deleting === (slide._id || `temp-${index}`) ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {currentSlide && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modo de visualización
                  </label>
                  <select
                    value={currentSlide.displayMode || 'normal'}
                    onChange={(e) => updateSlide(currentSlideIndex, { displayMode: e.target.value as 'normal' | 'hover' })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="normal">Normal (mostrar contenido siempre)</option>
                    <option value="hover">Revelar al hover (mostrar solo al pasar el cursor)</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentSlide.displayMode === 'hover'
                      ? 'El contenido (título, descripción, botón) solo se mostrará cuando el usuario pase el cursor sobre la imagen.'
                      : 'El contenido se mostrará siempre sobre el color o imagen de fondo.'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={currentSlide.subtitle || ''}
                    onChange={(e) => updateSlide(currentSlideIndex, { subtitle: e.target.value })}
                    placeholder="Ej: NUEVO, POSGRADOS, TECNOLOGÍA"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) => updateSlide(currentSlideIndex, { title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={currentSlide.description}
                    onChange={(e) => updateSlide(currentSlideIndex, { description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg h-32"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Texto del botón
                    </label>
                    <input
                      type="text"
                      value={currentSlide.cta.text}
                      onChange={(e) => updateSlide(currentSlideIndex, {
                        cta: { ...currentSlide.cta, text: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enlace del botón
                    </label>
                    <input
                      type="text"
                      value={currentSlide.cta.link}
                      onChange={(e) => updateSlide(currentSlideIndex, {
                        cta: { ...currentSlide.cta, link: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={currentSlide.color}
                      onChange={(e) => updateSlide(currentSlideIndex, { color: e.target.value })}
                      className="h-10 w-10 rounded"
                    />
                    <input
                      type="text"
                      value={currentSlide.color}
                      onChange={(e) => updateSlide(currentSlideIndex, { color: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen de fondo
                  </label>
                  <div className="relative border border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg flex flex-col items-center transition-all hover:border-blue-400 hover:bg-blue-50">
                    {uploadProgress[`slide-${currentSlideIndex}`] !== undefined ? (
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Subiendo imagen...</span>
                          <span>{uploadProgress[`slide-${currentSlideIndex}`]}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${uploadProgress[`slide-${currentSlideIndex}`]}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-blue-500 mb-2" size={28} />
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          onChange={e => e.target.files && uploadImage(e.target.files[0])}
                        />
                        <p className="text-gray-600 text-sm font-medium">
                          {currentSlide.image ? 'Cambiar imagen' : 'Seleccionar imagen'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">Resolución recomendada: 1920x1080px</p>
                      </>
                    )}
                  </div>

                  {currentSlide.image && (
                    <div className="mt-4 relative rounded-lg overflow-hidden">
                      <img
                        src={currentSlide.image}
                        alt="Vista previa"
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => updateSlide(currentSlideIndex, { image: '' })}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modo de visualización
                  </label>
                  <select
                    value={currentSlide.displayMode || 'normal'}
                    onChange={(e) => updateSlide(currentSlideIndex, { displayMode: e.target.value as 'normal' | 'hover' })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="normal">Normal (mostrar contenido siempre)</option>
                    <option value="hover">Revelar al hover (mostrar solo al pasar el cursor)</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentSlide.displayMode === 'hover'
                      ? 'El contenido (título, descripción, botón) solo se mostrará cuando el usuario pase el cursor sobre la imagen.'
                      : 'El contenido se mostrará siempre sobre el color o imagen de fondo.'}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-700">Vista previa</p>
                    <p className="text-sm text-gray-500">
                      {currentSlide.displayMode === 'hover' ? 'Pasa el cursor sobre la imagen para ver el contenido' : ''}
                    </p>
                  </div>

                  <div className="mt-4 p-6 bg-gray-100 rounded-lg">
                    {currentSlide.displayMode === 'hover' ? (
                      // Vista previa del modo hover
                      <div className="relative group rounded-lg overflow-hidden" style={{ minHeight: '250px' }}>
                        {currentSlide.image ? (
                          <img
                            src={currentSlide.image}
                            alt={currentSlide.title}
                            className="w-full object-cover rounded-lg"
                            style={{ minHeight: '250px' }}
                          />
                        ) : (
                          <div
                            className="w-full rounded-lg"
                            style={{
                              backgroundColor: currentSlide.color,
                              minHeight: '250px'
                            }}
                          ></div>
                        )}

                        {/* Contenido que aparece al hover */}
                        <div
                          className="absolute inset-0 flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            backgroundColor: `${currentSlide.color}dd`,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          {currentSlide.subtitle && (
                            <span className="inline-block bg-white/20 px-3 py-1 rounded-md text-white text-sm font-semibold mb-3">
                              {currentSlide.subtitle}
                            </span>
                          )}
                          <h3 className="text-2xl font-bold text-white mb-2">{currentSlide.title}</h3>
                          <p className="text-white/90 mb-4">{currentSlide.description}</p>
                          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center self-start">
                            {currentSlide.cta.text}
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Vista previa del modo normal (original)
                      <div
                        className="p-6 rounded-lg"
                        style={{ backgroundColor: currentSlide.color }}
                      >
                        {currentSlide.subtitle && (
                          <span className="inline-block bg-white/20 px-3 py-1 rounded-md text-white text-sm font-semibold mb-3">
                            {currentSlide.subtitle}
                          </span>
                        )}
                        <h3 className="text-2xl font-bold text-white mb-2">{currentSlide.title}</h3>
                        <p className="text-white/90 mb-4">{currentSlide.description}</p>
                        <button className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center">
                          {currentSlide.cta.text}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default SlidesEditorPage;
