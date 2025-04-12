import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {ArrowLeft, Plus, Trash2, Edit, Check, AlertTriangle, FileText, Loader, X } from 'lucide-react';
import EstadosFinancierosPdfUploader from './EstadosFinancierosPdfUploader';
import API_ROUTES from '../config/api';
import { Link } from 'react-router-dom';

// Tipo para cada documento de estados financieros
export interface EstadoFinancieroItem {
  _id?: string;
  title: string;
  pdfUrl: string;
  pdfPublicId?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const EstadosFinancierosManager: React.FC = () => {
  const [estadosFinancieros, setEstadosFinancieros] = useState<EstadoFinancieroItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [currentEstadoFinanciero, setCurrentEstadoFinanciero] = useState<EstadoFinancieroItem>({
    title: '',
    pdfUrl: '',
    isPublished: true,
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
    fetchEstadosFinancieros();
  }, []);

  // Función para obtener todos los estados financieros
  const fetchEstadosFinancieros = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ROUTES.ESTADOS_FINANCIEROS);
      setEstadosFinancieros(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('Error al cargar los estados financieros', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error fetching estados financieros:', err);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEstadoFinanciero({
      ...currentEstadoFinanciero,
      [name]: value
    });
  };

  // Manejar cambios en el estado de publicación
  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEstadoFinanciero({
      ...currentEstadoFinanciero,
      isPublished: e.target.checked
    });
  };

  // Preparar formulario para crear nuevo estado financiero
  const handleNewEstadoFinanciero = () => {
    setCurrentEstadoFinanciero({
      title: '',
      pdfUrl: '',
      isPublished: true
    });
    setFormMode('create');
    setShowForm(true);
  };

  // Preparar formulario para editar estado financiero existente
  const handleEditEstadoFinanciero = (estadoFinanciero: EstadoFinancieroItem) => {
    setCurrentEstadoFinanciero(estadoFinanciero);
    setFormMode('edit');
    setShowForm(true);
  };

  // Cancelar y cerrar formulario
  const handleCancel = () => {
    setShowForm(false);
  };

  // Guardar estado financiero (crear o actualizar)
  const handleSaveEstadoFinanciero = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEstadoFinanciero.title) {
      toast.error('El título es obligatorio', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    // Validar PDF si existe una URL
    if (currentEstadoFinanciero.pdfUrl) {
      const isValidPdf = await validatePdf(currentEstadoFinanciero.pdfUrl);
      if (!isValidPdf) {
        toast.error('El PDF proporcionado no es válido o no está accesible', {
          icon: <AlertTriangle className="text-red-500" size={18} />
        });
        return;
      }
    } else {
      toast.error('El documento PDF es obligatorio', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    setSubmitting(true);
    
    try {
      if (formMode === 'create') {
        // Crear nuevo estado financiero
        await axios.post(API_ROUTES.ESTADOS_FINANCIEROS, currentEstadoFinanciero);
        toast.success('Estado financiero creado correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });
      } else {
        // Actualizar estado financiero existente
        await axios.put(API_ROUTES.ESTADOS_FINANCIEROS_BY_ID(currentEstadoFinanciero._id!), currentEstadoFinanciero);
        toast.success('Estado financiero actualizado correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });
      }
      
      setSubmitting(false);
      setShowForm(false);
      fetchEstadosFinancieros(); // Recargar la lista después de guardar
    } catch (err) {
      setSubmitting(false);
      toast.error('Error al guardar el estado financiero', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error saving estado financiero:', err);
    }
  };

  // Eliminar estado financiero
  const handleDeleteEstadoFinanciero = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este estado financiero?')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(API_ROUTES.ESTADOS_FINANCIEROS_BY_ID(id));
      
      toast.success('Estado financiero eliminado correctamente', {
        icon: <Check className="text-green-500" size={18} />
      });
      
      fetchEstadosFinancieros(); // Recargar la lista después de eliminar
    } catch (err) {
      setLoading(false);
      toast.error('Error al eliminar el estado financiero', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      console.error('Error deleting estado financiero:', err);
    }
  };

  // Actualizar URL del PDF
  const handlePdfUploaded = (url: string, publicId: string) => {
    setCurrentEstadoFinanciero({
      ...currentEstadoFinanciero,
      pdfUrl: url,
      pdfPublicId: publicId  // Guardar el ID público
    });
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-44 mb-10">
      <div className="flex justify-between items-center mb-12">
      <Link to="/admin-panel" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="mr-2" size={18} />
                Volver al panel de administración
              </Link>
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FileText className="mr-2 text-blue-600" size={22} />
          Gestión de Estados Financieros
        </h2>
        
        <button
          onClick={handleNewEstadoFinanciero}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" /> 
          Nuevo Estado Financiero
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
            <form onSubmit={handleSaveEstadoFinanciero} className="border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-medium text-gray-700 mb-4">
                {formMode === 'create' ? 'Crear Nuevo Estado Financiero' : 'Editar Estado Financiero'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentEstadoFinanciero.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Estados Financieros 2023"
                  required
                />
              </div>
              
              <EstadosFinancierosPdfUploader
                onPdfUploaded={handlePdfUploaded}
                currentPdfUrl={currentEstadoFinanciero.pdfUrl}
                title="Documento PDF (Obligatorio)"
              />

              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={currentEstadoFinanciero.isPublished}
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
      
      {/* Lista de estados financieros */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-blue-600" size={32} />
          <span className="ml-3 text-blue-600 font-medium">Cargando estados financieros...</span>
        </div>
      ) : estadosFinancieros.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="text-gray-400 mx-auto mb-4" size={48} />
          <p className="text-gray-500 text-lg">No hay estados financieros disponibles</p>
          <p className="text-gray-400 text-sm mb-4">Los estados financieros que crees aparecerán aquí</p>
          <button
            onClick={handleNewEstadoFinanciero}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-1" /> 
            Crear Primer Estado Financiero
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {estadosFinancieros.map((estadoFinanciero) => (
            <div
              key={estadoFinanciero._id}
              className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    {estadoFinanciero.title}
                    {!estadoFinanciero.isPublished && (
                      <span className="ml-2 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                        No publicado
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Última actualización: {formatDate(estadoFinanciero.updatedAt)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={estadoFinanciero.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex items-center"
                  >
                    <FileText size={18} />
                    <span className="ml-1 text-sm">Ver PDF</span>
                  </a>
                  <button
                    onClick={() => handleEditEstadoFinanciero(estadoFinanciero)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteEstadoFinanciero(estadoFinanciero._id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EstadosFinancierosManager;