import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, ExternalLink, ArrowLeft, Loader } from 'lucide-react';
import axios from 'axios';
import API_ROUTES from '../config/api';
import { MemoriaItem } from '../components/MemoriasManager';



// Interfaces para tipos de secciones
interface ContentSection {
  sectionType: 'text' | 'stats' | 'table' | 'gallery' | 'timeline' | 'list' | 'quote' | 'contact';
  title?: string;
  content: any;
  order: number;
}

// Componente para renderizar una sección de contenido según su tipo
const ContentSectionRenderer: React.FC<{
  section: ContentSection
}> = ({ section }) => {
  // Renderizar el contenido según el tipo de sección
  // Renderizar el contenido según el tipo de sección
  const renderContent = () => {
    switch (section.sectionType) {
      case 'text':
        return <TextSection content={section.content} />;
      case 'stats':
        return <StatsSection content={section.content} />;
      case 'timeline':
        return <TimelineSection content={section.content} />;
      case 'list':
        return <ListSection content={section.content} />;
      case 'contact':
        return <ContactSection content={section.content} />;
      // Otros tipos no implementados completamente
      case 'table':
      case 'gallery':
      case 'quote':
      default:
        return (
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-center">
              Sección de tipo "{section.sectionType}" no implementada completamente
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {section.title && (
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">{section.title}</h2>
      )}
      {renderContent()}
    </div>
  );
};

// Componente para sección de texto
const TextSection: React.FC<{ content: any }> = ({ content }) => {
  // Dividir el texto en párrafos
  const paragraphs = content.text?.split('\n').filter(Boolean) || [];

  return (
    <div className="prose max-w-none">
      {paragraphs.map((paragraph: string, i: number) => (
        <p key={i} className="text-gray-600 mb-4 last:mb-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

// Componente para sección de estadísticas
const StatsSection: React.FC<{ content: any }> = ({ content }) => {
  const { items = [] } = content;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
      {items.map((item: any, index: number) => (
        <div key={index} className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">{item.label}</h3>
          <div className="text-3xl font-bold text-blue-900 mb-2">{item.value}</div>
          <p className="text-gray-700">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

// Componente para sección timeline
const TimelineSection: React.FC<{ content: any }> = ({ content }) => {
  const { events = [] } = content;

  return (
    <div className="space-y-8 relative">
      {/* Línea vertical conectora */}
      <div className="absolute left-[19px] top-[40px] bottom-0 w-[2px] bg-blue-200"></div>

      {events.map((event: any, index: number) => (
        <div key={index} className="flex">
          <div className="mr-6 relative z-10">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
              {event.date?.substring(0, 4)}
            </div>
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {event.date}
              </span>
            </div>
            <p className="text-gray-600 mt-2">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente para sección de lista
const ListSection: React.FC<{ content: any }> = ({ content }) => {
  const { items = [] } = content;

  return (
    <div className="space-y-6">
      {items.map((item: any, index: number) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

// Componente para sección de contacto
const ContactSection: React.FC<{ content: any }> = ({ content }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {content.address && (
            <div className="flex items-start">
              <div className="mr-3 text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Dirección</p>
                <p className="text-gray-600">{content.address}</p>
              </div>
            </div>
          )}

          {content.phone && (
            <div className="flex items-start">
              <div className="mr-3 text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Teléfono</p>
                <p className="text-gray-600">{content.phone}</p>
              </div>
            </div>
          )}

          {content.email && (
            <div className="flex items-start">
              <div className="mr-3 text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Correo electrónico</p>
                <a href={`mailto:${content.email}`} className="text-blue-600 hover:underline">{content.email}</a>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {content.schedule && (
            <div className="flex items-start">
              <div className="mr-3 text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Horario de atención</p>
                <p className="text-gray-600">{content.schedule}</p>
              </div>
            </div>
          )}

          {content.website && (
            <div className="flex items-start">
              <div className="mr-3 text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Sitio web</p>
                <a href={content.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {content.website}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MemoriaContentPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [memoria, setMemoria] = useState<MemoriaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  // Función para generar la URL del proxy para PDFs
  const getPdfUrl = (memoria: MemoriaItem) => {
    if (!memoria.pdfUrl) return '';

    // Si es una URL de S3, usar nuestro proxy
    if (memoria.pdfUrl.includes('s3.amazonaws.com')) {
      try {
        // Extraer la clave del objeto de S3 (parte después del nombre del bucket)
        const s3Parts = memoria.pdfUrl.split('.s3.amazonaws.com/');
        if (s3Parts.length > 1) {
          const s3Key = s3Parts[1];
          return API_ROUTES.PDF_BY_KEY(s3Key);
        }
      } catch (error) {
        console.error('Error procesando URL de S3:', error);
      }
    }

    // Si todo lo demás falla, devolver la URL original
    return memoria.pdfUrl;
  };



  useEffect(() => {
    const fetchMemoriaData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_ROUTES.MEMORIAS_BY_SLUG(slug || ''));
        console.log('URL del PDF recibida:', response.data.pdfUrl);
        setMemoria(response.data);
        setError(false);
      } catch (err) {
        console.error('Error cargando datos de memoria:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchMemoriaData();
    } else {
      setError(true);
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-36">
        <div className="flex justify-center items-center">
          <Loader className="animate-spin text-blue-600" size={32} />
          <span className="ml-3 text-blue-600 font-medium">Cargando contenido...</span>
        </div>
      </div>
    );
  }

  if (error || !memoria) {
    return (
      <div className="container mx-auto px-4 py-36">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <FileText className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contenido no encontrado</h2>
          <p className="text-gray-600 mb-4">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
          <Link
            to="/memorias"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <ArrowLeft size={16} className="mr-1" />
            Volver a Memorias
          </Link>
        </div>
      </div>
    );
  }

  // Generar la URL del PDF usando la nueva función
  const pdfUrl = memoria.pdfUrl ? getPdfUrl(memoria) : '';

  return (
    <div className="container mx-auto px-4 py-36">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb navigation */}
        <br></br>
        <div className="mb-8">
          <Link to="/memorias" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm">
            <ArrowLeft size={14} className="mr-1" />
            Volver a Memorias
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">{memoria.title.toUpperCase()}</h1>
          <div className="h-1 w-32 bg-blue-600 mx-auto mb-8"></div>
          {memoria.description && (
            <p className="text-center text-gray-600 max-w-3xl mx-auto">{memoria.description}</p>
          )}
        </div>

        {/* Secciones de tipo texto - siempre antes del PDF */}
        {memoria.contentSections && memoria.contentSections.filter(s => s.sectionType === 'text').length > 0 && (
          <div className="space-y-16 mb-16">
            {memoria.contentSections
              .filter(s => s.sectionType === 'text')
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <ContentSectionRenderer
                  key={`text-${index}`}
                  section={section}
                />
              ))}
          </div>
        )}

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

        {/* PDF Section */}
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
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    <span>Abrir</span>
                  </a>
                  <a
                    href={pdfUrl}
                    download={`${memoria.title.replace(/\s+/g, '-').toLowerCase()}.pdf`}
                    className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                  >
                    <Download size={16} className="mr-1" />
                    <span>Descargar</span>
                  </a>
                </div>
              </div>

              <div className="h-[600px] w-full">
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0"
                >
                  <div className="p-10 text-center">
                    <p className="mb-4">Su navegador no puede mostrar PDFs directamente.</p>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                    >
                      Abrir PDF
                    </a>
                  </div>
                </object>
              </div>
            </div>
          </div>
        )}

        {/* Secciones que no son tipo texto - siempre después del PDF */}
        {memoria.contentSections && memoria.contentSections.filter(s => s.sectionType !== 'text').length > 0 && (
          <div className="space-y-16 mb-16">
            {memoria.contentSections
              .filter(s => s.sectionType !== 'text')
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <ContentSectionRenderer
                  key={`nontext-${index}`}
                  section={section}
                />
              ))}
          </div>
        )}




        {/* Si no hay PDF ni video, mostrar mensaje */}
        {!memoria.pdfUrl && !memoria.videoUrl && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-16">
            <FileText className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No hay contenido disponible</h3>
            <p className="text-gray-500">
              El contenido para esta sección se encuentra en desarrollo. Vuelva a consultar más tarde.
            </p>
          </div>
        )}

        {/* Contenido específico para distintos tipos de memorias */}
        {slug === 'postgrado' && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default MemoriaContentPage;