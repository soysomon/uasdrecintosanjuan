import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, User, Video } from 'lucide-react';
import API_ROUTES from '../../config/api';

interface Educacion {
  titulo: string;
  institucion: string;
  anio: string;
}

interface Experiencia {
  cargo: string;
  institucion: string;
  periodo: string;
}

interface Reconocimiento {
  titulo: string;
  otorgadoPor: string;
  anio: string;
}

interface Evento {
  nombre: string;
  lugar: string;
  anio: string;
}

interface Docente {
  _id: string;
  nombre: string;
  apellidos: string;
  slug: string;
  tipo: 'residente' | 'no_residente';
  cargo?: string;
  especialidad?: string;
  departamento?: string;
  fotoPerfil?: string;
  descripcionGeneral?: string;
  videoUrl?: string;
  educacion?: Educacion[];
  idiomas?: string[];
  experienciaProfesional?: Experiencia[];
  reconocimientos?: Reconocimiento[];
  participacionEventos?: Evento[];
  isPublished: boolean;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
    {children}
  </h2>
);

const DocenteDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [docente, setDocente] = useState<Docente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDocente = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ROUTES.DOCENTES_BY_SLUG(slug!));
        
        if (!response.data.isPublished) {
          navigate('/not-found');
          return;
        }
        
        setDocente(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching docente:', err);
        setError('No se pudo cargar la información del docente. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      }
    };
    
    fetchDocente();
  }, [slug, navigate]);
  
  // Función para convertir URLs de YouTube a formato embed
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
  
  const getReturnUrl = () => {
    if (!docente) return '/docentes/residentes';
    return docente.tipo === 'residente' 
      ? '/docentes/residentes' 
      : '/docentes/no-residentes';
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
        <span className="ml-3 text-gray-700 font-medium">Cargando información del docente...</span>
      </div>
    );
  }
  
  if (error || !docente) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-center items-center py-12 flex-col">
              <p className="text-gray-700 text-lg">{error || 'No se encontró el docente solicitado.'}</p>
              <Link 
                to="/docentes/residentes" 
                className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Volver a la lista de docentes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navegación */}
        <div className="mb-6">
          <Link to={getReturnUrl()} className="text-gray-600 hover:text-gray-800 transition-colors flex items-center">
            <ChevronLeft size={16} className="mr-1" />
            Volver a {docente.tipo === 'residente' ? 'Docentes Residentes' : 'Docentes No Residentes'}
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Información del docente (lado izquierdo) */}
          <div className="md:w-2/3">
            {/* Título del docente */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {docente.nombre} {docente.apellidos}
            </h1>
            
            {/* Cargo/posición */}
            {docente.cargo && (
              <div className="text-lg text-gray-700 mb-4">
                {docente.cargo}
              </div>
            )}
            
            {/* Descripción general */}
            {docente.descripcionGeneral && (
              <div className="text-gray-700 leading-relaxed mb-8">
                <p style={{ whiteSpace: 'pre-line' }}>{docente.descripcionGeneral}</p>
              </div>
            )}
            
            {/* Video de YouTube */}
            {docente.videoUrl && docente.videoUrl.trim() !== '' && (
              <div className="mb-8">
                <SectionTitle>Video</SectionTitle>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <iframe
                    src={getYoutubeEmbedUrl(docente.videoUrl)}
                    title={`Video de ${docente.nombre} ${docente.apellidos}`}
                    className="w-full h-96"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Sección de Educación */}
            {docente.educacion && docente.educacion.length > 0 && (
              <div className="mb-8">
                <SectionTitle>Educación</SectionTitle>
                <ul className="list-none space-y-3">
                  {docente.educacion.map((edu, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">—</span>
                      <div>
                        <p className="font-medium text-gray-800">{edu.titulo}</p>
                        <p className="text-gray-600">{edu.institucion}</p>
                        {edu.anio && <p className="text-gray-500 text-sm">{edu.anio}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Sección de Idiomas */}
            {docente.idiomas && docente.idiomas.length > 0 && (
              <div className="mb-7">
                <SectionTitle>Idiomas</SectionTitle>
                <div className="text-gray-700">
                  {docente.idiomas.join(' • ')}
                </div>
              </div>
            )}
            
            {/* Sección de Experiencia Profesional */}
            {docente.experienciaProfesional && docente.experienciaProfesional.length > 0 && (
              <div className="mb-8">
                <SectionTitle>Experiencia Profesional</SectionTitle>
                <ul className="list-none space-y-4">
                  {docente.experienciaProfesional.map((exp, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">—</span>
                      <div>
                        <p className="font-medium text-gray-800">{exp.cargo}</p>
                        <p className="text-gray-600">{exp.institucion}</p>
                        {exp.periodo && <p className="text-gray-500 text-sm">{exp.periodo}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Sección de Reconocimientos */}
            {docente.reconocimientos && docente.reconocimientos.length > 0 && (
              <div className="mb-8">
                <SectionTitle>Reconocimientos</SectionTitle>
                <ul className="list-none space-y-4">
                  {docente.reconocimientos.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">—</span>
                      <div>
                        <p className="font-medium text-gray-800">{rec.titulo}</p>
                        {rec.otorgadoPor && <p className="text-gray-600">{rec.otorgadoPor}</p>}
                        {rec.anio && <p className="text-gray-500 text-sm">{rec.anio}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Imagen y eventos (lado derecho) */}
          <div className="md:w-1/3">
            {/* Imagen del docente */}
            <div className="mb-8">
              {docente.fotoPerfil ? (
                <img 
                  src={docente.fotoPerfil} 
                  alt={`${docente.nombre} ${docente.apellidos}`} 
                  className="w-full rounded-lg shadow-md"
                />
              ) : (
                <div className="bg-gray-100 rounded-lg flex items-center justify-center p-8 aspect-ratio-1 shadow-md">
                  <User size={80} className="text-gray-300" />
                </div>
              )}
            </div>
            
            {/* Sección de Eventos */}
            {docente.participacionEventos && docente.participacionEventos.length > 0 && (
              <div className="bg-gray-100 rounded-lg p-6">
                <SectionTitle>Participación en Eventos Internacionales</SectionTitle>
                <div className="space-y-6">
                  {docente.participacionEventos.map((evento, index) => (
                    <div key={index} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                      <p className="font-medium text-gray-800">{evento.nombre}</p>
                      <p className="text-gray-600 mt-1">{evento.lugar}</p>
                      {evento.anio && <p className="text-gray-500 text-sm mt-1">({evento.anio})</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocenteDetailPage;