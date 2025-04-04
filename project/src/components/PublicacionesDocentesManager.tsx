import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, Check, AlertTriangle, Book, Loader, X, FileText, Image as ImageIcon } from 'lucide-react';
import API_ROUTES from '../config/api';

// Interfaces
export interface PublicacionDocente {
  _id?: string;
  titulo: string;
  volumen: string;
  descripcion: string;
  anio: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  portadaUrl?: string;
  portadaPublicId?: string;
  isPublished: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

const PublicacionesDocentesManager: React.FC = () => {
  // Estados
  const [publicaciones, setPublicaciones] = useState<PublicacionDocente[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showForm, setShowForm] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingPortada, setUploadingPortada] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [portadaProgress, setPortadaProgress] = useState(0);

  // Estado de la publicación actual en edición
  const [currentPublicacion, setCurrentPublicacion] = useState<PublicacionDocente>({
    titulo: '',
    volumen: '',
    descripcion: '',
    anio: new Date().getFullYear().toString(),
    isPublished: true,
  });

  // Cargar publicaciones al iniciar
  useEffect(() => {
    fetchPublicaciones();
  }, []);

  // Funciones
  const fetchPublicaciones = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ROUTES.PUBLICACIONES_DOCENTES);
      setPublicaciones(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('Error al cargar las publicaciones', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error fetching publicaciones:', err);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentPublicacion({
      ...currentPublicacion,
      [name]: value
    });
  };

  // Manejar cambios en el estado de publicación
  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPublicacion({
      ...currentPublicacion,
      isPublished: e.target.checked
    });
  };

  // Preparar formulario para crear nueva publicación
  const handleNewPublicacion = () => {
    setCurrentPublicacion({
      titulo: '',
      volumen: '',
      descripcion: '',
      anio: new Date().getFullYear().toString(),
      isPublished: true,
    });
    setFormMode('create');
    setShowForm(true);
  };

  // Preparar formulario para editar publicación existente
  const handleEditPublicacion = (publicacion: PublicacionDocente) => {
    setCurrentPublicacion(publicacion);
    setFormMode('edit');
    setShowForm(true);
  };

  // Cancelar y cerrar formulario
  const handleCancel = () => {
    setShowForm(false);
  };

  // Guardar publicación (crear o actualizar)
  const handleSavePublicacion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPublicacion.titulo || !currentPublicacion.volumen) {
      toast.error('El título y el volumen son obligatorios', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    setSubmitting(true);

    try {
      if (formMode === 'create') {
        // Crear nueva publicación
        await axios.post(API_ROUTES.PUBLICACIONES_DOCENTES, currentPublicacion);
        toast.success('Publicación creada correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });
      } else {
        // Actualizar publicación existente
        await axios.put(API_ROUTES.PUBLICACION_DOCENTE_BY_ID(currentPublicacion._id!), currentPublicacion);
        toast.success('Publicación actualizada correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });
      }

      setSubmitting(false);
      setShowForm(false);
      fetchPublicaciones(); // Recargar la lista después de guardar
    } catch (err) {
      setSubmitting(false);
      toast.error('Error al guardar la publicación', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error saving publicacion:', err);
    }
  };

  // Eliminar publicación
  const handleDeletePublicacion = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(API_ROUTES.PUBLICACION_DOCENTE_BY_ID(id));

      toast.success('Publicación eliminada correctamente', {
        icon: <Check className="text-green-500" size={18} />
      });

      fetchPublicaciones(); // Recargar la lista después de eliminar
    } catch (err) {
      setLoading(false);
      toast.error('Error al eliminar la publicación', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error deleting publicacion:', err);
    }
  };

  // Subir PDF
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño y tipo de archivo
    if (file.size > 20 * 1024 * 1024) { // 20MB
      toast.error('El PDF es demasiado grande. Tamaño máximo: 20MB', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Por favor, sube un archivo PDF válido', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    setUploadingPdf(true);
    setPdfProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(API_ROUTES.UPLOAD_PDF, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setPdfProgress(percentCompleted);
        }
      });

      if (res.data.success) {
        setCurrentPublicacion({
          ...currentPublicacion,
          pdfUrl: res.data.pdfUrl,
          pdfPublicId: res.data.public_id
        });

        toast.success('PDF subido correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });
      } else {
        toast.error('Error al subir el PDF', {
          icon: <AlertTriangle className="text-red-500" size={18} />
        });
      }
    } catch (err) {
      console.error('Error al subir PDF:', err);
      toast.error('Error al subir el PDF. Verifica el tamaño y formato.', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    } finally {
      setUploadingPdf(false);
    }
  };

  // Subir Portada
  const handlePortadaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño y tipo de archivo
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('La imagen es demasiado grande. Tamaño máximo: 5MB', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, sube una imagen válida', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    setUploadingPortada(true);
    setPortadaProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(API_ROUTES.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setPortadaProgress(percentCompleted);
        }
      });

      if (res.data.success) {
        setCurrentPublicacion({
          ...currentPublicacion,
          portadaUrl: res.data.imageUrl,
          portadaPublicId: res.data.public_id
        });

        toast.success('Portada subida correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });
      } else {
        toast.error('Error al subir la portada', {
          icon: <AlertTriangle className="text-red-500" size={18} />
        });
      }
    } catch (err) {
      console.error('Error al subir portada:', err);
      toast.error('Error al subir la portada. Verifica el tamaño y formato.', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    } finally {
      setUploadingPortada(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Book className="mr-2 text-blue-600" size={22} />
          Gestión de Publicaciones "Conoce tu Docente"
        </h2>

        <button
          onClick={handleNewPublicacion}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Nueva Publicación
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
            <form onSubmit={handleSavePublicacion} className="border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                <Book className="mr-2 text-blue-600" size={20} />
                {formMode === 'create' ? 'Crear Nueva Publicación' : 'Editar Publicación'}
              </h3>

              <div className="space-y-6">
                {/* Información Básica */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-4">Información Básica</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        name="titulo"
                        value={currentPublicacion.titulo}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Conoce tus Docentes"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Volumen
                      </label>
                      <input
                        type="text"
                        name="volumen"
                        value={currentPublicacion.volumen}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Volumen I"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Año de Publicación
                      </label>
                      <input
                        type="text"
                        name="anio"
                        value={currentPublicacion.anio}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: 2023"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Descripción
                      </label>
                      <textarea
                        name="descripcion"
                        value={currentPublicacion.descripcion}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                        placeholder="Breve descripción de esta publicación..."
                      />
                    </div>
                  </div>
                </div>

                {/* Subir PDF */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-4 flex items-center">
                    <FileText className="mr-2 text-blue-600" size={18} />
                    Documento PDF
                  </h4>

                  <div className="mb-4">
                    {currentPublicacion.pdfUrl ? (
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <FileText className="text-red-500 mr-2" size={20} />
                          <div>
                            <div className="text-sm font-medium">Documento subido</div>
                            <a
                              href={currentPublicacion.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Ver PDF
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentPublicacion({
                            ...currentPublicacion,
                            pdfUrl: undefined,
                            pdfPublicId: undefined
                          })}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative border border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg flex flex-col items-center hover:border-blue-400 hover:bg-blue-50 group">
                        {uploadingPdf ? (
                          <div className="w-full">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Subiendo PDF...</span>
                              <span>{pdfProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all"
                                style={{ width: `${pdfProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FileText className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
                            <input
                              type="file"
                              accept="application/pdf"
                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                              onChange={handlePdfUpload}
                            />
                            <p className="text-gray-600 text-sm font-medium">
                              Seleccionar archivo PDF
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Formato: PDF (Máx. 20MB)
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subir Portada */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-4 flex items-center">
                    <ImageIcon className="mr-2 text-blue-600" size={18} />
                    Imagen de Portada
                  </h4>

                  <div className="mb-4">
                    {currentPublicacion.portadaUrl ? (
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-sm font-medium">Portada actual</h5>
                          <button
                            type="button"
                            onClick={() => setCurrentPublicacion({
                              ...currentPublicacion,
                              portadaUrl: undefined,
                              portadaPublicId: undefined
                            })}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="relative aspect-[3/4] max-w-[200px] mx-auto overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={currentPublicacion.portadaUrl}
                            alt="Portada"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative border border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg flex flex-col items-center hover:border-blue-400 hover:bg-blue-50 group">
                        {uploadingPortada ? (
                          <div className="w-full">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Subiendo imagen...</span>
                              <span>{portadaProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all"
                                style={{ width: `${portadaProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                              onChange={handlePortadaUpload}
                            />
                            <p className="text-gray-600 text-sm font-medium">
                              Seleccionar imagen de portada
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Formatos: JPG, PNG (Máx. 5MB)
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Estado de publicación */}
                <div className="mb-6 flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={currentPublicacion.isPublished}
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

      {/* Lista de publicaciones */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-blue-600" size={32} />
          <span className="ml-3 text-blue-600 font-medium">Cargando publicaciones...</span>
        </div>
      ) : publicaciones.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Book className="text-gray-400 mx-auto mb-4" size={48} />
          <p className="text-gray-500 text-lg">No hay publicaciones disponibles</p>
          <p className="text-gray-400 text-sm mb-4">
            Las publicaciones que crees aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicaciones.map((publicacion) => (
            <div
              key={publicacion._id}
              className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-start">
                {publicacion.portadaUrl ? (
                  <div className="w-24 h-32 bg-gray-100 rounded-md mr-4 overflow-hidden flex-shrink-0">
                    <img
                      src={publicacion.portadaUrl}
                      alt={publicacion.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-32 bg-gray-100 rounded-md mr-4 flex items-center justify-center flex-shrink-0">
                    <Book size={28} className="text-gray-400" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        {publicacion.titulo}
                        {!publicacion.isPublished && (
                          <span className="ml-2 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                            No publicado
                          </span>
                        )}
                      </h3>
                      <p className="text-blue-600 text-sm">
                        {publicacion.volumen}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Año: {publicacion.anio || 'No especificado'}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPublicacion(publicacion)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePublicacion(publicacion._id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {publicacion.descripcion && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {publicacion.descripcion}
                    </p>
                  )}

                  <div className="mt-3 flex items-center space-x-2">
                    {publicacion.pdfUrl ? (
                      <a
                        href={publicacion.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full hover:bg-red-100 transition-colors"
                      >
                        <FileText size={12} className="mr-1" /> Ver PDF
                      </a>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        Sin PDF
                      </span>
                    )}

                    <span className="text-xs text-gray-500">
                      Creado: {new Date(publicacion.createdAt || '').toLocaleDateString()}
                    </span>
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

export default PublicacionesDocentesManager;
