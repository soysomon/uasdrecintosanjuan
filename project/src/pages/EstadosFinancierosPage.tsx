import React, { useState, useEffect } from 'react';
import { FileText, Loader, Download } from 'lucide-react';
import axios from 'axios';
import API_ROUTES from '../config/api';
import { EstadoFinancieroItem } from '../components/EstadosFinancierosManager';

const EstadosFinancierosPage: React.FC = () => {
  const [estadosFinancieros, setEstadosFinancieros] = useState<EstadoFinancieroItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstadosFinancieros = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_ROUTES.ESTADOS_FINANCIEROS);
        
        // Filtrar solo los estados financieros publicados y ordenarlos por fecha de actualización
        setEstadosFinancieros(
          response.data
            .filter((ef: EstadoFinancieroItem) => ef.isPublished)
            .sort((a: EstadoFinancieroItem, b: EstadoFinancieroItem) => 
              new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime()
            )
        );
        setError(null);
      } catch (err) {
        console.error('Error cargando estados financieros:', err);
        setError('No se pudieron cargar los estados financieros. Por favor, intente más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstadosFinancieros();
  }, []);

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
    <div className="container mx-auto px-4 py-36">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Estados Financieros</h1>
          <div className="h-1 w-32 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Documentación financiera y reportes económicos de la Universidad Autónoma de Santo Domingo, 
            Recinto San Juan, para garantizar la transparencia institucional.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin text-blue-600" size={32} />
            <span className="ml-3 text-blue-600 font-medium">Cargando estados financieros...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <FileText className="text-red-400 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error al cargar los estados financieros</h2>
            <p className="text-red-500">{error}</p>
          </div>
        ) : estadosFinancieros.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-lg text-center">
            <FileText className="text-gray-400 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No hay estados financieros disponibles</h2>
            <p className="text-gray-500">Los estados financieros estarán disponibles próximamente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estadosFinancieros.map((estadoFinanciero) => (
              <div
                key={estadoFinanciero._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
              >
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{estadoFinanciero.title}</h2>
                  
                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FileText size={14} className="mr-1 text-blue-600" />
                      Documento PDF
                    </span>
                  </div>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Actualizado: {formatDate(estadoFinanciero.updatedAt)}
                  </span>
                  <a 
                    href={estadoFinanciero.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 flex items-center text-sm font-medium hover:underline"
                  >
                    <Download size={16} className="mr-1" /> Descargar PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadosFinancierosPage;