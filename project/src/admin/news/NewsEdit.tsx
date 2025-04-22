import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { NewsService } from './NewsService';
import ImageManager from '../../components/ImageManager';
import { Plus, X } from 'lucide-react';
import API_ROUTES from '../../config/api';
import { ImageDisplayOptions, NewsImage, Section } from '../../types/news';

const NewsEdit: React.FC<{ newsId: string; onSuccess: () => void }> = ({ newsId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{ [sectionIndex: number]: number | undefined }>({});
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await NewsService.fetchNews();
        const news = data.find((item: any) => item._id === newsId);
        if (news) {
          setTitle(news.title);
          const formattedSections = news.sections.map((section: any, sectionIndex: number) => ({
            id: section.id || `section-${sectionIndex}-${Date.now()}`, // Asegurar que la sección tenga un id
            images: (section.images || []).map((image: any, imgIndex: number) => ({
              ...image,
              id: image.id || `image-${sectionIndex}-${imgIndex}-${Date.now()}`, // Generar un id si no existe
              displayOptions: {
                size: image.displayOptions?.size || 'medium',
                alignment: image.displayOptions?.alignment || 'center',
                cropMode: image.displayOptions?.cropMode || 'cover',
                caption: image.displayOptions?.caption,
                layout: image.displayOptions?.layout || 'vertical',
              },
            })),
            text: section.text || '',
            videoUrl: section.videoUrl || '',
          }));
          setSections(formattedSections);
          console.log('Secciones cargadas:', formattedSections);
          const dateObj = new Date(news.date);
          const formattedDate = dateObj.toISOString().split('T')[0];
          setDate(formattedDate);
          setCategory(news.category);
        }
      } catch (err) {
        const error = err as Error;
        toast.error('Error al cargar la noticia.');
        console.error('Error en fetchNews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [newsId]);

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        images: [],
        text: '',
        videoUrl: '',
      },
    ]);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  };

  const handleRemoveSection = (sectionIndex: number) => {
    if (sections.length === 1) {
      toast.error('Debe haber al menos una sección.');
      return;
    }
    setSections(sections.filter((_, index) => index !== sectionIndex));
  };

  const handleSectionChange = (sectionIndex: number, field: keyof Section, value: any) => {
    setSections(
      sections.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      )
    );
  };

  const handleUploadImage = async (sectionIndex: number, file: File) => {
    setUploadingImages((prev) => ({ ...prev, [sectionIndex]: 0 }));
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_ROUTES.UPLOAD_IMAGE, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = 'Error al subir la imagen a AWS S3';
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.error || errorMessage;
        } catch (jsonError) {
          console.error('Respuesta del servidor no es JSON:', errorData);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      const newImage: NewsImage = {
        id: Date.now().toString(), // Asegurar que la nueva imagen tenga un id
        url: data.imageUrl,
        publicId: data.public_id,
        displayOptions: {
          size: 'medium',
          alignment: 'center',
          cropMode: 'cover',
          layout: sections[sectionIndex].images.length > 0 ? 'vertical' : 'vertical',
        },
      };

      setSections((prevSections) =>
        prevSections.map((section, index) =>
          index === sectionIndex
            ? {
                ...section,
                images: [...section.images, newImage],
              }
            : section
        )
      );

      console.log('Imagen subida:', newImage.url);

      const fakeProgress = setInterval(() => {
        setUploadingImages((prev) => {
          const currentProgress = prev[sectionIndex] || 0;
          if (currentProgress >= 100) {
            clearInterval(fakeProgress);
            return { ...prev, [sectionIndex]: undefined };
          }
          return { ...prev, [sectionIndex]: currentProgress + 10 };
        });
      }, 200);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Error al subir la imagen.');
      console.error('Error en handleUploadImage:', error);
    } finally {
      setUploadingImages((prev) => ({ ...prev, [sectionIndex]: undefined }));
    }
  };

  const handleRemoveImage = (sectionIndex: number, imageId: string) => {
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              images: section.images.filter((image) => image.id !== imageId), // Usar id para filtrar
            }
          : section
      )
    );
  };

  const handleImageSettingsChange = (
    sectionIndex: number,
    imageId: string,
    setting: keyof ImageDisplayOptions,
    value: any
  ) => {
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              images: section.images.map((image) =>
                image.id === imageId
                  ? {
                      ...image,
                      displayOptions: { ...image.displayOptions, [setting]: value },
                    }
                  : image
              ),
            }
          : section
      )
    );
  };

  const handleLayoutChange = (sectionIndex: number, layout: 'horizontal' | 'vertical') => {
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              images: section.images.map((image) => ({
                ...image,
                displayOptions: { ...image.displayOptions, layout },
              })),
            }
          : section
      )
    );
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sections.some((section) => !section.text.trim())) {
      toast.error('Todas las secciones deben tener texto.');
      return;
    }
    if (sections.some((section) => section.images.some((image) => image.url.startsWith('blob:')))) {
      toast.error('Algunas imágenes no se han subido correctamente. Por favor, intenta subirlas nuevamente.');
      return;
    }
    setSubmitting(true);
    try {
      await NewsService.updateNews(newsId, { title, sections, date, category });
      toast.success('Noticia actualizada con éxito!');
      onSuccess();
    } catch (err) {
      const error = err as Error;
      toast.error('Error al actualizar la noticia.');
      console.error('Error en handleUpdateNews:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center text-gray-600">Cargando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-xl rounded-2xl p-8 max-w-5xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Editar Noticia</h2>
      <form onSubmit={handleUpdateNews} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la noticia"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div ref={formRef}>
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="relative border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-4">Sección {index + 1}</h3>
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSection(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              )}

              <ImageManager
                section={section}
                onUpload={(file) => handleUploadImage(index, file)}
                onRemoveImage={(imageId) => handleRemoveImage(index, imageId)} // Pasar el id de la imagen
                onSettingsChange={(imageId, setting, value) =>
                  handleImageSettingsChange(index, imageId, setting, value)
                }
                onLayoutChange={(layout) => handleLayoutChange(index, layout)}
                uploadProgress={uploadingImages[index]}
              />

              <div className="mt-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Texto</label>
                <textarea
                  value={section.text}
                  onChange={(e) => handleSectionChange(index, 'text', e.target.value)}
                  placeholder="Contenido de la sección"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Video URL (Opcional)</label>
                <input
                  type="url"
                  value={section.videoUrl || ''}
                  onChange={(e) => handleSectionChange(index, 'videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddSection}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <Plus size={18} className="mr-1" />
          Agregar otra sección
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="General">General</option>
              <option value="Académico">Académico</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            submitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Actualizando...' : 'Actualizar Noticia'}
        </button>
      </form>
    </motion.div>
  );
};

export default NewsEdit;