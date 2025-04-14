import React, { useState } from 'react';
import { Mail, Phone, ChevronRight, X, Award, GraduationCap, Briefcase, BookOpen, User } from 'lucide-react';

interface Education {
  degree: string;
  institution: string;
  year?: string;
}

interface Experience {
  position: string;
  institution: string;
  period: string;
}

interface DirectivoProfile {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  imageUrl?: string;
  email?: string;
  videoId?: string;
  education?: Education[];
  experience?: Experience[];
  bio?: string;
}

const directivos: DirectivoProfile[] = [
  {
    id: 'carlos-sanchez',
    firstName: 'Carlos Manuel',
    lastName: 'Sánchez De Óleo',
    position: 'Director General',
    imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png',
    email: 'carlos.sanchez@uasd.edu.do',
    videoId: 'ERoZh4QfGyE',
    bio: 'Nació en el municipio de El Cercado, República Dominicana. Son sus padres los señores José Sánchez Encarnación, Físico – Matemático y Juana De Óleo Montero, Enfermera y Psicóloga.',
    education: [
      { degree: 'Doctorado en Matemáticas', institution: 'Universidad Politécnica de Valencia, España' },
      { degree: 'Maestría en Física', institution: 'UASD' },
      { degree: 'Maestría en Matemáticas', institution: 'UASD' },
      { degree: 'Ingeniería Civil', institution: 'INTEC-INCE' }
    ],
    experience: [
      { position: 'Director', institution: 'UASD-Recinto San Juan', period: '2018 - Presente' },
      { position: 'Profesor-Investigador', institution: 'UASD', period: '2004 - Presente' },
      { position: 'Investigador FONDOCYT', institution: 'MESCyT', period: '2018 - Presente' }
    ]
  },
  {
    id: 'bienvenido-romero',
    firstName: 'Bienvenido',
    lastName: 'Romero Boció',
    position: 'Sub – Director Académico',
    videoId: 'zwWABUQ3qIw',
    bio: 'Nació en el municipio de Hondo Valle, provincia Elías Piña el 10 de marzo del año 1956. Desde niño recibió el calor y la protección de sus padres, familiares y amigos.',
    education: [
      { degree: 'Maestría en Lingüística', institution: 'UASD', year: '2019' },
      { degree: 'Post-grado en Lingüística Aplicada', institution: 'INTEC', year: '1994' },
      { degree: 'Licenciatura en Educación', institution: 'UNPHU', year: '1989' }
    ]
  },
  {
    id: 'leonor-taveras',
    firstName: 'Leonor',
    lastName: 'Taveras',
    position: 'Sub – Directora Administrativa',
    videoId: 'mkT0ggAEAsQ',
    bio: 'Nació el primero de julio en el municipio de San Juan de la Maguana, en la comunidad Río Arriba del Norte.',
    education: [
      { degree: 'Maestría en Administración de Empresas', institution: 'UASD' },
      { degree: 'Especialista en Desarrollo Organizacional', institution: 'UASD' },
      { degree: 'Licenciatura en Administración de Empresas', institution: 'UASD' }
    ]
  },
  {
    id: 'pablo-encarnacion',
    firstName: 'Pablo',
    lastName: 'Encarnación De la Rosa',
    position: 'Encargado de Postgrado',
    videoId: 'DR8-Oi0iUu4',
    bio: 'Docente de la Universidad Autónoma de Santo Domingo, nació el viernes dieciséis de enero del año 1976.',
    education: [
      { degree: 'Maestría en Economía Internacional', institution: 'Universidad Complutense de Madrid' },
      { degree: 'Maestría en Alta Gerencia', institution: 'UASD' },
      { degree: 'Licenciatura en Administración', institution: 'UASD' }
    ]
  },
  {
    id: 'ruben-ramirez',
    firstName: 'Rubén',
    lastName: 'Ramírez Taveras',
    position: 'Encargado de Investigación',
    videoId: 'ymYpWVlmjUI',
    bio: 'Nació en la comunidad de Loma Verde, municipio de Juan Herrera, provincia de San Juan.',
    education: [
      { degree: 'Maestría en Gerencia Financiera', institution: 'UASD', year: 'En curso' },
      { degree: 'Maestría en Administración de Empresas', institution: 'UASD', year: '2014' },
      { degree: 'Licenciatura en Administración', institution: 'UASD', year: '2005' }
    ]
  },
  {
    id: 'pablo-espinosa',
    firstName: 'Pablo M.',
    lastName: 'Espinosa Lebrón',
    position: 'Presidente ASOPROUASD San Juan',
    education: [
      { degree: 'Maestría en Educación Superior', institution: 'UASD' },
      { degree: 'Licenciatura en Educación', institution: 'UASD' }
    ]
  },
  {
    id: 'suzana-hernandez',
    firstName: 'Suzana',
    lastName: 'Hernández Rosario',
    position: 'Secretaria General ASOPROUASD San Juan',
    education: [
      { degree: 'Maestría en Gestión Educativa', institution: 'UASD' },
      { degree: 'Licenciatura en Educación', institution: 'UASD' }
    ]
  },
  {
    id: 'efrain-guzman',
    firstName: 'Efraín',
    lastName: 'Guzmán Nova',
    position: 'Coordinador Docente',
    education: [
      { degree: 'Maestría en Educación', institution: 'UASD' },
      { degree: 'Licenciatura en Educación', institution: 'UASD' }
    ]
  },
  {
    id: 'lesia-bautista',
    firstName: 'Lesia',
    lastName: 'Bautista Gómez',
    position: 'Encargada Extensión',
    education: [
      { degree: 'Maestría en Gestión Cultural', institution: 'UASD' },
      { degree: 'Licenciatura en Educación', institution: 'UASD' }
    ]
  },
  {
    id: 'agustina-fragoso',
    firstName: 'Agustina Isabel',
    lastName: 'Fragoso',
    position: 'Delegada ASODEMU-RSJM',
    education: [
      { degree: 'Licenciatura en Administración', institution: 'UASD' }
    ]
  }
];

export function DirectivosPage() {
  const [selectedDirectivo, setSelectedDirectivo] = useState<DirectivoProfile | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Función para generar color basado en el ID (consistente para cada directivo)
  const generateColor = (id: string) => {
    const colors = [
      '#4F46E5', '#7C3AED', '#EC4899', '#EF4444', '#F59E0B', 
      '#10B981', '#3B82F6', '#8B5CF6', '#6366F1', '#14B8A6'
    ];
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  // Función para obtener iniciales
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section con diseño inspirado en Bauhaus */}
      <div className="relative bg-[#2f2382] py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f2382]/95 to-[#2f2382]/70" />
          {/* Formas geométricas inspiradas en Bauhaus */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 transform translate-x-1/3 translate-y-1/3 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 transform -translate-y-1/2 rotate-12" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <br></br>
            <br></br>
            <br></br>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Consejo Directivo
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-100">
              Liderando la excelencia académica y el desarrollo institucional
            </p>
          </div>
        </div>
      </div>

      {/* Director destacado - estilo tarjeta moderna */}
      <div className="relative -mt-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Mantener imagen solo para el director principal si se requiere */}
              <div className="col-span-2 relative">
                <div className="h-full bg-gradient-to-br from-[#2f2382] to-[#5e51c7] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 transform translate-x-1/3 translate-y-1/3 rounded-full" />
                  </div>
                  <div className="flex items-center justify-center h-full p-8">
                    <img
                      src={directivos[0].imageUrl}
                      alt={`${directivos[0].firstName} ${directivos[0].lastName}`}
                      className="w-64 h-64 object-cover rounded-full border-4 border-white shadow-xl"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-[#2f2382] mb-4">
                  {directivos[0].firstName} {directivos[0].lastName}
                </h2>
                <p className="text-xl text-gray-600 mb-6">{directivos[0].position}</p>
                <p className="text-gray-600 mb-8">{directivos[0].bio}</p>
                <button
                  onClick={() => {
                    setSelectedDirectivo(directivos[0]);
                    setShowVideo(true);
                  }}
                  className="inline-flex items-center px-6 py-3 bg-[#2f2382] text-white rounded-lg hover:bg-[#2f2382]/90 transition-colors"
                >
                  Ver presentación
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Directorio en forma de tarjetas modernas sin imágenes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {directivos.slice(1).map((directivo) => {
            const bgColor = generateColor(directivo.id);
            const initials = getInitials(directivo.firstName, directivo.lastName);
            
            return (
              <div
                key={directivo.id}
                className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-[#2f2382]/30"
              >
                <div 
                  className="h-32 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${bgColor}, ${bgColor}CC)` }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-[#2f2382] transition-colors">
                    {directivo.firstName} {directivo.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{directivo.position}</p>
                  
                  {/* Miniatura de credenciales académicas */}
                  {directivo.education && directivo.education.length > 0 && (
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      <span>{directivo.education[0].degree}</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedDirectivo(directivo);
                      setShowVideo(Boolean(directivo.videoId));
                    }}
                    className="inline-flex items-center text-sm text-[#2f2382] font-medium hover:text-[#473aa5] transition-colors"
                  >
                    Ver más detalles
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal para vista detallada */}
      {selectedDirectivo && (
        <div 
          className="fixed inset-0 pt-16 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedDirectivo(null);
              setShowVideo(false);
            }
          }}
        >
          {/* Botón de cierre flotante visible en todos los dispositivos */}
          <button
            onClick={() => {
              setSelectedDirectivo(null);
              setShowVideo(false);
            }}
            className="fixed top-4 right-4 z-[60] bg-[#2f2382] text-white p-3 rounded-full shadow-lg"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-white rounded-xl w-full max-w-4xl mx-auto my-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-xl md:text-2xl font-bold text-[#2f2382] truncate">
                {selectedDirectivo.firstName} {selectedDirectivo.lastName}
              </h3>
            </div>
            
            <div className="p-4 md:p-6">
              {/* Encabezado con color personalizado */}
              <div 
                className="flex items-center mb-6 p-4 rounded-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${generateColor(selectedDirectivo.id)}, ${generateColor(selectedDirectivo.id)}99)` 
                }}
              >
                <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {getInitials(selectedDirectivo.firstName, selectedDirectivo.lastName)}
                </div>
                <div className="text-white">
                  <h4 className="text-xl font-bold">{selectedDirectivo.position}</h4>
                  {selectedDirectivo.email && (
                    <div className="flex items-center mt-2">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{selectedDirectivo.email}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {showVideo && selectedDirectivo.videoId && (
                <div className="w-full aspect-w-16 aspect-h-9 mb-6">
                  <iframe 
                    src={`https://www.youtube.com/embed/${selectedDirectivo.videoId}`}
                    title="Presentación" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="rounded-lg w-full h-full"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center text-base md:text-lg font-semibold mb-3">
                    <GraduationCap className="w-5 h-5 mr-2 text-[#2f2382]" />
                    Formación Académica
                  </h4>
                  <ul className="space-y-3">
                    {selectedDirectivo.education?.map((edu, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 mt-2 bg-[#2f2382] rounded-full mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                          {edu.year && (
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {selectedDirectivo.experience && (
                  <div>
                    <h4 className="flex items-center text-base md:text-lg font-semibold mb-3">
                      <Briefcase className="w-5 h-5 mr-2 text-[#2f2382]" />
                      Experiencia Profesional
                    </h4>
                    <ul className="space-y-3">
                      {selectedDirectivo.experience.map((exp, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 mt-2 bg-[#2f2382] rounded-full mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{exp.position}</p>
                            <p className="text-sm text-gray-600">{exp.institution}</p>
                            <p className="text-sm text-gray-500">{exp.period}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {selectedDirectivo.bio && (
                <div className="mt-6">
                  <h4 className="flex items-center text-base md:text-lg font-semibold mb-3">
                    <BookOpen className="w-5 h-5 mr-2 text-[#2f2382]" />
                    Biografía
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{selectedDirectivo.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}