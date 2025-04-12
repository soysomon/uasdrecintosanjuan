import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, Check, AlertTriangle, User, Users, Loader, X, Search, Youtube } from 'lucide-react';
import DocenteImgUploader from './DocenteImgUploader';
import API_ROUTES from '../config/api';
import { Video } from 'lucide-react'; // Alternativa a Youtube

// Interfaces para tipos de datos
export interface DocenteItem {
  _id?: string;
  nombre: string;
  apellidos: string;
  slug: string;
  tipo: 'residente' | 'no_residente';
  cargo?: string;
  especialidad?: string;
  departamento?: string;
  fotoPerfil?: string;
  fotoPublicId?: string;
  videoUrl?: string; 
  descripcionGeneral?: string;
  educacion?: {
    titulo: string;
    institucion: string;
    anio: string;
  }[];
  idiomas?: string[];
  experienciaProfesional?: {
    cargo: string;
    institucion: string;
    periodo: string;
  }[];
  reconocimientos?: {
    titulo: string;
    otorgadoPor: string;
    anio: string;
  }[];
  participacionEventos?: {
    nombre: string;
    lugar: string;
    anio: string;
  }[];
  order?: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const DocentesManager: React.FC = () => {
  // Estados
  const [docentes, setDocentes] = useState<DocenteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'residente' | 'no_residente'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado del docente actual en edición
  const [currentDocente, setCurrentDocente] = useState<DocenteItem>({
    nombre: '',
    apellidos: '',
    slug: '',
    tipo: 'residente',
    cargo: '',
    especialidad: '',
    departamento: '',
    descripcionGeneral: '',
    videoUrl: '', // Añadir campo para video
    educacion: [],
    idiomas: [],
    experienciaProfesional: [],
    reconocimientos: [],
    participacionEventos: [],
    isPublished: true,
  });
  
  // Cargar docentes al iniciar
  useEffect(() => {
    fetchDocentes();
  }, []);
  
  // Funciones para formularios dinámicos
  const [newEducacion, setNewEducacion] = useState({ titulo: '', institucion: '', anio: '' });
  const [newExperiencia, setNewExperiencia] = useState({ cargo: '', institucion: '', periodo: '' });
  const [newReconocimiento, setNewReconocimiento] = useState({ titulo: '', otorgadoPor: '', anio: '' });
  const [newEvento, setNewEvento] = useState({ nombre: '', lugar: '', anio: '' });
  const [newIdioma, setNewIdioma] = useState('');
  
  // Función para obtener todos los docentes
  const fetchDocentes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ROUTES.DOCENTES);
      setDocentes(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('Error al cargar los docentes', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error fetching docentes:', err);
    }
  };
  
  // Generar un slug a partir del nombre y apellidos
  const generateSlug = (nombre: string, apellidos: string) => {
    return `${nombre.toLowerCase()} ${apellidos.toLowerCase()}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/--+/g, '-') // Eliminar guiones múltiples
      .trim();
  };
  
  // Actualizar el campo slug cuando cambia el nombre o apellidos
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedDocente = { ...currentDocente, [name]: value };
    
    // Generar slug automáticamente si cambia nombre o apellidos
    if (name === 'nombre' || name === 'apellidos') {
      updatedDocente.slug = generateSlug(
        name === 'nombre' ? value : currentDocente.nombre,
        name === 'apellidos' ? value : currentDocente.apellidos
      );
    }
    
    setCurrentDocente(updatedDocente);
  };
  
  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentDocente({
      ...currentDocente,
      [name]: value
    });
  };
  
  // Manejar cambios en el estado de publicación
  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDocente({
      ...currentDocente,
      isPublished: e.target.checked
    });
  };
  
  // Preparar formulario para crear nuevo docente
  const handleNewDocente = () => {
    setCurrentDocente({
      nombre: '',
      apellidos: '',
      slug: '',
      tipo: 'residente',
      cargo: '',
      especialidad: '',
      departamento: '',
      descripcionGeneral: '',
      educacion: [],
      idiomas: [],
      experienciaProfesional: [],
      reconocimientos: [],
      participacionEventos: [],
      isPublished: true,
    });
    setFormMode('create');
    setShowForm(true);
  };
  
  // Preparar formulario para editar docente existente
  const handleEditDocente = (docente: DocenteItem) => {
    setCurrentDocente(docente);
    setFormMode('edit');
    setShowForm(true);
  };
  
  // Cancelar y cerrar formulario
  const handleCancel = () => {
    setShowForm(false);
  };
  
  // Guardar docente (crear o actualizar)
  const handleSaveDocente = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentDocente.nombre || !currentDocente.apellidos || !currentDocente.slug) {
      toast.error('El nombre y apellidos son obligatorios', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (formMode === 'create') {
        // Crear nuevo docente
        await axios.post(API_ROUTES.DOCENTES, currentDocente);
        toast.success('Docente creado correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });
      } else {
        // Actualizar docente existente
        await axios.put(API_ROUTES.DOCENTES_BY_ID(currentDocente._id!), currentDocente);
        toast.success('Docente actualizado correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });
      }
      
      setSubmitting(false);
      setShowForm(false);
      fetchDocentes(); // Recargar la lista después de guardar
    } catch (err) {
      setSubmitting(false);
      toast.error('Error al guardar el docente', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error saving docente:', err);
    }
  };
  
  // Eliminar docente
  const handleDeleteDocente = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este docente?')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(API_ROUTES.DOCENTES_BY_ID(id));
      
      toast.success('Docente eliminado correctamente', {
        icon: <Check className="text-green-500" size={18} />
      });
      
      fetchDocentes(); // Recargar la lista después de eliminar
    } catch (err) {
      setLoading(false);
      toast.error('Error al eliminar el docente', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error deleting docente:', err);
    }
  };
  
  // Actualizar imagen del docente
  const handleImageUploaded = (url: string, publicId: string) => {
    setCurrentDocente({
      ...currentDocente,
      fotoPerfil: url,
      fotoPublicId: publicId
    });
  };
  
  // --- Funciones para gestionar arrays de educación, experiencia, etc. ---
  
  // Educación
  const addEducacion = () => {
    if (!newEducacion.titulo || !newEducacion.institucion) return;
    
    setCurrentDocente({
      ...currentDocente,
      educacion: [...(currentDocente.educacion || []), { ...newEducacion }]
    });
    
    setNewEducacion({ titulo: '', institucion: '', anio: '' });
  };
  
  const removeEducacion = (index: number) => {
    const educacion = [...(currentDocente.educacion || [])];
    educacion.splice(index, 1);
    setCurrentDocente({ ...currentDocente, educacion });
  };
  
  // Experiencia Profesional
  const addExperiencia = () => {
    if (!newExperiencia.cargo || !newExperiencia.institucion) return;
    
    setCurrentDocente({
      ...currentDocente,
      experienciaProfesional: [...(currentDocente.experienciaProfesional || []), { ...newExperiencia }]
    });
    
    setNewExperiencia({ cargo: '', institucion: '', periodo: '' });
  };
  
  const removeExperiencia = (index: number) => {
    const experiencia = [...(currentDocente.experienciaProfesional || [])];
    experiencia.splice(index, 1);
    setCurrentDocente({ ...currentDocente, experienciaProfesional: experiencia });
  };
  
  // Reconocimientos
  const addReconocimiento = () => {
    if (!newReconocimiento.titulo) return;
    
    setCurrentDocente({
      ...currentDocente,
      reconocimientos: [...(currentDocente.reconocimientos || []), { ...newReconocimiento }]
    });
    
    setNewReconocimiento({ titulo: '', otorgadoPor: '', anio: '' });
  };
  
  const removeReconocimiento = (index: number) => {
    const reconocimientos = [...(currentDocente.reconocimientos || [])];
    reconocimientos.splice(index, 1);
    setCurrentDocente({ ...currentDocente, reconocimientos });
  };
  
  // Eventos
  const addEvento = () => {
    if (!newEvento.nombre || !newEvento.lugar) return;
    
    setCurrentDocente({
      ...currentDocente,
      participacionEventos: [...(currentDocente.participacionEventos || []), { ...newEvento }]
    });
    
    setNewEvento({ nombre: '', lugar: '', anio: '' });
  };
  
  const removeEvento = (index: number) => {
    const eventos = [...(currentDocente.participacionEventos || [])];
    eventos.splice(index, 1);
    setCurrentDocente({ ...currentDocente, participacionEventos: eventos });
  };
  
  // Idiomas
  const addIdioma = () => {
    if (!newIdioma) return;
    
    setCurrentDocente({
      ...currentDocente,
      idiomas: [...(currentDocente.idiomas || []), newIdioma]
    });
    
    setNewIdioma('');
  };
  
  const removeIdioma = (index: number) => {
    const idiomas = [...(currentDocente.idiomas || [])];
    idiomas.splice(index, 1);
    setCurrentDocente({ ...currentDocente, idiomas });
  };

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
  
  // Filtrar docentes para la visualización
  const filteredDocentes = docentes.filter(docente => {
    // Filtrar por tipo
    if (filterType !== 'all' && docente.tipo !== filterType) {
      return false;
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        docente.nombre.toLowerCase().includes(searchLower) ||
        docente.apellidos.toLowerCase().includes(searchLower) ||
        (docente.departamento && docente.departamento.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Users className="mr-2 text-blue-600" size={22} />
          Gestión de Docentes
        </h2>
        
        <button
          onClick={handleNewDocente}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" /> 
          Nuevo Docente
        </button>
      </div>
      
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o departamento..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'residente' | 'no_residente')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="all">Todos los docentes</option>
            <option value="residente">Docentes Residentes</option>
            <option value="no_residente">Docentes No Residentes</option>
          </select>
        </div>
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
            <form onSubmit={handleSaveDocente} className="border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                <User className="mr-2 text-blue-600" size={20} />
                {formMode === 'create' ? 'Crear Nuevo Docente' : 'Editar Docente'}
              </h3>
              
              {/* Secciones del formulario */}
              <div className="space-y-6">
                {/* Información Básica */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-4">Información Básica</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={currentDocente.nombre}
                        onChange={handleNameChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Juan"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Apellidos
                      </label>
                      <input
                        type="text"
                        name="apellidos"
                        value={currentDocente.apellidos}
                        onChange={handleNameChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Pérez García"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        URL Amigable
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={currentDocente.slug}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        placeholder="generado-automaticamente"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Generado automáticamente del nombre y apellidos
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Tipo de Docente
                      </label>
                      <select
                        name="tipo"
                        value={currentDocente.tipo}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="residente">Docente Residente</option>
                        <option value="no_residente">Docente No Residente</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Cargo
                      </label>
                      <input
                        type="text"
                        name="cargo"
                        value={currentDocente.cargo || ''}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Profesor de Matemáticas"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Especialidad
                      </label>
                      <input
                        type="text"
                        name="especialidad"
                        value={currentDocente.especialidad || ''}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Matemático e Investigador"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Departamento
                      </label>
                      <input
                        type="text"
                        name="departamento"
                        value={currentDocente.departamento || ''}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Facultad de Ciencias"
                      />
                    </div>
                  </div>
                  
                  <div>
  <label className="block text-sm font-medium text-gray-600 mb-1">
    Descripción General
  </label>
  <textarea
    name="descripcionGeneral"
    value={currentDocente.descripcionGeneral || ''}
    onChange={handleChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
    placeholder="Breve biografía o descripción del docente..."
    style={{ whiteSpace: 'pre-wrap' }} // Añadir esta línea
  />
  <p className="text-xs text-gray-500 mt-1">
    Puedes usar saltos de línea para crear párrafos y secciones.
  </p>
</div>
                </div>
                
                {/* Foto del Docente */}
                <DocenteImgUploader
                  onImageUploaded={handleImageUploaded}
                  currentImageUrl={currentDocente.fotoPerfil}
                  title="Fotografía del Docente"
                />
                
                {/* Educación */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-4">Formación Académica</h4>
                  
                  {/* Lista de educación existente */}
                  <div className="space-y-2 mb-4">
                    {currentDocente.educacion && currentDocente.educacion.length > 0 ? (
                      currentDocente.educacion.map((edu, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                          <div>
                            <span className="font-medium">{edu.titulo}</span>
                            <div className="text-sm text-gray-600">
                              {edu.institucion} {edu.anio && `(${edu.anio})`}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEducacion(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">No hay formación académica registrada.</p>
                    )}
                  </div>
                  
                  {/* Formulario para nueva educación */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        value={newEducacion.titulo}
                        onChange={(e) => setNewEducacion({ ...newEducacion, titulo: e.target.value })}
                        placeholder="Título académico"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={newEducacion.institucion}
                        onChange={(e) => setNewEducacion({ ...newEducacion, institucion: e.target.value })}
                        placeholder="Institución"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={newEducacion.anio}
                        onChange={(e) => setNewEducacion({ ...newEducacion, anio: e.target.value })}
                        placeholder="Año (opcional)"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />

                    </div>
                    <button
                      type="button"
                      onClick={addEducacion}
                      className="w-full p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} className="mr-1" /> Añadir Formación
                    </button>
                  </div>
                </div>
                
                {/* Idiomas */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-4">Idiomas</h4>
                  
                  {/* Lista de idiomas existentes */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentDocente.idiomas && currentDocente.idiomas.length > 0 ? (
                      currentDocente.idiomas.map((idioma, index) => (
                        <div key={index} className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200">
                          <span>{idioma}</span>
                          <button
                            type="button"
                            onClick={() => removeIdioma(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">No hay idiomas registrados.</p>
                    )}
                  </div>
                  
                  {/* Formulario para nuevo idioma */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newIdioma}
                      onChange={(e) => setNewIdioma(e.target.value)}
                      placeholder="Ej: Español, Inglés, Francés..."
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addIdioma}
                      className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    >
                      <Plus size={16} /> 
                    </button>
                  </div>
                </div>
                
                {/* Experiencia Profesional */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-4">Experiencia Profesional</h4>
                  
                  {/* Lista de experiencia existente */}
                  <div className="space-y-2 mb-4">
                    {currentDocente.experienciaProfesional && currentDocente.experienciaProfesional.length > 0 ? (
                      currentDocente.experienciaProfesional.map((exp, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                          <div>
                            <span className="font-medium">{exp.cargo}</span>
                            <div className="text-sm text-gray-600">
                              {exp.institucion} {exp.periodo && `(${exp.periodo})`}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExperiencia(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">No hay experiencia profesional registrada.</p>
                    )}
                  </div>
                  
                  {/* Formulario para nueva experiencia */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        value={newExperiencia.cargo}
                        onChange={(e) => setNewExperiencia({ ...newExperiencia, cargo: e.target.value })}
                        placeholder="Cargo"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={newExperiencia.institucion}
                        onChange={(e) => setNewExperiencia({ ...newExperiencia, institucion: e.target.value })}
                        placeholder="Institución"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={newExperiencia.periodo}
                        onChange={(e) => setNewExperiencia({ ...newExperiencia, periodo: e.target.value })}
                        placeholder="Período (opcional)"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addExperiencia}
                      className="w-full p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} className="mr-1" /> Añadir Experiencia
                    </button>
                  </div>
                </div>
                
                {/* Reconocimientos */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-4">Reconocimientos</h4>
                  
                  {/* Lista de reconocimientos existentes */}
                  <div className="space-y-2 mb-4">
                    {currentDocente.reconocimientos && currentDocente.reconocimientos.length > 0 ? (
                      currentDocente.reconocimientos.map((rec, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                          <div>
                            <span className="font-medium">{rec.titulo}</span>
                            <div className="text-sm text-gray-600">
                              {rec.otorgadoPor && `Otorgado por: ${rec.otorgadoPor}`} {rec.anio && `(${rec.anio})`}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeReconocimiento(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">No hay reconocimientos registrados.</p>
                    )}
                  </div>
                  
                  {/* Formulario para nuevo reconocimiento */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        value={newReconocimiento.titulo}
                        onChange={(e) => setNewReconocimiento({ ...newReconocimiento, titulo: e.target.value })}
                        placeholder="Título del reconocimiento"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={newReconocimiento.otorgadoPor}
                        onChange={(e) => setNewReconocimiento({ ...newReconocimiento, otorgadoPor: e.target.value })}
                        placeholder="Otorgado por (opcional)"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={newReconocimiento.anio}
                        onChange={(e) => setNewReconocimiento({ ...newReconocimiento, anio: e.target.value })}
                        placeholder="Año (opcional)"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addReconocimiento}
                      className="w-full p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} className="mr-1" /> Añadir Reconocimiento
                    </button>
                  </div>
                </div>
                
                {/* Participación en Eventos */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-4">Participación en Eventos</h4>
                  
                  {/* Lista de eventos existentes */}
                  <div className="space-y-2 mb-4">
                    {currentDocente.participacionEventos && currentDocente.participacionEventos.length > 0 ? (
                      currentDocente.participacionEventos.map((evento, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                          <div>
                            <span className="font-medium">{evento.nombre}</span>
                            <div className="text-sm text-gray-600">
                              {evento.lugar} {evento.anio && `(${evento.anio})`}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEvento(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">No hay eventos registrados.</p>
                    )}
                  </div>
                         {/* Campo para URL de video de YouTube */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
    <Youtube size={16} className="mr-1 text-red-600" />
    URL de Video (YouTube)
  </label>
  <input
    type="text"
    name="videoUrl"
    value={currentDocente.videoUrl || ''}
    onChange={(e) => {
      const url = e.target.value;
      const embedUrl = getYoutubeEmbedUrl(url);
      setCurrentDocente({
        ...currentDocente,
        videoUrl: e.target.value // Guardamos la URL original, no la de embed
      });
    }}
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="https://www.youtube.com/watch?v=..."
  />
  <p className="text-xs text-gray-500 mt-1">
    Opcional. Ingresa la URL de un video de YouTube relacionado con el docente.
  </p>
  
  {/* Previsualización del video */}
  {currentDocente.videoUrl && (
    <div className="mt-4">
      <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
        <iframe
          src={getYoutubeEmbedUrl(currentDocente.videoUrl)}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video preview"
        />
      </div>
    </div>
  )}
</div>
                  
                  {/* Formulario para nuevo evento */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        value={newEvento.nombre}
                        onChange={(e) => setNewEvento({ ...newEvento, nombre: e.target.value })}
                        placeholder="Nombre del evento"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={newEvento.lugar}
                        onChange={(e) => setNewEvento({ ...newEvento, lugar: e.target.value })}
                        placeholder="Lugar"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={newEvento.anio}
                        onChange={(e) => setNewEvento({ ...newEvento, anio: e.target.value })}
                        placeholder="Año (opcional)"
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addEvento}
                      className="w-full p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} className="mr-1" /> Añadir Evento
                    </button>
                  </div>
                </div>
                
                {/* Estado de publicación */}
                <div className="mb-6 flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={currentDocente.isPublished}
                    onChange={handlePublishedChange}
                    className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-gray-600">
                    Publicar (visible al público)
                  </label>
                </div>
                
                {/* Botones de acción */}
                <div className="flex justify-end space-x-3 mt-6">
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
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Lista de docentes */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-blue-600" size={32} />
          <span className="ml-3 text-blue-600 font-medium">Cargando docentes...</span>
        </div>
      ) : filteredDocentes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <User className="text-gray-400 mx-auto mb-4" size={48} />
          <p className="text-gray-500 text-lg">No hay docentes disponibles</p>
          <p className="text-gray-400 text-sm mb-4">
            {searchTerm ? 'No se encontraron docentes con ese término de búsqueda' : 'Los docentes que crees aparecerán aquí'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocentes.map((docente) => (
            <div
              key={docente._id}
              className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-start">
                {docente.fotoPerfil ? (
                  <div className="w-16 h-16 bg-gray-100 rounded-full mr-4 overflow-hidden flex-shrink-0">
                    <img 
                      src={docente.fotoPerfil} 
                      alt={`${docente.nombre} ${docente.apellidos}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full mr-4 flex items-center justify-center flex-shrink-0">
                    <User size={28} className="text-gray-400" />
                  </div>
                )}
             
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        {docente.nombre} {docente.apellidos}
                        {!docente.isPublished && (
                          <span className="ml-2 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                            No publicado
                          </span>
                        )}
                      </h3>
                      <p className="text-blue-600 text-sm">
                        {docente.cargo || 'Sin cargo asignado'}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {docente.departamento || 'Sin departamento asignado'}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditDocente(docente)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteDocente(docente._id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      docente.tipo === 'residente' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {docente.tipo === 'residente' ? 'Residente' : 'No Residente'}
                    </span>
                    
                    {docente.educacion && docente.educacion.length > 0 && (
                      <span className="ml-2 text-xs text-gray-500">
                        • {docente.educacion.length} títulos académicos
                      </span>
                    )}
                    
                    {docente.experienciaProfesional && docente.experienciaProfesional.length > 0 && (
                      <span className="ml-2 text-xs text-gray-500">
                        • {docente.experienciaProfesional.length} exp. profesionales
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocentesManager;