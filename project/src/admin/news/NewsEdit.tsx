import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { NewsService } from './NewsService';
import ImageManager from '../../components/ImageManager';
import EstadosFinancierosPdfUploader from '../../components/EstadosFinancierosPdfUploader';
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
            id: section.id || `section-${sectionIndex}-${Date.now()}`,
            images: (section.images || []).map((image: any, imgIndex: number) => ({
              ...image,
              id: image.id || `image-${sectionIndex}-${imgIndex}-${Date.now()}`,
              displayOptions: {
                size: image.displayOptions?.size || 'medium',
                alignment: image.displayOptions?.alignment || 'center',
                cropMode: image.displayOptions?.cropMode || 'cover',
                caption: image.displayOptions?.caption,
              },
            })),
            text: section.text || '',
            videoUrl: section.videoUrl || '',
            pdf: section.pdf ? { url: section.pdf.url, publicId: section.pdf.publicId } : undefined,
          }));
          setSections(formattedSections);
          const dateObj = new Date(news.date);
          const formattedDate = dateObj.toISOString().split('T')[0];
          setDate(formattedDate);
          setCategory(news.category);
        }
      } catch (err) {
        toast.error('Error al cargar la noticia.');
        console.error('Error en fetchNews:', err);
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
        pdf: undefined,
      },
    ]);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      )
    );
  };

  const handleUploadImage = async (sectionIndex: number, file: File) => {
    const id = Date.now().toString();
    const blobUrl = URL.createObjectURL(file);

    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
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

    setUploadingImages((prev) => ({ ...prev, [sectionIndex]: 0 }));

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
        prevSections.map((section, index) =>
          index === sectionIndex
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
        prevSections.map((section, index) =>
          index === sectionIndex
            ? {
                ...section,
                images: section.images.filter((image) => image.id !== id),
              }
            : section
        )
      );
      toast.error('Error al subir la imagen.');
    } finally {
      setUploadingImages((prev) => ({ ...prev, [sectionIndex]: undefined }));
      URL.revokeObjectURL(blobUrl);
    }
  };

  const handleRemoveImage = (sectionIndex: number, imageId: string) => {
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              images: section.images.filter((image) => image.id !== imageId),
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

  const handlePdfUploaded = (sectionIndex: number, url: string, publicId: string) => {
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? { ...section, pdf: url ? { url, publicId } : undefined }
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
      toast.error('Algunas imágenes no se han subido correctamente.');
      return;
    }
    setSubmitting(true);
    try {
      const cleanedSections = sections.map((section) => ({
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
      await NewsService.updateNews(newsId, { title, sections: cleanedSections, date, category });
      toast.success('Noticia actualizada con éxito!');
      onSuccess();
    } catch (err) {
      toast.error('Error al actualizar la noticia.');
      console.error('Error en handleUpdateNews:', err);
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Sección {index + 1}</h3>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Eliminar sección"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <ImageManager
                section={section}
                onUpload={(file) => handleUploadImage(index, file)}
                onRemoveImage={(imageId) => handleRemoveImage(index, imageId)}
                onSettingsChange={(imageId, setting, value) =>
                  handleImageSettingsChange(index, imageId, setting, value)
                }
                uploadProgress={uploadingImages[index]}
              />
              <EstadosFinancierosPdfUploader
                onPdfUploaded={(url, publicId) => handlePdfUploaded(index, url, publicId)}
                currentPdfUrl={section.pdf?.url}
                title="Documento PDF (Opcional)"
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
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  URL de Video (Opcional)
                </label>
                <input
                  type="text"
                  value={section.videoUrl || ''}
                  onChange={(e) => handleSectionChange(index, 'videoUrl', e.target.value)}
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
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Actualizando...' : 'Actualizar Noticia'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewsEdit;