import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Youtube, Loader } from 'lucide-react';
import axios from 'axios';
import API_ROUTES from '../config/api';
import { MemoriaItem } from '../components/MemoriasManager';

const MemoriasPage: React.FC = () => {
  const [memorias, setMemorias] = useState<MemoriaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemorias = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_ROUTES.MEMORIAS);
        
        // Filtrar solo las memorias publicadas y ordenarlas
        setMemorias(
          response.data
            .filter((m: MemoriaItem) => m.isPublished)
            .sort((a: MemoriaItem, b: MemoriaItem) => a.order - b.order)
        );
        setError(null);
      } catch (err) {
        console.error('Error cargando memorias:', err);
        setError('No se pudieron cargar las memorias. Por favor, intente más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemorias();
  }, []);

  return (
    <div className="container mx-auto px-4 py-36">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Memorias Institucionales</h1>
          <div className="h-1 w-32 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Documentación histórica y reportes de los diferentes departamentos y unidades 
            de la Universidad Autónoma de Santo Domingo, Recinto San Juan.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin text-blue-600" size={32} />
            <span className="ml-3 text-blue-600 font-medium">Cargando memorias...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <FileText className="text-red-400 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error al cargar las memorias</h2>
            <p className="text-red-500">{error}</p>
          </div>
        ) : memorias.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-lg text-center">
            <FileText className="text-gray-400 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No hay memorias disponibles</h2>
            <p className="text-gray-500">Las memorias institucionales estarán disponibles próximamente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memorias.map((memoria) => (
              <Link
                key={memoria._id}
                to={`/memorias/${memoria.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
              >
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{memoria.title}</h2>
                  {memoria.description && (
                    <p className="text-gray-600 mb-4 text-sm">{memoria.description}</p>
                  )}
                  
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    {memoria.pdfUrl && (
                      <span className="flex items-center mr-4">
                        <FileText size={14} className="mr-1 text-blue-600" />
                        PDF
                      </span>
                    )}
                    {memoria.videoUrl && (
                      <span className="flex items-center">
                        <svg 
                          className="w-3.5 h-3.5 mr-1 text-red-600" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                        </svg>
                        Video
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Actualizado: {new Date(memoria.updatedAt || '').toLocaleDateString()}
                  </span>
                  <span className="text-blue-600 flex items-center text-sm font-medium">
                    Ver detalles <ChevronRight size={16} className="ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoriasPage;