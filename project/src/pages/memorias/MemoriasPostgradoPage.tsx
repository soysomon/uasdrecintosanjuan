import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { MemoriaItem } from '../../components/MemoriasManager';

export const MemoriasPostgradoPage: React.FC = () => {
  const [memoria, setMemoria] = useState<MemoriaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Esta función obtiene la información de memoria "Postgrado" de los datos guardados
    const fetchMemoriaData = async () => {
      try {
        setIsLoading(true);
        
        // Recuperamos los datos de memoria guardados en localStorage
        // (Esto es temporal hasta que implementes el backend)
        const memoriaData = localStorage.getItem('memorias');
        
        if (memoriaData) {
          const memorias: MemoriaItem[] = JSON.parse(memoriaData);
          // Buscamos la memoria con slug "postgrado"
          const postgradoMemoria = memorias.find(m => m.slug === 'postgrado');
          
          if (postgradoMemoria) {
            setMemoria(postgradoMemoria);
          } else {
            setError(true);
          }
        } else {
          // Si no hay datos guardados, podemos usar valores por defecto
          setMemoria({
            _id: '1',
            title: 'Evolución Postgrado 2018-2024',
            slug: 'postgrado',
            description: 'Informe detallado sobre la evolución del postgrado en el período 2018-2024',
            pdfUrl: 'https://uasdrecintosanjuan.org/wp-content/uploads/2024/10/INFORME-POSTGRADO-2018-2024.pdf',
            videoUrl: 'https://www.youtube.com/embed/NtVY27BR8Vk',
            order: 1,
            isPublished: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Error cargando datos de memoria:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemoriaData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-36">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !memoria) {
    return (
      <div className="container mx-auto px-4 py-36">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <FileText className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error de carga</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar la información de Postgrado. Puede que el contenido aún no haya sido creado.</p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-36">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">{memoria.title.toUpperCase()}</h1>
          <div className="h-1 w-32 bg-blue-600 mx-auto mb-8"></div>
          {memoria.description && (
            <p className="text-center text-gray-600 max-w-3xl mx-auto">{memoria.description}</p>
          )}
        </div>

        {/* YouTube Video Section */}
        {memoria.videoUrl && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Presentación Audiovisual</h2>
            <div className="relative pt-[56.25%] bg-black rounded-lg shadow-xl overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={memoria.videoUrl}
                title={memoria.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* PDF Section - Visor Confiable */}
        {memoria.pdfUrl && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Documentación Completa</h2>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2 sm:mb-0">
                  Documento PDF
                </h3>
                <div className="flex gap-2">
                  <a
                    href={memoria.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    <span>Abrir</span>
                  </a>
                  <a
                    href={memoria.pdfUrl}
                    download={`${memoria.title.replace(/\s+/g, '-').toLowerCase()}.pdf`}
                    className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                  >
                    <Download size={16} className="mr-1" />
                    <span>Descargar</span>
                  </a>
                </div>
              </div>
              
              <div className="h-[600px] w-full">
                {/* Viewer Option 1: Browser-Native (object) */}
                <object
                  data={memoria.pdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0"
                >
                  {/* Fallback para navegadores que no soportan la etiqueta object */}
                  <div className="p-10 text-center">
                    <p className="mb-4">Su navegador no puede mostrar PDFs directamente.</p>
                    <a
                      href={memoria.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                    >
                      Abrir PDF
                    </a>
                  </div>
                </object>
                
                {/* 
                  Viewer Option 2: PDF.js (Descomenta si necesitas este visor en lugar del nativo)
                  
                  <iframe
                    src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(memoria.pdfUrl)}`}
                    title="PDF Viewer"
                    className="w-full h-full border-0"
                  ></iframe>
                */}
              </div>
            </div>
          </div>
        )}


     
        </div>
      </div>
  );
};
