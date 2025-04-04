import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, Check, AlertTriangle, FileText, Youtube, Loader, X } from 'lucide-react';
import MemoriasPdfUploader from './MemoriasPdfUploader';
import API_ROUTES from '../config/api';

// Tipo para cada sección de Memorias
// Interfaces para secciones de contenido
export interface ContentSection {
  sectionType: 'text' | 'stats' | 'table' | 'gallery' | 'timeline' | 'list' | 'quote' | 'contact';
  title?: string;
  content: any; // Definir interfaces específicas para cada tipo
  order: number;
}

// Tipo para cada sección de Memorias
export interface MemoriaItem {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  pdfUrl: string;
  pdfPublicId?: string;
  videoUrl: string;
  order: number;
  isPublished: boolean;
  contentSections?: ContentSection[]; // Nueva propiedad
  createdAt?: string;
  updatedAt?: string;
}

const MemoriasManager: React.FC = () => {
  const [memorias, setMemorias] = useState<MemoriaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [currentMemoria, setCurrentMemoria] = useState<MemoriaItem>({
    title: '',
  slug: '',
  description: '',
  pdfUrl: '',
  videoUrl: '',
  order: 0,
  isPublished: true,
  contentSections: [] // Inicializar con array vacío
});
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Función para validar URLs de PDF
  const validatePdf = async (url: string): Promise<boolean> => {
    if (!url) return false;
    
    // Para URLs de Cloudinary, verificar el formato
    if (url.includes('cloudinary.com')) {
      // Verificar si la URL tiene el formato de una URL de Cloudinary válida
      const cloudinaryPattern = /^https:\/\/res\.cloudinary\.com\/([^/]+)\/(.+)$/;
      return cloudinaryPattern.test(url);
    }
    
    // Para otros PDFs, asumir que son válidos
    return true;
  };

  useEffect(() => {
    fetchMemorias();
  }, []);

  // Función para obtener todas las memorias
  const fetchMemorias = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ROUTES.MEMORIAS);
      setMemorias(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('Error al cargar las memorias', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error fetching memorias:', err);
    }
  };

  // Generar un slug a partir del título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  // Actualizar el campo slug cuando cambia el título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setCurrentMemoria({
      ...currentMemoria,
      title,
      slug
    });
  };

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentMemoria({
      ...currentMemoria,
      [name]: value
    });
  };

  // Manejar cambios en el estado de publicación
  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMemoria({
      ...currentMemoria,
      isPublished: e.target.checked
    });
  };

  // Preparar formulario para crear nueva memoria
  const handleNewMemoria = () => {
    setCurrentMemoria({
      title: '',
      slug: '',
      description: '',
      pdfUrl: '',
      videoUrl: '',
      order: memorias.length + 1,
      isPublished: true
    });
    setFormMode('create');
    setShowForm(true);
  };

  // Preparar formulario para editar memoria existente
  const handleEditMemoria = (memoria: MemoriaItem) => {
    setCurrentMemoria(memoria);
    setFormMode('edit');
    setShowForm(true);
  };

  // Cancelar y cerrar formulario
  const handleCancel = () => {
    setShowForm(false);
  };

  // Guardar memoria (crear o actualizar)
  const handleSaveMemoria = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMemoria.title || !currentMemoria.slug) {
      toast.error('El título es obligatorio', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    // Validar PDF si existe una URL
    if (currentMemoria.pdfUrl) {
      const isValidPdf = await validatePdf(currentMemoria.pdfUrl);
      if (!isValidPdf) {
        toast.error('El PDF proporcionado no es válido o no está accesible', {
          icon: <AlertTriangle className="text-red-500" size={18} />
        });
        return;
      }
    }

    setSubmitting(true);
    
    try {
      if (formMode === 'create') {
        // Crear nueva memoria
        await axios.post(API_ROUTES.MEMORIAS, currentMemoria);
        toast.success('Memoria creada correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });
      } else {
        // Actualizar memoria existente
        await axios.put(API_ROUTES.MEMORIAS_BY_ID(currentMemoria._id!), currentMemoria);
        toast.success('Memoria actualizada correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });
      }
      
      setSubmitting(false);
      setShowForm(false);
      fetchMemorias(); // Recargar la lista después de guardar
    } catch (err) {
      setSubmitting(false);
      toast.error('Error al guardar la memoria', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error saving memoria:', err);
    }
  };

  // Eliminar memoria
  const handleDeleteMemoria = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta memoria?')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(API_ROUTES.MEMORIAS_BY_ID(id));
      
      toast.success('Memoria eliminada correctamente', {
        icon: <Check className="text-green-500" size={18} />
      });
      
      fetchMemorias(); // Recargar la lista después de eliminar
    } catch (err) {
      setLoading(false);
      toast.error('Error al eliminar la memoria', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error deleting memoria:', err);
    }
  };

  // Extraer ID de video de YouTube de una URL
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Si ya es una URL de embed, la devolvemos tal cual
    if (url.includes('/embed/')) return url;
    
    // Intentamos extraer el ID del video
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Si no podemos extraer el ID, devolvemos la URL original
    return url;
  };

  // Manejar cambios en la URL de YouTube
  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const embedUrl = getYoutubeEmbedUrl(url);
    
    setCurrentMemoria({
      ...currentMemoria,
      videoUrl: embedUrl
    });
  };

  // Actualizar URL del PDF
  const handlePdfUploaded = (url: string, publicId: string) => {
    setCurrentMemoria({
      ...currentMemoria,
      pdfUrl: url,
      pdfPublicId: publicId  // Guardar el ID público
    });
  };


  // Renderizado de previsualización de YouTube
  const renderYoutubePreview = () => {
    if (!currentMemoria.videoUrl) return null;
    
    return (
      <div className="mt-4">
        <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
          <iframe
            src={currentMemoria.videoUrl}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video preview"
          />
        </div>
      </div>
    );
  };

// Componente para gestionar secciones de contenido
const ContentSectionsManager: React.FC<{
  sections: ContentSection[];
  onChange: (sections: ContentSection[]) => void;
}> = ({ sections, onChange }) => {
  const [selectedType, setSelectedType] = useState<ContentSection['sectionType']>('text');
  
  // Añadir nueva sección
const addSection = () => {
  const newSection: ContentSection = {
    sectionType: selectedType,
    title: '',
    content: getDefaultContentForType(selectedType),
    order: sections.length,
  };
  
  onChange([...sections, newSection]);
};
  
  // Obtener contenido predeterminado según el tipo
  const getDefaultContentForType = (type: ContentSection['sectionType']): any => {
    switch (type) {
      case 'text':
        return { text: '' };
      case 'stats':
        return { items: [{ label: '', value: '', description: '' }] };
      case 'table':
        return { headers: ['Columna 1', 'Columna 2'], rows: [['', '']] };
      case 'gallery':
        return { images: [{ url: '', caption: '' }] };
      case 'timeline':
        return { events: [{ date: '', title: '', description: '' }] };
      case 'list':
        return { items: [{ title: '', description: '' }] };
      case 'quote':
        return { text: '', author: '', position: '' };
      case 'contact':
        return { 
          address: '', 
          phone: '', 
          email: '', 
          schedule: '', 
          website: '' 
        };
      default:
        return {};
    }
  };
  
  // Eliminar una sección
  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    
    // Reordenar
    const reorderedSections = newSections.map((section, i) => ({
      ...section,
      order: i
    }));
    
    onChange(reorderedSections);
  };
  
  // Mover una sección arriba o abajo
  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }
    
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Intercambiar posiciones
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Actualizar órdenes
    const reorderedSections = newSections.map((section, i) => ({
      ...section,
      order: i
    }));
    
    onChange(reorderedSections);
  };
  
  // Actualizar una sección
  const updateSection = (index: number, updates: Partial<ContentSection>) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      ...updates
    };
    
    onChange(newSections);
  };
  
  // Actualizar el contenido de una sección
  const updateSectionContent = (index: number, content: any) => {
    updateSection(index, { content });
  };
  
  // Renderizar el editor específico según el tipo
const renderSectionEditor = (section: ContentSection, index: number) => {
  switch (section.sectionType) {
    case 'text':
      return (
        <TextSectionEditor 
          content={section.content} 
          onChange={(content) => updateSectionContent(index, content)} 
        />
      );
    case 'stats':
      return (
        <StatsSectionEditor 
          content={section.content} 
          onChange={(content) => updateSectionContent(index, content)} 
        />
      );
    case 'timeline':
      return (
        <TimelineSectionEditor 
          content={section.content} 
          onChange={(content) => updateSectionContent(index, content)} 
        />
      );
    case 'list':
      return (
        <ListSectionEditor 
          content={section.content} 
          onChange={(content) => updateSectionContent(index, content)} 
        />
      );
    case 'contact':
      return (
        <ContactSectionEditor 
          content={section.content} 
          onChange={(content) => updateSectionContent(index, content)} 
        />
      );
    // Otros casos para table, gallery, quote...
    default:
      return (
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-500">
            Editor para {section.sectionType} no implementado aún.
          </p>
        </div>
      );
  }
};
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3">
        Secciones de Contenido
      </h3>
      
      {sections.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
          <p className="text-gray-500 mb-2">No hay secciones de contenido</p>
          <p className="text-sm text-gray-400">
            Añade secciones para mostrar contenido adicional
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {sections.map((section, index) => (
  <div 
    key={index} 
    className="border border-gray-200 rounded-lg p-4 bg-white"
  >
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center">
        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
          {section.sectionType}
        </div>
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => updateSection(index, { title: e.target.value })}
          placeholder="Título de la sección (opcional)"
          className="border-gray-300 rounded-md text-sm p-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex space-x-1">
        <button
          type="button"
          onClick={() => moveSection(index, 'up')}
          disabled={index === 0}
          className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
          title="Mover arriba"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => moveSection(index, 'down')}
          disabled={index === sections.length - 1}
          className={`p-1 rounded ${index === sections.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
          title="Mover abajo"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => removeSection(index)}
          className="p-1 text-red-500 hover:bg-red-50 rounded"
          title="Eliminar sección"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    
    {renderSectionEditor(section, index)}
  </div>
))}{sections.map((section, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              
              {renderSectionEditor(section, index)}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ContentSection['sectionType'])}
          className="border-gray-300 rounded-md text-sm p-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="text">Texto</option>
          <option value="stats">Estadísticas</option>
          <option value="table">Tabla</option>
          <option value="gallery">Galería</option>
          <option value="timeline">Cronología</option>
          <option value="list">Lista</option>
          <option value="quote">Cita/Testimonio</option>
          <option value="contact">Contacto</option>
        </select>
        
        <button
          type="button"
          onClick={addSection}
          className="flex items-center bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100 transition-colors text-sm"
        >
          <Plus size={16} className="mr-1" />
          Añadir Sección
        </button>
      </div>
    </div>
  );
};

// Editor para secciones de texto (implementar primero)
const TextSectionEditor: React.FC<{
  content: any;
  onChange: (content: any) => void;
}> = ({ content, onChange }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <textarea
        value={content.text || ''}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        placeholder="Ingrese el texto para esta sección..."
        className="w-full border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
      />
    </div>
  );
};

// Editor para secciones de estadísticas
const StatsSectionEditor: React.FC<{
  content: any;
  onChange: (content: any) => void;
}> = ({ content, onChange }) => {
  const addItem = () => {
    const newItems = [...content.items, { label: '', value: '', description: '' }];
    onChange({ ...content, items: newItems });
  };
  
  const removeItem = (index: number) => {
    const newItems = [...content.items];
    newItems.splice(index, 1);
    onChange({ ...content, items: newItems });
  };
  
  const updateItem = (index: number, updates: any) => {
    const newItems = [...content.items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ ...content, items: newItems });
  };
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="space-y-4">
        {content.items.map((item: any, index: number) => (
          <div key={index} className="bg-white p-3 rounded border border-gray-200 relative">
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute right-2 top-2 text-red-500 hover:bg-red-50 p-1 rounded"
            >
              <X size={14} />
            </button>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Etiqueta
                </label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(index, { label: e.target.value })}
                  placeholder="Ej: Estudiantes"
                  className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Valor
                </label>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateItem(index, { value: e.target.value })}
                  placeholder="Ej: 1,500+"
                  className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(index, { description: e.target.value })}
                placeholder="Descripción adicional (opcional)"
                className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={addItem}
        className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        <Plus size={14} className="mr-1" />
        Añadir Estadística
      </button>
    </div>
  );
};

// Editor para secciones de cronología (timeline)
const TimelineSectionEditor: React.FC<{
  content: any;
  onChange: (content: any) => void;
}> = ({ content, onChange }) => {
  const events = content.events || [];
  
  const addEvent = () => {
    const newEvents = [...events, { date: '', title: '', description: '' }];
    onChange({ ...content, events: newEvents });
  };
  
  const removeEvent = (index: number) => {
    const newEvents = [...events];
    newEvents.splice(index, 1);
    onChange({ ...content, events: newEvents });
  };
  
  const updateEvent = (index: number, updates: any) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], ...updates };
    onChange({ ...content, events: newEvents });
  };
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="space-y-4">
        {events.map((event: any, index: number) => (
          <div key={index} className="bg-white p-3 rounded border border-gray-200 relative">
            <button
              type="button"
              onClick={() => removeEvent(index)}
              className="absolute right-2 top-2 text-red-500 hover:bg-red-50 p-1 rounded"
            >
              <X size={14} />
            </button>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Fecha/Período
                </label>
                <input
                  type="text"
                  value={event.date}
                  onChange={(e) => updateEvent(index, { date: e.target.value })}
                  placeholder="Ej: 2018-2020"
                  className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => updateEvent(index, { title: e.target.value })}
                  placeholder="Ej: Nombre del coordinador"
                  className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Descripción
              </label>
              <textarea
                value={event.description}
                onChange={(e) => updateEvent(index, { description: e.target.value })}
                placeholder="Descripción del evento o período"
                className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 min-h-[60px]"
              />
            </div>
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={addEvent}
        className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        <Plus size={14} className="mr-1" />
        Añadir Evento
      </button>
    </div>
  );
};

// Editor para secciones de lista
const ListSectionEditor: React.FC<{
  content: any;
  onChange: (content: any) => void;
}> = ({ content, onChange }) => {
  const items = content.items || [];
  
  const addItem = () => {
    const newItems = [...items, { title: '', description: '' }];
    onChange({ ...content, items: newItems });
  };
  
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange({ ...content, items: newItems });
  };
  
  const updateItem = (index: number, updates: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ ...content, items: newItems });
  };
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="space-y-4">
        {items.map((item: any, index: number) => (
          <div key={index} className="bg-white p-3 rounded border border-gray-200 relative">
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute right-2 top-2 text-red-500 hover:bg-red-50 p-1 rounded"
            >
              <X size={14} />
            </button>
            
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Título del Elemento
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, { title: e.target.value })}
                placeholder="Ej: Apoyo Psicológico"
                className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Descripción
              </label>
              <textarea
                value={item.description}
                onChange={(e) => updateItem(index, { description: e.target.value })}
                placeholder="Descripción detallada"
                className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 min-h-[60px]"
              />
            </div>
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={addItem}
        className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        <Plus size={14} className="mr-1" />
        Añadir Elemento
      </button>
    </div>
  );
};

// Editor para sección de contacto
const ContactSectionEditor: React.FC<{
  content: any;
  onChange: (content: any) => void;
}> = ({ content, onChange }) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="space-y-4">
        <div className="bg-white p-3 rounded border border-gray-200">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Dirección
          </label>
          <input
            type="text"
            value={content.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Ej: Edificio Administrativo, 2do nivel, UASD Recinto San Juan"
            className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="bg-white p-3 rounded border border-gray-200">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Teléfono
          </label>
          <input
            type="text"
            value={content.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Ej: (809) XXX-XXXX Ext. 123"
            className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="bg-white p-3 rounded border border-gray-200">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={content.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Ej: bienestarestudiantil@sanjuan.uasd.edu.do"
            className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="bg-white p-3 rounded border border-gray-200">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Horario de Atención
          </label>
          <input
            type="text"
            value={content.schedule || ''}
            onChange={(e) => handleChange('schedule', e.target.value)}
            placeholder="Ej: Lunes a Viernes 8:00 AM - 4:00 PM"
            className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="bg-white p-3 rounded border border-gray-200">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Sitio Web
          </label>
          <input
            type="text"
            value={content.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="Ej: https://sanjuan.uasd.edu.do/bienestar"
            className="w-full text-sm border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};


  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FileText className="mr-2 text-blue-600" size={22} />
          Gestión de Memorias
        </h2>
        
        <button
          onClick={handleNewMemoria}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" /> 
          Nueva Memoria
        </button>
      </div>
      
      {/* Formulario para crear/editar */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSaveMemoria} className="border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-medium text-gray-700 mb-4">
                {formMode === 'create' ? 'Crear Nueva Memoria' : 'Editar Memoria'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentMemoria.title}
                    onChange={handleTitleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Postgrado, UCOTESIS, etc."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    URL Amigable
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={currentMemoria.slug}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholder="generado-automaticamente"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Generado automáticamente del título
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={currentMemoria.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                  placeholder="Breve descripción de esta sección de memorias"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                  <Youtube size={16} className="mr-1 text-red-600" />
                  URL de Video (YouTube)
                </label>
                <input
                  type="text"
                  name="videoUrl"
                  value={currentMemoria.videoUrl}
                  onChange={handleYoutubeUrlChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ingresa la URL del video de YouTube
                </p>
                
                {renderYoutubePreview()}
              </div>
              
              <MemoriasPdfUploader
  onPdfUploaded={handlePdfUploaded}
  currentPdfUrl={currentMemoria.pdfUrl}
  title="Documento PDF"
/>

{/* Editor de secciones de contenido */}
<ContentSectionsManager 
  sections={currentMemoria.contentSections || []}
  onChange={(sections) => setCurrentMemoria({...currentMemoria, contentSections: sections})}
/>

<div className="mb-6 flex items-center">
  <input
    type="checkbox"
    id="isPublished"
    checked={currentMemoria.isPublished}
    onChange={handlePublishedChange}
    className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
  />
  <label htmlFor="isPublished" className="text-sm font-medium text-gray-600">
    Publicar (visible al público)
  </label>
</div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <Loader className="animate-spin mr-2" size={16} />
                      Guardando...
                    </span>
                  ) : (
                    <span>Guardar</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Lista de memorias */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-blue-600" size={32} />
          <span className="ml-3 text-blue-600 font-medium">Cargando memorias...</span>
        </div>
      ) : memorias.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="text-gray-400 mx-auto mb-4" size={48} />
          <p className="text-gray-500 text-lg">No hay memorias disponibles</p>
          <p className="text-gray-400 text-sm mb-4">Las memorias que crees aparecerán aquí</p>
          <button
            onClick={handleNewMemoria}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-1" /> 
            Crear Primera Memoria
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {memorias.map((memoria) => (
            <div
              key={memoria._id}
              className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    {memoria.title}
                    {!memoria.isPublished && (
                      <span className="ml-2 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                        No publicado
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {memoria.description || 'Sin descripción'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditMemoria(memoria)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteMemoria(memoria._id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memoria.videoUrl && (
                  <div className="flex items-start space-x-2">
                    <Youtube size={18} className="text-red-600 mt-1" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">Video</p>
                      <a 
                        href={memoria.videoUrl.replace('/embed/', '/watch?v=')} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate block max-w-xs"
                      >
                        Ver en YouTube
                      </a>
                    </div>
                  </div>
                )}
                
                {memoria.pdfUrl && (
                  <div className="flex items-start space-x-2">
                    <FileText size={18} className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">Documento PDF</p>
                      <a 
                        href={memoria.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate block max-w-xs"
                      >
                        Ver documento
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-3 text-xs text-gray-400">
                Última actualización: {new Date(memoria.updatedAt!).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoriasManager;