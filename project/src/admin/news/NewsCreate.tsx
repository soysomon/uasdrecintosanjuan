import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { NewsService } from './NewsService';
import ImageManager from '../../components/ImageManager';
import { Plus, X } from 'lucide-react';
import API_ROUTES from '../../config/api';
import { Section, NewsImage, ImageDisplayOptions } from '../../types/news';

const NewsCreate: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<Section[]>([
    {
      id: Date.now().toString(),
      images: [],
      text: '',
      videoUrl: '',
    },
  ]);
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('General');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{ [sectionId: string]: number | undefined }>({});
  const formRef = useRef<HTMLDivElement>(null);

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

  const handleRemoveSection = (sectionId: string) => {
    if (sections.length === 1) {
      toast.error('Debe haber al menos una sección.');
      return;
    }
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const handleSectionChange = (sectionId: string, field: keyof Section, value: any) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const handleUploadImage = async (sectionId: string, file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP).');
      return;
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast.error('La imagen es demasiado grande. El tamaño máximo es 20MB.');
      return;
    }

    console.log('File size before upload:', file.size, 'bytes');
    console.log('File type:', file.type);

    setUploadingImages((prev) => ({ ...prev, [sectionId]: 0 }));
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
      console.log('Upload successful. S3 URL:', data.imageUrl);

      if (!data.success) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      const newImage: NewsImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        publicId: data.public_id,
        displayOptions: {
          size: 'medium',
          alignment: 'center',
          cropMode: 'cover',
          caption: '',
        },
      };

      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                images: [...section.images, newImage],
              }
            : section
        )
      );

      const fakeProgress = setInterval(() => {
        setUploadingImages((prev) => {
          const currentProgress = prev[sectionId] || 0;
          if (currentProgress >= 100) {
            clearInterval(fakeProgress);
            return { ...prev, [sectionId]: undefined };
          }
          return { ...prev, [sectionId]: currentProgress + 10 };
        });
      }, 200);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Error al subir la imagen.');
      console.error('Error en handleUploadImage:', error);
    } finally {
      setUploadingImages((prev) => ({ ...prev, [sectionId]: undefined }));
    }
  };

  const handleRemoveImage = (sectionId: string, imageId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              images: section.images.filter((image) => image.id !== imageId),
            }
          : section
      )
    );
  };

  const handleImageSettingsChange = (
    sectionId: string,
    imageId: string,
    setting: keyof ImageDisplayOptions,
    value: any
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
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

  const handleAddNews = async (e: React.FormEvent) => {
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
      const cleanedSections = sections.map(({ id, ...section }) => ({
        text: section.text,
        videoUrl: section.videoUrl || '',
        images: section.images.map(({ id, ...image }) => ({
          url: image.url,
          publicId: image.publicId || '',
          displayOptions: {
            size: image.displayOptions.size || 'medium',
            alignment: image.displayOptions.alignment || 'center',
            cropMode: image.displayOptions.cropMode || 'cover',
            caption: image.displayOptions.caption || '',
          },
        })),
      }));

      const newsData = {
        title,
        sections: cleanedSections,
        date,
        category,
      };

      console.log('Datos enviados al backend:', JSON.stringify(newsData, null, 2));
      await NewsService.createNews(newsData);
      toast.success('Noticia publicada con éxito!');
      onSuccess();
      setTitle('');
      setSections([{ id: Date.now().toString(), images: [], text: '', videoUrl: '' }]);
      setDate('');
      setCategory('General');
    } catch (err) {
      const error = err as Error;
      toast.error('Error al publicar la noticia.');
      console.error('Error en handleAddNews:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-xl rounded-2xl p-8 max-w-5xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Publicar Nueva Noticia</h2>
      <form onSubmit={handleAddNews} className="space-y-6">
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
          {sections.map((section) => (
            <div
              key={section.id}
              className="relative border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-4">Sección</h3>
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSection(section.id)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              )}

              <ImageManager
                section={section}
                onUpload={(file) => handleUploadImage(section.id, file)}
                onRemoveImage={(imageId) => handleRemoveImage(section.id, imageId)}
                onSettingsChange={(imageId, setting, value) =>
                  handleImageSettingsChange(section.id, imageId, setting, value)
                }
                uploadProgress={uploadingImages[section.id]}
              />

              <div className="mt-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Texto</label>
                <textarea
                  value={section.text}
                  onChange={(e) => handleSectionChange(section.id, 'text', e.target.value)}
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
                  onChange={(e) => handleSectionChange(section.id, 'videoUrl', e.target.value)}
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
          {submitting ? 'Publicando...' : 'Publicar Noticia'}
        </button>
      </form>
    </motion.div>
  );
};

export default NewsCreate;