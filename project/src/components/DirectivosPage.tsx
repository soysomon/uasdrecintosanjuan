import React, { useState } from 'react';
import { Mail, Phone, ChevronRight, X, Award, GraduationCap, Briefcase, BookOpen } from 'lucide-react';

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
  imageUrl: string;
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
    imageUrl: 'https://i.ibb.co/XfdtDZK0/carlos-manuel.png',
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
    imageUrl: 'https://i.ibb.co/fGL4dX6M/Foto-Bienvenido-Romero-scaled-e1604508148491-526x526.jpg',
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
    imageUrl: 'https://i.ibb.co/m5nBVh74/Leonor-Taveras-Mateo-e1617731505300-263x263.png',
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
    imageUrl: 'https://i.ibb.co/zWwg6Q9s/Screen-Shot-2021-11-23-at-8-53-17-AM-e1637672177324-526x526.png',
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
    imageUrl: 'https://i.ibb.co/jZvmXfvB/Rube-n-Rami-rez-Tavera-scaled-e1632748923442-526x526.jpg',
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
    imageUrl: 'https://i.ibb.co/NhnFZhW/Pablo-Modesto-Espinosa-Lebron-e1611776599670-526x526.png',
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
    imageUrl: 'https://i.ibb.co/rjwyTXh/Screen-Shot-2021-11-05-at-12-14-35-PM-e1636128934499-526x526.png',
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
    imageUrl: 'https://i.ibb.co/zVPMtcdv/Efrai-n-Guzma-n-Nova-scaled-e1623767040335-526x526.jpg',
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
    imageUrl: 'https://i.ibb.co/cKkXQRbF/Untitled-1-526x526.jpg',
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
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    education: [
      { degree: 'Licenciatura en Administración', institution: 'UASD' }
    ]
  }
];

export function DirectivosPage() {
  const [selectedDirectivo, setSelectedDirectivo] = useState<DirectivoProfile | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const VideoPlayer = ({ videoId }: { videoId: string }) => {
    return (
      <div className="aspect-w-16 aspect-h-9 mb-8">
        <iframe 
          width="847" 
          height="450" 
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Presentación" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="rounded-lg w-full h-full"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Bauhaus-inspired design */}
      <div className="relative bg-[#2f2382] py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f2382]/95 to-[#2f2382]/70" />
          {/* Bauhaus-inspired geometric shapes */}
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

      {/* Featured Director - Apple-style hero */}
      <div className="relative -mt-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative h-[500px]">
                <img
                  src={directivos[0].imageUrl}
                  alt={`${directivos[0].firstName} ${directivos[0].lastName}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
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

      {/* Directory Grid with Bauhaus-inspired cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {directivos.slice(1).map((directivo) => (
            <div
              key={directivo.id}
              className="group relative bg-white rounded-lg shadow-xl overflow-hidden border border-[#2f2382]/10 hover:border-[#2f2382]/30 transition-all duration-300"
            >
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={directivo.imageUrl}
                  alt={`${directivo.firstName} ${directivo.lastName}`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  {directivo.firstName} {directivo.lastName}
                </h3>
                <p className="text-sm text-gray-200 mb-4">{directivo.position}</p>
                <button
                  onClick={() => {
                    setSelectedDirectivo(directivo);
                    setShowVideo(true);
                  }}
                  className="inline-flex items-center text-sm text-white hover:text-[#2f2382] transition-colors"
                >
                  Ver más detalles
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for detailed view */}
      {selectedDirectivo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-[#2f2382]">
                {selectedDirectivo.firstName} {selectedDirectivo.lastName}
              </h3>
              <button
                onClick={() => {
                  setSelectedDirectivo(null);
                  setShowVideo(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {showVideo && selectedDirectivo.videoId && (
                <VideoPlayer videoId={selectedDirectivo.videoId} />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="flex items-center text-lg font-semibold mb-4">
                    <GraduationCap className="w-5 h-5 mr-2 text-[#2f2382]" />
                    Formación Académica
                  </h4>
                  <ul className="space-y-3">
                    {selectedDirectivo.education?.map((edu, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 mt-2 bg-[#2f2382] rounded-full mr-2" />
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
                {selectedDirectivo.id === 'carlos-sanchez' && selectedDirectivo.experience && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold mb-4">
                      <Briefcase className="w-5 h-5 mr-2 text-[#2f2382]" />
                      Experiencia Profesional
                    </h4>
                    <ul className="space-y-3">
                      {selectedDirectivo.experience.map((exp, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 mt-2 bg-[#2f2382] rounded-full mr-2" />
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
                <div className="mt-8">
                  <h4 className="flex items-center text-lg font-semibold mb-4">
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