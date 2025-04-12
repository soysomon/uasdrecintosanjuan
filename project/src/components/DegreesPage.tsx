import React, { useState } from 'react';
import { motion } from 'framer-motion';
import humanidadesLogo from '../img/logos-facultades/facultad-humanidades.svg';
import educacionLogo from '../img/logos-facultades/facultad-educacion.svg';
import economiaLogo from '../img/logos-facultades/facultad-economia.svg';
import juridicasLogo from '../img/logos-facultades/facultad-juridicas.svg';
import saludLogo from '../img/logos-facultades/facultad-medicina.svg';
import cienciasLogo from '../img/logos-facultades/facultad-ciencias.svg';
import agronomicasLogo from '../img/logos-facultades/facultad-agronomia.svg';
import ingenieriaLogo from '../img/logos-facultades/facultad-ingenieria.svg';

// Interfaces
interface Career {
  id: string;
  name: string;
  duration: string;
  credits: number;
  description: string;
  imageUrl: string;
}

interface Faculty {
  id: string;
  name: string;
  color: string;
  logoUrl: string;
  careers: Career[];
}

// Datos de las facultades y carreras
const facultiesData: Faculty[] = [
  {
    id: 'humanidades',
    name: 'Humanidades',
    color: '#7b56a4',
    logoUrl: humanidadesLogo,
    careers: [
      {
        id: 'letras',
        name: 'Licenciatura en Letras',
        duration: '4 años',
        credits: 180,
        description: 'Formación integral en el estudio de la literatura, lingüística y teoría de la comunicación.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Letras.jpg',
      },
      {
        id: 'comunicacion-social',
        name: 'Licenciatura en Comunicación Social (Mención Periodismo)',
        duration: '4 años',
        credits: 195,
        description: 'Desarrollo de competencias periodísticas y comunicacionales para medios tradicionales y digitales.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Comunicaci%C3%B3n+Social.jpg',
      },
    ],
  },
  {
    id: 'educacion',
    name: 'Ciencias de la Educación',
    color: '#911422',
    logoUrl: educacionLogo,
    careers: [
      {
        id: 'educacion-basica',
        name: 'Licenciatura en Educación Básica',
        duration: '4 años',
        credits: 175,
        description: 'Formación de docentes para la enseñanza en niveles básicos del sistema educativo nacional.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Educaci%C3%B3n+B%C3%A1sica.jpg',
      },
      {
        id: 'educacion-fisica',
        name: 'Licenciatura en Educación Física',
        duration: '4 años',
        credits: 170,
        description: 'Preparación para la enseñanza de actividades físicas, deportivas y recreativas.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Educaci%C3%B3n+F%C3%ADsica.jpg',
      },
      {
        id: 'educacion-inicial',
        name: 'Licenciatura en Educación Inicial',
        duration: '4 años',
        credits: 175,
        description: 'Formación para la educación en etapas tempranas del desarrollo infantil.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Educaci%C3%B3n+Inicial.jpg',
      },
      {
        id: 'orientacion-academica',
        name: 'Licenciatura en Educación (Mención Orientación Académica)',
        duration: '4 años',
        credits: 180,
        description: 'Desarrollo de competencias para guiar el proceso de aprendizaje y desarrollo personal del estudiante.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Educaci%C3%B3n+(Menci%C3%B3n+Orientaci%C3%B3n+Acad%C3%A9mica).jpg',
      },
    ],
  },
  {
    id: 'economicas',
    name: 'Ciencias Económicas y Sociales',
    color: '#f47b20',
    logoUrl: economiaLogo,
    careers: [
      {
        id: 'administracion',
        name: 'Licenciatura en Administración de Empresas',
        duration: '4 años',
        credits: 190,
        description: 'Formación en gestión y dirección empresarial para el desarrollo socioeconómico.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Administraci%C3%B3n+de+Empresas.jpg',
      },
      {
        id: 'mercadotecnia',
        name: 'Licenciatura en Mercadotecnia',
        duration: '4 años',
        credits: 185,
        description: 'Estudio de estrategias para la comercialización de productos y servicios en diversos mercados.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Mercadotecnia.jpg',
      },
      {
        id: 'ciencias-politicas',
        name: 'Licenciatura en Ciencias Políticas',
        duration: '4 años',
        credits: 195,
        description: 'Análisis de sistemas políticos, gobernanza y relaciones de poder en la sociedad.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Ciencias+Pol%C3%ADticas.jpg',
      },
      {
        id: 'contabilidad',
        name: 'Licenciatura en Contabilidad',
        duration: '4 años',
        credits: 190,
        description: 'Formación en el registro, clasificación y análisis de información financiera y contable.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Contabilidad.jpg',
      },
    ],
  },
  {
    id: 'juridicas',
    name: 'Ciencias Jurídicas y Políticas',
    color: '#ff1c07',
    logoUrl: juridicasLogo,
    careers: [
      {
        id: 'derecho',
        name: 'Licenciatura en Derecho',
        duration: '5 años',
        credits: 220,
        description: 'Formación jurídica integral para el ejercicio profesional en diversas ramas del derecho.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ciencias+Jur%C3%ADdicas+y+Pol%C3%ADticas.jpg',
      },
    ],
  },
  {
    id: 'salud',
    name: 'Ciencias de la Salud',
    color: '#f3fa33',
    logoUrl: saludLogo,
    careers: [
      {
        id: 'enfermeria',
        name: 'Licenciatura en Enfermería',
        duration: '4 años',
        credits: 200,
        description: 'Formación para el cuidado de la salud y atención integral de pacientes.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Enfermer%C3%ADa.jpg',
      },
      {
        id: 'bioanalisis',
        name: 'Licenciatura en Bioanálisis',
        duration: '4 años',
        credits: 210,
        description: 'Preparación para el análisis clínico y diagnóstico de laboratorio.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Bioan%C3%A1lisis.jpg',
      },
      {
        id: 'medicina',
        name: 'Doctor en Medicina (Premédica-Internado)',
        duration: '6 años',
        credits: 320,
        description: 'Formación en ciencias médicas para la atención y cuidado de la salud poblacional.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Doctor+en+Medicina+(Prem%C3%A9dica-Internado).jpg',
      },
      {
        id: 'psicologia-clinica',
        name: 'Licenciatura en Psicología Clínica',
        duration: '5 años',
        credits: 200,
        description: 'Estudio del comportamiento humano orientado a la intervención clínica y terapéutica.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Psicolog%C3%ADa+Cl%C3%ADnica.jpg',
      },
      {
        id: 'psicologia-escolar',
        name: 'Licenciatura en Psicología Escolar',
        duration: '5 años',
        credits: 195,
        description: 'Especialización en comportamiento y aprendizaje en entornos educativos.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Psicolog%C3%ADa+Escolar.jpg',
      },
    ],
  },
  {
    id: 'ciencias',
    name: 'Ciencias',
    color: '#00a3e6',
    logoUrl: cienciasLogo,
    careers: [
      {
        id: 'informatica',
        name: 'Licenciatura en Informática',
        duration: '4 años',
        credits: 190,
        description: 'Formación en tecnologías de la información, desarrollo de software y sistemas informáticos.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Inform%C3%A1tica.jpg',
      },
    ],
  },
  {
    id: 'agronomicas',
    name: 'Ciencias Agronómicas y Veterinarias',
    color: '#00a651',
    logoUrl: agronomicasLogo,
    careers: [
      {
        id: 'zootecnia',
        name: 'Ingeniería Zootecnia',
        duration: '5 años',
        credits: 210,
        description: 'Estudio de la producción animal y mejoramiento genético para la industria agropecuaria.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ingenier%C3%ADa+Zootecnia.jpg',
      },
      {
        id: 'agronomia-suelos',
        name: 'Ingeniería Agronómica (Suelos y Riego)',
        duration: '5 años',
        credits: 215,
        description: 'Especialización en manejo de suelos y sistemas de riego para la producción agrícola.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ingenier%C3%ADa+Agron%C3%B3mica+(Suelos+y+Riego).jpg',
      },
      {
        id: 'agronomia-cultivos',
        name: 'Ingeniería Agronómica (Producción de Cultivos)',
        duration: '5 años',
        credits: 215,
        description: 'Formación en técnicas de cultivo, cosecha y manejo post-cosecha de productos agrícolas.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ingenier%C3%ADa+Agron%C3%B3mica+(Producci%C3%B3n+de+Cultivos).jpg',
      },
      {
        id: 'agronomia-desarrollo',
        name: 'Ingeniería Agronómica (Desarrollo Agrícola)',
        duration: '5 años',
        credits: 215,
        description: 'Enfoque en desarrollo rural y sistemas de producción sostenibles para comunidades agrícolas.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ingenier%C3%ADa+Agron%C3%B3mica+(Desarrollo+Agr%C3%ADcola).jpg',
      },
    ],
  },
  {
    id: 'ingenieria',
    name: 'Ingeniería y Arquitectura',
    color: '#2f5ba7',
    logoUrl: ingenieriaLogo,
    careers: [
      {
        id: 'civil',
        name: 'Ingeniería Civil',
        duration: '5 años',
        credits: 225,
        description: 'Formación en diseño, construcción y mantenimiento de infraestructuras y obras civiles.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ingenier%C3%ADa+Civil.jpg',
      },
    ],
  },
];

// Componente para mostrar una carrera individual
const CareerCard: React.FC<{ career: Career; facultyColor: string }> = ({ career, facultyColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-transform hover:scale-102 hover:shadow-lg">
      <div className="h-40 overflow-hidden">
        <img 
          src={career.imageUrl} 
          alt={`Imagen representativa de ${career.name}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2" style={{ color: facultyColor }}>{career.name}</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{career.duration}</span>
          <span>{career.credits} créditos</span>
        </div>
        <p className="text-gray-700 text-sm mt-auto">{career.description}</p>
      </div>
    </div>
  );
};

// Componente para mostrar una facultad y sus carreras
const FacultySection: React.FC<{ faculty: Faculty; isOpen: boolean; toggleSection: () => void }> = ({ 
  faculty, 
  isOpen, 
  toggleSection 
}) => {
  return (
    <section className="mb-10">
      <div 
        className="cursor-pointer relative"
        onClick={toggleSection}
      >
        {/* Logo que se sobrepone en la parte superior */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white rounded-full p-1 shadow-md">
            <img 
              src={faculty.logoUrl} 
              alt={`Logo de facultad de ${faculty.name}`} 
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>
        
        {/* Barra de color con patrón distintivo */}
        <div 
          className="pt-12 pb-6 px-6 flex flex-col items-center justify-center overflow-hidden relative"
          style={{ backgroundColor: faculty.color }}
        >
          {/* Elementos decorativos del fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-0 top-0 w-40 h-40 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute right-0 bottom-0 w-60 h-60 rounded-full bg-white transform translate-x-1/4 translate-y-1/4"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mt-2">FACULTAD DE {faculty.name.toUpperCase()}</h2>
          
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.careers.map(career => (
            <CareerCard 
              key={career.id} 
              career={career} 
              facultyColor={faculty.color} 
            />
          ))}
        </div>
      )}
    </section>
  );
};

// Componente principal de la página
const DegreesPage: React.FC = () => {
  // Estado para controlar qué facultades están expandidas
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    facultiesData.reduce((acc, faculty) => ({ ...acc, [faculty.id]: false }), {})
  );

  // Función para alternar la apertura de una sección
  const toggleSection = (facultyId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [facultyId]: !prev[facultyId]
    }));
  };

  // Color principal: Azul constitucional
  const primaryColor = '#003087';
  // Color secundario para el hero (un azul más profundo pero complementario)
  const heroColor = '#001F54';

  return (
    <div className="min-h-screen bg-white">
      {/* Espaciador para el nav */}
      <div className="pt-24 md:pt-28">
        {/* Hero Section con motion figures - Adaptado de MisionVisionPage */}
        <div className="relative h-[60vh] bg-[#001F54] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/grado.jpg"
              alt="UASD Carreras de Grado"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#001F54]/70 to-[#001F54]/90" />
          
          {/* Animated geometric shapes */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/4 left-0 w-96 h-96 bg-white/10"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full"
          />
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: -45 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="absolute top-0 right-1/3 w-64 h-64 bg-white/10"
          />

          <div className="relative z-10 max-w-6xl mx-auto h-full flex items-center">
            <div className="px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <h1 className="text-5xl font-light tracking-tight text-white leading-tight mb-6">
                  Carreras de Grado
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-xl font-light text-white">
                  Formando profesionales que transforman la región sur
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content - Ahora está debajo del hero */}
        <div className="container mx-auto px-4 py-16">
          <header className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Oferta Académica</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre las carreras de pregrado ofrecidas por el Recinto UASD San Juan, organizadas por facultades.
            </p>
          </header>

          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar carrera..."
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          <main>
            {facultiesData.map(faculty => (
              <FacultySection
                key={faculty.id}
                faculty={faculty}
                isOpen={openSections[faculty.id]}
                toggleSection={() => toggleSection(faculty.id)}
              />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DegreesPage;