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


        {/* Additional Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Avances Significativos</h2>
          <p className="text-gray-600 mb-4">
            En el período 2018-2024, el departamento de Postgrado ha experimentado un crecimiento y evolución considerable,
            implementando nuevos programas académicos y mejorando la calidad educativa para satisfacer las demandas del mercado laboral actual.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Programas Nuevos</h3>
              <p className="text-gray-700">Incorporación de 5 nuevos programas de especialización y maestría en áreas de alta demanda.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Crecimiento Estudiantil</h3>
              <p className="text-gray-700">Incremento del 45% en la matrícula estudiantil, con una tasa de retención mejorada.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Convenios Internacionales</h3>
              <p className="text-gray-700">Establecimiento de 8 nuevos convenios con universidades de prestigio internacional.</p>
            </div>
          </div>
        </div>

        {/* Detailed Statistics Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Estadísticas Detalladas</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Programas de Postgrado por Año</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Año</th>
                      <th className="py-2 px-4 border-b text-left">Total Programas</th>
                      <th className="py-2 px-4 border-b text-left">Nuevos Programas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">2018</td>
                      <td className="py-2 px-4 border-b">3</td>
                      <td className="py-2 px-4 border-b">-</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">2019</td>
                      <td className="py-2 px-4 border-b">4</td>
                      <td className="py-2 px-4 border-b">Especialidad en Gestión Educativa</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">2020</td>
                      <td className="py-2 px-4 border-b">5</td>
                      <td className="py-2 px-4 border-b">Maestría en Salud Pública</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">2021</td>
                      <td className="py-2 px-4 border-b">6</td>
                      <td className="py-2 px-4 border-b">Especialidad en Derecho Constitucional</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">2022</td>
                      <td className="py-2 px-4 border-b">7</td>
                      <td className="py-2 px-4 border-b">Maestría en Desarrollo Local Sostenible</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">2023-2024</td>
                      <td className="py-2 px-4 border-b">8</td>
                      <td className="py-2 px-4 border-b">Especialidad en Gestión de Proyectos</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Convenios Internacionales</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Universidad</th>
                      <th className="py-2 px-4 border-b text-left">País</th>
                      <th className="py-2 px-4 border-b text-left">Año</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">Universidad Complutense</td>
                      <td className="py-2 px-4 border-b">España</td>
                      <td className="py-2 px-4 border-b">2019</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">Universidad de São Paulo</td>
                      <td className="py-2 px-4 border-b">Brasil</td>
                      <td className="py-2 px-4 border-b">2020</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">Universidad de Puerto Rico</td>
                      <td className="py-2 px-4 border-b">Puerto Rico</td>
                      <td className="py-2 px-4 border-b">2021</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">Universidad de Costa Rica</td>
                      <td className="py-2 px-4 border-b">Costa Rica</td>
                      <td className="py-2 px-4 border-b">2022</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">Universidad de Montreal</td>
                      <td className="py-2 px-4 border-b">Canadá</td>
                      <td className="py-2 px-4 border-b">2023</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Future Plans Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">Proyecciones 2024-2028</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 mb-6">
                Para el próximo período, el departamento de Postgrado ha establecido metas ambiciosas que
                buscan posicionar al centro como un referente regional en educación de postgrado:
              </p>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Aumentar la oferta académica a 12 programas de postgrado</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Implementar programas completamente en línea</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Establecer un centro de investigación especializado</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Incrementar en un 30% la matrícula de estudiantes internacionales</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Desarrollar un programa de doctorado en colaboración con universidades internacionales</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Áreas de Enfoque Estratégico</h3>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <h4 className="font-medium text-gray-800">Transformación Digital</h4>
                  <p className="text-gray-600 text-sm">Incorporación de tecnologías educativas avanzadas y modalidades virtuales.</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <h4 className="font-medium text-gray-800">Investigación Aplicada</h4>
                  <p className="text-gray-600 text-sm">Desarrollo de investigaciones que impacten directamente en la región.</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <h4 className="font-medium text-gray-800">Internacionalización</h4>
                  <p className="text-gray-600 text-sm">Fortalecimiento de redes académicas internacionales.</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <h4 className="font-medium text-gray-800">Innovación Curricular</h4>
                  <p className="text-gray-600 text-sm">Actualización constante de programas según demandas del mercado global.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Contacto Dirección de Postgrado</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-6">
                Para más información sobre los programas de postgrado y los avances presentados en este informe,
                no dude en contactar a la Dirección de Postgrado:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 text-blue-600 mr-3"></i>
                  <span className="text-gray-700">
                    Edificio de Postgrado, Campus UASD San Juan, Av. Anacaona, San Juan de la Maguana
                  </span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone text-blue-600 mr-3"></i>
                  <span className="text-gray-700">(809) 000-0000 ext. 123</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope text-blue-600 mr-3"></i>
                  <span className="text-gray-700">postgrado@uasd.edu.do</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-clock text-blue-600 mr-3"></i>
                  <span className="text-gray-700">Lunes a Viernes: 8:00 AM - 8:00 PM</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-globe text-blue-600 mr-3"></i>
                  <span className="text-gray-700">postgrado.uasd.edu.do</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Director de Postgrado</h3>

              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user text-2xl text-blue-600"></i>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Dr. Juan Pérez Rodríguez</p>
                  <p className="text-gray-600 text-sm">Ph.D. en Educación Superior</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                Bajo la dirección del Dr. Pérez, el departamento de Postgrado ha experimentado una notable transformación y
                crecimiento en los últimos años, posicionándose como un referente académico en la región.
              </p>

              <a
                href="mailto:director.postgrado@uasd.edu.do"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition mt-2"
              >
                Contactar Director
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
