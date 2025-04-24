import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { NewsService } from './NewsService';
import ImageManager from '../../components/ImageManager';
import EstadosFinancierosPdfUploader from '../../components/EstadosFinancierosPdfUploader';
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
      pdf: undefined,
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
        pdf: undefined,
      },
    ]);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const handleUploadImage = async (sectionId: string, file: File) => {
    const id = Date.now().toString();
    const blobUrl = URL.createObjectURL(file);

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              images: [
                ...section.images,
                {
                  id,
                  url: blobUrl,
                  publicId: '',
                  displayOptions: {
                    size: 'medium',
                    alignment: 'center',
                    cropMode: 'cover',
                    caption: '',
                  },
                },
              ],
            }
          : section
      )
    );

    setUploadingImages((prev) => ({ ...prev, [sectionId]: 0 }));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(API_ROUTES.UPLOAD_IMAGE, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                images: section.images.map((image) =>
                  image.id === id
                    ? {
                        ...image,
                        url: data.imageUrl,
                        publicId: data.public_id,
                      }
                    : image
                ),
              }
            : section
        )
      );
    } catch (err) {
      console.error('Error en handleUploadImage:', err);
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                images: section.images.filter((image) => image.id !== id),
              }
            : section
        )
      );
      toast.error('Error al subir la imagen.');
    } finally {
      setUploadingImages((prev) => ({ ...prev, [sectionId]: undefined }));
      URL.revokeObjectURL(blobUrl);
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
                      displayOptions: {
                        ...image.displayOptions,
                        [setting]: value,
                      },
                    }
                  : image
              ),
            }
          : section
      )
    );
  };

  const handlePdfUploaded = (sectionId: string, url: string, publicId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, pdf: url ? { url, publicId } : undefined }
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
      toast.error('Algunas imágenes no se han subido correctamente.');
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
        pdf: section.pdf ? { url: section.pdf.url, publicId: section.pdf.publicId } : undefined,
      }));

      const newsData = { title, sections: cleanedSections, date, category };
      await NewsService.createNews(newsData);
      toast.success('Noticia publicada con éxito!');
      onSuccess();
      setTitle('');
      setSections([{ id: Date.now().toString(), images: [], text: '', videoUrl: '', pdf: undefined }]);
      setDate('');
      setCategory('General');
    } catch (err) {
      toast.error('Error al publicar la noticia.');
      console.error('Error en handleAddNews:', err);
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Sección</h3>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(section.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Eliminar sección"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <ImageManager
                section={section}
                onUpload={(file) => handleUploadImage(section.id, file)}
                onRemoveImage={(imageId) => handleRemoveImage(section.id, imageId)}
                onSettingsChange={(imageId, setting, value) =>
                  handleImageSettingsChange(section.id, imageId, setting, value)
                }
                uploadProgress={uploadingImages[section.id]}
              />
              <EstadosFinancierosPdfUploader
                onPdfUploaded={(url, publicId) => handlePdfUploaded(section.id, url, publicId)}
                currentPdfUrl={section.pdf?.url}
                title="Documento PDF (Opcional)"
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
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  URL de Video (Opcional)
                </label>
                <input
                  type="text"
                  value={section.videoUrl || ''}
                  onChange={(e) => handleSectionChange(section.id, 'videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddSection}
            className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Agregar Sección
          </button>
        </div>
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
              <option value="Cultura">Cultura</option>
              <option value="Deportes">Deportes</option>
              <option value="Eventos">Eventos</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Publicando...' : 'Publicar Noticia'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewsCreate;