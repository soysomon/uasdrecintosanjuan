import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Plus, Loader, Check, AlertTriangle, ChevronRight, X, Calendar, FileText, Image as ImageIcon, Users, Settings, AlignLeft, AlignCenter, AlignRight, Maximize, Minimize } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Confetti from 'react-confetti';
import logoUASD from '../img/logouasd.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';
import EstadosFinancierosManager from '../components/EstadosFinancierosManager';
import SecurityManager from '../components/SecurityManager';

interface ImageDisplayOptions {
  size: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
  caption?: string;
  cropMode: 'cover' | 'contain' | 'none';
}

interface NewsImage {
  id?: string;
  url: string;
  publicId?: string;
  displayOptions: ImageDisplayOptions;
}

interface Section {
  id: string;
  images: NewsImage[];
  text: string;
}

interface NewsItem {
  _id?: string;
  title: string;
  sections: Section[];
  date: string;
  category: string;
}

interface CategoryStats {
  [key: string]: number;
}

interface Stats {
  totalNews: number;
  byCategory: CategoryStats;
}

const AdminPanelPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<Section[]>([{ id: generateId(), images: [], text: '' }]);
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'security'>('create');
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const formRef = useRef<HTMLDivElement>(null);
  const { isSuperAdmin, token } = useAuth();

  const [stats, setStats] = useState<Stats>({
    totalNews: 0,
    byCategory: {}
  });

  const ImageManager = ({
    section,
    onUpload,
    onRemoveImage,
    onSettingsChange,
    uploadProgress
  }: {
    section: Section;
    onUpload: (file: File) => void;
    onRemoveImage: (imageId: string) => void;
    onSettingsChange: (imageId: string, setting: keyof ImageDisplayOptions, value: any) => void;
    uploadProgress?: number;
  }) => {
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    return (
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
          <ImageIcon size={16} className="mr-1 text-blue-600" />
          Imágenes de la Sección
        </label>
        <div className="relative border border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg flex flex-col items-center transition-all hover:border-blue-400 hover:bg-blue-50 group">
          {uploadProgress !== undefined ? (
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1">
                <span>Subiendo imagen...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <Upload className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                onChange={e => e.target.files && e.target.files[0] && onUpload(e.target.files[0])}
              />
              <p className="text-gray-600 text-sm font-medium">
                {section.images.length > 0 ? 'Añadir otra imagen' : 'Seleccionar imagen'}
              </p>
              <p className="text-gray-500 text-xs mt-1">Formatos: JPG, PNG, GIF</p>
            </>
          )}
        </div>
        {section.images.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4">
            {section.images.map((image) => (
              <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <div
                    className={`overflow-hidden relative ${image.displayOptions.alignment === 'left'
                      ? 'mr-auto'
                      : image.displayOptions.alignment === 'right'
                        ? 'ml-auto'
                        : 'mx-auto'
                    } ${image.displayOptions.size === 'small'
                      ? 'max-w-xs'
                      : image.displayOptions.size === 'medium'
                        ? 'max-w-md'
                        : image.displayOptions.size === 'large'
                          ? 'max-w-lg'
                          : 'w-full'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt="Vista previa"
                      className={`w-full border border-gray-100 ${image.displayOptions.cropMode === 'cover'
                        ? 'object-cover h-48'
                        : image.displayOptions.cropMode === 'contain'
                          ? 'object-contain h-48'
                          : 'object-none'
                      }`}
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedImageId(selectedImageId === image.id ? null : image.id ?? null)}
                        className="bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors shadow-md hover:scale-110"
                      >
                        <Settings size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveImage(image.id!)}
                        className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  {selectedImageId === image.id && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Settings size={14} className="mr-1 text-blue-500" />
                        Opciones de visualización
                      </h4>
                      <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1.5 font-medium">Tamaño</label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => onSettingsChange(image.id!, 'size', 'small')}
                            className={`p-2 rounded ${image.displayOptions.size === 'small' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Pequeño"
                          >
                            <Minimize size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSettingsChange(image.id!, 'size', 'medium')}
                            className={`p-2 rounded ${image.displayOptions.size === 'medium' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Mediano"
                          >
                            <ImageIcon size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSettingsChange(image.id!, 'size', 'large')}
                            className={`p-2 rounded ${image.displayOptions.size === 'large' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Grande"
                          >
                            <Maximize size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSettingsChange(image.id!, 'size', 'full')}
                            className={`p-2 rounded ${image.displayOptions.size === 'full' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Completo"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="21" y1="3" x2="3" y2="21" /><line x1="3" y1="3" x2="21" y2="21" /></svg>
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1.5 font-medium">Alineación</label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => onSettingsChange(image.id!, 'alignment', 'left')}
                            className={`p-2 rounded ${image.displayOptions.alignment === 'left' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Izquierda"
                          >
                            <AlignLeft size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSettingsChange(image.id!, 'alignment', 'center')}
                            className={`p-2 rounded ${image.displayOptions.alignment === 'center' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Centro"
                          >
                            <AlignCenter size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSettingsChange(image.id!, 'alignment', 'right')}
                            className={`p-2 rounded ${image.displayOptions.alignment === 'right' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Derecha"
                          >
                            <AlignRight size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1.5 font-medium">Modo de recorte</label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => onSettingsChange(image.id!, 'cropMode', 'cover')}
                            className={`p-2 rounded text-xs ${image.displayOptions.cropMode === 'cover' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Cubrir"
                          >
                            <span>Cubrir</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onSettingsChange(image.id!, 'cropMode', 'contain')}
                            className={`p-2 rounded text-xs ${image.displayOptions.cropMode === 'contain' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Contener"
                          >
                            <span>Contener</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onSettingsChange(image.id!, 'cropMode', 'none')}
                            className={`p-2 rounded text-xs ${image.displayOptions.cropMode === 'none' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Original"
                          >
                            <span>Original</span>
                          </button>
                        </div>
                      </div>
                      <div className="mb-1">
                        <label className="text-xs text-gray-600 block mb-1.5 font-medium">Leyenda</label>
                        <input
                          type="text"
                          value={image.displayOptions.caption || ''}
                          onChange={(e) => onSettingsChange(image.id!, 'caption', e.target.value)}
                          placeholder="Añadir una leyenda para esta imagen..."
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                  {image.displayOptions.caption && (
                    <p className="text-sm text-gray-600 mt-1 text-center italic px-3 py-2">
                      {image.displayOptions.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  function generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/news');
      setNewsItems(res.data);
      const categoryCounts = res.data.reduce((acc: CategoryStats, item: NewsItem) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});
      setStats({
        totalNews: res.data.length,
        byCategory: categoryCounts
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo.', {
        duration: 4000,
        position: 'top-center',
        icon: <AlertTriangle className="text-red-500" size={18} />,
      });
    }
  };

  const uploadImage = async (file: File, sectionId: string) => {
    setUploadProgress(prev => ({ ...prev, [sectionId]: 0 }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', Date.now().toString());
      const res = await axios.post(
        'http://localhost:5000/api/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            setUploadProgress(prev => ({ ...prev, [sectionId]: percentCompleted }));
          },
        }
      );
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[sectionId];
          return newProgress;
        });
      }, 800);
      if (res.data.success) {
        toast.success('Imagen subida correctamente', {
          icon: <Check className="text-green-500" size={18} />,
        });
        return {
          url: res.data.imageUrl,
          publicId: res.data.public_id,
        };
      } else {
        toast.error('Error al subir la imagen: ' + (res.data.error || 'Error desconocido'), {
          icon: <AlertTriangle className="text-red-500" size={18} />,
        });
        return null;
      }
    } catch (err) {
      toast.error('Error al conectar con el servidor. Verifica que el backend esté funcionando.', {
        icon: <AlertTriangle className="text-red-500" size={18} />,
      });
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[sectionId];
        return newProgress;
      });
      return null;
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    const result = await uploadImage(file, id);
    if (result && result.url) {
      const imageId = generateId();
      const newImage: NewsImage = {
        id: imageId,
        url: result.url,
        publicId: result.publicId,
        displayOptions: {
          size: 'medium',
          alignment: 'center',
          cropMode: 'cover',
        },
      };
      setSections(prevSections =>
        prevSections.map(section =>
          section.id === id
            ? { ...section, images: [...section.images, newImage] }
            : section
        )
      );
    }
  };

  const handleAddSection = () => {
    const newSection = { id: generateId(), images: [], text: '' };
    setSections([...sections, newSection]);
    setTimeout(() => {
      if (formRef.current) {
        const lastChild = formRef.current.lastElementChild;
        lastChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleRemoveSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(section => section.id !== id));
    } else {
      toast.error('Debe haber al menos una sección.', {
        icon: <AlertTriangle size={18} />
      });
    }
  };

  const handleSectionChange = (id: string, field: keyof Section, value: any) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const handleImageSettingsChange = (sectionId: string, imageId: string, setting: keyof ImageDisplayOptions, value: any) => {
    const sectionIndex = sections.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) return;
    const section = sections[sectionIndex];
    const imageIndex = section.images.findIndex(img => img.id === imageId);
    if (imageIndex === -1) return;
    const updatedImages = [...section.images];
    updatedImages[imageIndex] = {
      ...updatedImages[imageIndex],
      displayOptions: {
        ...updatedImages[imageIndex].displayOptions,
        [setting]: value
      }
    };
    handleSectionChange(sectionId, 'images', updatedImages);
  };

  const handleRemoveImage = (sectionId: string, imageId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    const updatedImages = section.images.filter(img => img.id !== imageId);
    handleSectionChange(sectionId, 'images', updatedImages);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
  };

  const isFormValid = () =>
    title.trim() &&
    date &&
    sections.every(s => s.images.length > 0 && s.text.trim());

  const resetForm = () => {
    setTitle('');
    setSections([{ id: generateId(), images: [], text: '' }]);
    setDate('');
    setCategory('General');
    setError(null);
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Completa todos los campos obligatorios.', {
        icon: <AlertTriangle size={18} />
      });
      return;
    }
    setSubmitting(true);
    try {
      const formattedSections = sections.map(({ id, images, text }) => ({
        images: images.map(img => ({
          url: img.url,
          publicId: img.publicId,
          displayOptions: img.displayOptions
        })),
        text
      }));
      await axios.post('http://localhost:5000/api/news', {
        title,
        sections: formattedSections,
        date,
        category
      });
      setSubmitting(false);
      setShowConfetti(true);
      toast.success('¡Noticia publicada con éxito!', {
        duration: 4000,
        icon: <Check className="text-green-500" size={18} />
      });
      resetForm();
      fetchNews();
    } catch (err) {
      setSubmitting(false);
      toast.error('Error al publicar la noticia. Inténtalo de nuevo.', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/news/${id}`);
      setLoading(false);
      toast.success('Noticia eliminada correctamente', {
        icon: <Check className="text-green-500" size={18} />
      });
      fetchNews();
    } catch (err) {
      setLoading(false);
      toast.error('Error al eliminar la noticia.', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    }
  };

  const filteredNews = newsItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpandNews = (id: string) => {
    setExpandedNewsId(expandedNewsId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white pt-32">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <br />
            <br />
            <br />
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              Panel de Administración
            </h1>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-5">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Noticias</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalNews}</p>
            </div>
            <div className="h-10 border-l border-gray-200"></div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Más Popular</p>
              <p className="text-lg font-medium text-blue-700">
                {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex mb-6 bg-white rounded-lg shadow p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FileText className="mr-2" size={18} />
            Crear Noticia
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'manage' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Loader className="mr-2" size={18} />
            Administrar Noticias
          </button>
          <Link
            to="/slides-editor"
            className="flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all text-gray-600 hover:bg-gray-100"
          >
            <ImageIcon className="mr-2" size={18} />
            Editor de Slides
          </Link>
          <Link
            to="/memorias-editor"
            className="flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all text-gray-600 hover:bg-gray-100"
          >
            <FileText className="mr-2" size={18} />
            Editor de Memorias
          </Link>
          <Link
            to="/estados-financieros"
            className="flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all text-gray-600 hover:bg-gray-100"
          >
            <FileText className="mr-2" size={18} />
            Estados Financieros
          </Link>
          <Link
            to="/docentes-editor"
            className="flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all text-gray-600 hover:bg-gray-100"
          >
            <Users className="mr-2" size={18} />
            Editor de Docentes
          </Link>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'security' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Users className="mr-2" size={18} />
              Seguridad
            </button>
          )}
          {isSuperAdmin && (
            <Link
              to="/admin/users"
              className="flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all bg-purple-100 text-purple-800 hover:bg-purple-200"
            >
              <Users className="mr-2" size={18} />
              Gestión de Usuarios
              <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                Super
              </span>
            </Link>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div
              key="create-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-xl rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-2 text-blue-600" size={22} />
                Publicar Nueva Noticia
              </h2>
              <form onSubmit={handleAddNews} className="space-y-6">
                <div className="relative">
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Título de la Noticia
                  </label>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Escribe un título atractivo"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-600">
                      Secciones de Contenido
                    </label>
                    <span className="text-xs text-gray-500">
                      {sections.length} {sections.length === 1 ? 'sección' : 'secciones'}
                    </span>
                  </div>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-6"
                        >
                          <div ref={formRef} className="space-y-6">
                            {sections.map((section, index) => (
                              <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided) => (
                                  <motion.div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm relative group"
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="absolute left-3 top-3 px-1 text-gray-400 cursor-grab active:cursor-grabbing"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="9" cy="5" r="1" />
                                        <circle cx="9" cy="12" r="1" />
                                        <circle cx="9" cy="19" r="1" />
                                        <circle cx="15" cy="5" r="1" />
                                        <circle cx="15" cy="12" r="1" />
                                        <circle cx="15" cy="19" r="1" />
                                      </svg>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSection(section.id)}
                                      className="absolute right-3 top-3 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X size={18} />
                                    </button>
                                    <ImageManager
                                      section={section}
                                      onUpload={(file) => handleImageUpload(section.id, file)}
                                      onRemoveImage={(imageId) => handleRemoveImage(section.id, imageId)}
                                      onSettingsChange={(imageId, setting, value) => handleImageSettingsChange(section.id, imageId, setting, value)}
                                      uploadProgress={uploadProgress[section.id]}
                                    />
                                    <div>
                                      <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Texto del Párrafo
                                      </label>
                                      <textarea
                                        value={section.text}
                                        onChange={e => handleSectionChange(section.id, 'text', e.target.value)}
                                        placeholder="Escribe el contenido de esta sección"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] transition-all"
                                        required
                                      />
                                    </div>
                                  </motion.div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <motion.button
                    type="button"
                    onClick={handleAddSection}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-3 mt-4 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
                  >
                    <Plus size={18} className="mr-2" /> Agregar Sección
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      <Calendar size={16} className="inline mr-1" /> Fecha de Publicación
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Categoría
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat transition-all"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 1rem center'
                      }}
                    >
                      <option value="General">General</option>
                      <option value="Académico">Académico</option>
                      <option value="Investigación">Investigación</option>
                      <option value="Estudiantes">Estudiantes</option>
                      <option value="Internacional">Internacional</option>
                      <option value="Cultural">Cultural</option>
                    </select>
                  </div>
                </div>
                <motion.button
                  type="submit"
                  disabled={!isFormValid() || submitting}
                  whileHover={isFormValid() && !submitting ? { scale: 1.02 } : {}}
                  whileTap={isFormValid() && !submitting ? { scale: 0.98 } : {}}
                  className={`w-full p-4 text-white rounded-lg transition-all ${isFormValid() && !submitting
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin mr-2" size={20} />
                      Publicando...
                    </span>
                  ) : (
                    'Publicar Noticia'
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : activeTab === 'manage' ? (
            <motion.div
              key="manage-news"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-xl rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Administrar Noticias</h2>
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar noticias..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="animate-spin text-blue-600" size={32} />
                  <span className="ml-3 text-blue-600 font-medium">Cargando noticias...</span>
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No se encontraron noticias</p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNews.map((news) => (
                    <motion.div
                      key={news._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div
                        onClick={() => toggleExpandNews(news._id!)}
                        className="p-4 cursor-pointer flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-800">{news.title}</h3>
                            <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {news.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Publicado: {new Date(news.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNews(news._id!);
                            }}
                            className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors mr-1"
                          >
                            <Trash2 size={18} />
                          </button>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 text-gray-400 transition-transform ${expandedNewsId === news._id ? 'transform rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {expandedNewsId === news._id && (
                        <div className="px-4 pb-4 border-t border-gray-100 pt-2">
                          <div className="space-y-3 mt-2">
                            {news.sections.map((section, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row gap-4 pb-3 border-b border-gray-100">
                                {section.images && section.images.length > 0 && (
                                  <div className="sm:w-1/3 space-y-2">
                                    {section.images.map((image, imageIdx) => (
                                      <div key={imageIdx} className="relative">
                                        <img
                                          src={image.url}
                                          alt={`Sección ${idx + 1}, Imagen ${imageIdx + 1}`}
                                          className={`w-full object-${image.displayOptions?.cropMode || 'cover'} rounded-lg h-32`}
                                          style={{
                                            maxWidth: image.displayOptions?.size === 'small'
                                              ? '150px'
                                              : image.displayOptions?.size === 'medium'
                                                ? '250px'
                                                : image.displayOptions?.size === 'large'
                                                  ? '350px'
                                                  : '100%',
                                            marginLeft: image.displayOptions?.alignment === 'center'
                                              ? 'auto'
                                              : image.displayOptions?.alignment === 'right'
                                                ? 'auto'
                                                : '0',
                                            marginRight: image.displayOptions?.alignment === 'center'
                                              ? 'auto'
                                              : image.displayOptions?.alignment === 'left'
                                                ? 'auto'
                                                : '0'
                                          }}
                                        />
                                        {image.displayOptions?.caption && (
                                          <p className="text-xs text-gray-500 italic mt-1 text-center">
                                            {image.displayOptions.caption}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className={section.images && section.images.length > 0 ? "sm:w-2/3" : "w-full"}>
                                  <p className="text-gray-600 text-sm line-clamp-3">{section.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : activeTab === 'security' && isSuperAdmin ? (
            <SecurityManager token={token} />
          ) : null}
        </AnimatePresence>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminPanelPage;