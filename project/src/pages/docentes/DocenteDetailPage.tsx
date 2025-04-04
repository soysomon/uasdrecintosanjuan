import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  ChevronLeft, 
  MapPin, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe, 
  Calendar,
  AlertTriangle,
  Youtube
} from 'lucide-react';
import API_ROUTES from '../../config/api';
import { Video } from 'lucide-react'; // Alternativa a Youtube
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
  videoUrl?: string; // Añadir esta propiedad
  educacion?: Educacion[];
  idiomas?: string[];
  experienciaProfesional?: Experiencia[];
  reconocimientos?: Reconocimiento[];
  participacionEventos?: Evento[];
  isPublished: boolean;
}

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
        
        // Verificar si el docente está publicado
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
  
  
  // Determinar la URL de retorno
  const getReturnUrl = () => {
    if (!docente) return '/docentes/residentes';
    return docente.tipo === 'residente' 
      ? '/docentes/residentes' 
      : '/docentes/no-residentes';
  };
  
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-600 font-medium">Cargando información del docente...</span>
      </div>
    );
  }
  
  if (error || !docente) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-center items-center py-12 flex-col">
              <AlertTriangle className="text-red-500 mb-4" size={48} />
              <p className="text-red-600 text-lg">{error || 'No se encontró el docente solicitado.'}</p>
              <Link 
                to="/docentes/residentes" 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-4">
          <Link to={getReturnUrl()} className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
            <ChevronLeft size={16} className="mr-1" />
            Volver a {docente.tipo === 'residente' ? 'Docentes Residentes' : 'Docentes No Residentes'}
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Sección de encabezado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Foto del docente */}
            <div className="flex justify-center">
              <div className="w-56 h-56 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                {docente.fotoPerfil ? (
                  <img 
                    src={docente.fotoPerfil} 
                    alt={`${docente.nombre} ${docente.apellidos}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={80} className="text-gray-300" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Información básica */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {docente.nombre} {docente.apellidos}
              </h1>
              
              <div className="space-y-2 mb-4">
                {docente.cargo && (
                  <p className="text-blue-600 font-medium flex items-center">
                    <Briefcase className="mr-2" size={18} />
                    {docente.cargo}
                  </p>
                )}
                
                {docente.especialidad && (
                  <p className="text-gray-700 flex items-center">
                    <GraduationCap className="mr-2" size={18} />
                    {docente.especialidad}
                  </p>
                )}
                
                {docente.departamento && (
                  <p className="text-gray-700 flex items-center">
                    <MapPin className="mr-2" size={18} />
                    {docente.departamento}
                  </p>
                )}
              </div>
              
              {docente.descripcionGeneral && (
                <div className="mt-4 text-gray-600">
                  {docente.descripcionGeneral}
                </div>
              )}
            </div>
          </div>
          
          {/* Contenido detallado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-t border-gray-200 bg-gray-50">
            {/* Columna 1: Formación Académica e Idiomas */}
            <div className="space-y-6">
              {/* Formación Académica */}
              {docente.educacion && docente.educacion.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <GraduationCap className="mr-2 text-blue-600" size={20} />
                    Formación Académica
                  </h2>
                  
                  <div className="space-y-4">
                    {docente.educacion.map((edu, index) => (
                      <div key={index} className="pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                        <p className="font-medium text-gray-800">{edu.titulo}</p>
                        <p className="text-gray-600 text-sm">{edu.institucion}</p>
                        {edu.anio && <p className="text-gray-500 text-sm">{edu.anio}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Idiomas */}
              {docente.idiomas && docente.idiomas.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Globe className="mr-2 text-blue-600" size={20} />
                    Idiomas
                  </h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {docente.idiomas.map((idioma, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {idioma}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Columna 2: Experiencia Profesional */}
            <div>
              {docente.experienciaProfesional && docente.experienciaProfesional.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase className="mr-2 text-blue-600" size={20} />
                    Experiencia Profesional
                  </h2>
                  
                  <div className="space-y-4">
                    {docente.experienciaProfesional.map((exp, index) => (
                      <div key={index} className="pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                        <p className="font-medium text-gray-800">{exp.cargo}</p>
                        <p className="text-gray-600 text-sm">{exp.institucion}</p>
                        {exp.periodo && <p className="text-gray-500 text-sm">{exp.periodo}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Columna 3: Reconocimientos y Eventos */}
            <div className="space-y-6">
              {/* Reconocimientos */}
              {docente.reconocimientos && docente.reconocimientos.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Award className="mr-2 text-blue-600" size={20} />
                    Reconocimientos
                  </h2>
                  
                  <div className="space-y-4">
                    {docente.reconocimientos.map((rec, index) => (
                      <div key={index} className="pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                        <p className="font-medium text-gray-800">{rec.titulo}</p>
                        {rec.otorgadoPor && <p className="text-gray-600 text-sm">{rec.otorgadoPor}</p>}
                        {rec.anio && <p className="text-gray-500 text-sm">{rec.anio}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Participación en Eventos */}
              {docente.participacionEventos && docente.participacionEventos.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="mr-2 text-blue-600" size={20} />
                    Participación en Eventos
                  </h2>
                  
                  <div className="space-y-4">
                    {docente.participacionEventos.map((evento, index) => (
                      <div key={index} className="pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                        <p className="font-medium text-gray-800">{evento.nombre}</p>
                        <p className="text-gray-600 text-sm">{evento.lugar}</p>
                        {evento.anio && <p className="text-gray-500 text-sm">{evento.anio}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Video */}
{docente.videoUrl && docente.videoUrl.trim() !== '' && (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <Video className="mr-2 text-red-600" size={20} />
      Video
    </h2>
    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
      <iframe
        src={getYoutubeEmbedUrl(docente.videoUrl)}
        title={`Video de ${docente.nombre} ${docente.apellidos}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocenteDetailPage;