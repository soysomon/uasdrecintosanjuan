import React, { useEffect, useRef } from 'react';
import { ChevronRight, GraduationCap, Briefcase, BookOpen } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registramos el plugin de ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const headerRef = useRef<HTMLDivElement>(null); // Explicitly typed
  const rectorRef = useRef<HTMLDivElement>(null); // Explicitly typed
  const directivosRef = useRef<HTMLDivElement>(null); // Explicitly typed to fix the error

  useEffect(() => {
    // Animación de entrada para el header
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    // Animación para la sección del rector
    gsap.from(rectorRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: "power3.out"
    });

    // Animación para los directivos
    if (directivosRef.current) {
      const directivoCards = directivosRef.current.querySelectorAll('.directivo-card'); // This line now works with proper typing
      
      gsap.from(directivoCards, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: directivosRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header con estilo minimalista inspirado en Heidelberg */}
      <div ref={headerRef} className="relative bg-[#2f2382] py-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="block text-gray-200 text-sm tracking-widest uppercase mb-2">Universidad Autónoma de Santo Domingo</span>
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
              Consejo Directivo
            </h1>
            <div className="w-16 h-1 bg-white mx-auto mt-8"></div>
          </div>
        </div>
      </div>

      {/* Sección del Rector - Estilo Heidelberg */}
      <div ref={rectorRef} className="max-w-6xl mx-auto mt-16 mb-24 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src={directivos[0].imageUrl}
              alt={`${directivos[0].firstName} ${directivos[0].lastName}`}
              className="w-full h-auto"
            />
          </div>
          <div>
            <h2 className="text-xl font-normal tracking-widest text-[#2f2382] uppercase mb-2">Director General</h2>
            <h3 className="text-3xl sm:text-4xl font-light text-gray-800 mb-6">
              {directivos[0].firstName} {directivos[0].lastName}
            </h3>
            <div className="w-16 h-0.5 bg-[#2f2382] mb-6"></div>
            <p className="text-gray-600 mb-6 leading-relaxed">{directivos[0].bio}</p>
            
            <div className="mb-8">
              <h4 className="text-lg font-normal text-[#2f2382] mb-4">Formación Académica</h4>
              <ul className="space-y-3">
                {directivos[0].education?.map((edu, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1 h-1 mt-2 bg-[#2f2382] mr-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-normal text-gray-800">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <a 
  href="/director/despacho"
  className="inline-block border border-[#2f2382] text-[#2f2382] px-5 py-2 transition-colors hover:bg-[#2f2382] hover:text-white mt-2"
>
  Conocer más sobre el director
</a>
          </div>
        </div>
      </div>

      {/* Directivos - Estilo minimalista Heidelberg */}
      <div className="bg-gray-50 py-24">
        <div ref={directivosRef} className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-800">Equipo Directivo</h2>
            <div className="w-16 h-0.5 bg-[#2f2382] mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {directivos.slice(1).map((directivo) => (
              <div 
                key={directivo.id} 
                className="directivo-card bg-white border-t-2 border-[#2f2382] shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-normal text-gray-800 mb-1">
                  {directivo.firstName} {directivo.lastName}
                </h3>
                <p className="text-[#2f2382] text-sm font-medium mb-4">{directivo.position}</p>
                
                {directivo.education && directivo.education.length > 0 && (
                  <div className="mt-4 mb-2">
                    <p className="text-sm text-gray-800 font-medium">
                      {directivo.education[0].degree}
                    </p>
                    <p className="text-xs text-gray-600">
                      {directivo.education[0].institution}
                    </p>
                  </div>
                )}
                
                {directivo.education && directivo.education.length > 1 && (
                  <p className="text-xs text-gray-500 italic">
                    {directivo.education.length - 1} título{directivo.education.length > 2 ? 's' : ''} adicional{directivo.education.length > 2 ? 'es' : ''}
                  </p>
                )}
                
                {directivo.videoId && (
                  <div className="mt-4">
                    <a 
                      href={`https://www.youtube.com/watch?v=${directivo.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#2f2382] hover:underline inline-flex items-center"
                    >
                      Ver presentación
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}