// src/components/InnovacionesEducativas.tsx
import React, { useState } from 'react';
import { BookOpen, Users, Laptop, Award, Activity, Heart, Building, Accessibility } from 'lucide-react';

interface Innovation {
  id: number;
  title: string;
  description: string;
  year: string;
  image: string;
  icon: React.ReactNode;
}

const InnovacionesEducativas: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'tech', name: 'Inclusión Tecnológica' },
    { id: 'infra', name: 'Infraestructura Educativa' },
    { id: 'community', name: 'Compromiso Comunitario' },
    { id: 'inclusion', name: 'Inclusividad' },
    { id: 'services', name: 'Servicios Estudiantiles' },
    { id: 'extra', name: 'Actividades Extracurriculares' },
    { id: 'pandemic', name: 'Adaptaciones COVID-19' }
  ];

  const innovations: Innovation[] = [
    {
      id: 1,
      title: "Tablets para Estudiantes de Nuevo Ingreso",
      description: "Entrega de 528 tablets a estudiantes de nuevo ingreso para el semestre 2025-10, fortaleciendo la inclusión tecnológica y facilitando el acceso equitativo a recursos digitales. Incluye un nuevo sistema de conectividad gratuita para todos los estudiantes.",
      year: "2025",
      image: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Tablets+para+Estudiantes+de+Nuevo+Ingreso.jpeg",
      icon: <Laptop />
    },
    {
      id: 2,
      title: "Laboratorios Especializados",
      description: "Adquisición de equipos para laboratorios especializados, como incubadoras BIO-GENES, neveras y otros instrumentos para el laboratorio de biología, y pipetas automáticas y centrífugas para el laboratorio de serología.",
      year: "2022-2024",
      image: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Laboratorios-Especializados.jpg",
      icon: <BookOpen />
    },
    {
      id: 3,
      title: "UASD San Juan visita tu escuela",
      description: "Programa de conversatorios con estudiantes de bachillerato en escuelas locales para informar sobre la historia de la UASD, sus carreras y el proceso de admisión, aumentando la matriculación y fortaleciendo los lazos con la comunidad.",
      year: "2022-2025",
      image: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/visita-tu-escuela.jpg",
      icon: <Users />
    },
    {
      id: 4,
      title: "Campus Accesible",
      description: "Colaboración con la Fundación Nacional de Ciegos (FUDCI) y la Asociación de Personas con Discapacidad de San Juan (APEDISAN) para abrir una unidad especializada que brinda servicios a estudiantes y personas con discapacidad.",
      year: "2022",
      image: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/colaboracion-discapacidad.jpg",
      icon: <Accessibility />
    },
    {
      id: 5,
      title: "Unidad de Consultoría Jurídica",
      description: "Inauguración de una unidad de consultoría jurídica en el recinto para ofrecer asesoramiento legal a estudiantes y la comunidad, contribuyendo a su bienestar general.",
      year: "2020",
      image: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/inauguracion-Unidad-de-Consultor%C3%ADa-Jur%C3%ADdica.jpg",
      icon: <Award />
    },
    {
      id: 6,
      title: "Relanzamiento del Deporte Universitario",
      description: "Encuentro con entrenadores deportivos para relanzar el deporte universitario tras la pandemia, comprometiendo recursos para entrenamientos y participación en juegos como los Tony Barreiro.",
      year: "2022",
      image: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Deporte-universitario-tras-la-pandemia.jpeg",
      icon: <Activity />
    },
    {
      id: 7,
      title: "Aprendizaje Virtual durante COVID-19",
      description: "Transición a plataformas de aprendizaje virtual durante la pandemia, asegurando la continuidad educativa mediante procesos de evaluación en línea y apoyo a docentes.",
      year: "2020-2023",
      image: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/evaluaci%C3%B3n+de+tesis.jpg",
      icon: <Heart />
    },
    {
      id: 8,
      title: "Mejoras en Infraestructura",
      description: "Renovación continua de las instalaciones del campus para proporcionar un entorno de aprendizaje óptimo, con especial atención a las necesidades de los diversos programas académicos.",
      year: "2018-2025",
      image: "https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-53.jpg",
      icon: <Building />
    }
  ];

  const filteredInnovations = activeCategory && activeCategory !== 'all'
    ? innovations.filter(innovation => {
        switch(activeCategory) {
          case 'tech': return [1].includes(innovation.id);
          case 'infra': return [2, 8].includes(innovation.id);
          case 'inclusion': return [4].includes(innovation.id);
          case 'services': return [5].includes(innovation.id);
          case 'extra': return [6].includes(innovation.id);
          case 'pandemic': return [7].includes(innovation.id);
          default: return true;
        }
      })
    : innovations;

  return (
    <section className="innovaciones-educativas pt-44 pb-16 bg-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-16">
          <h1 className="text-6xl font-bold mb-16">
            Innovaciones Educativas
          </h1>
          
          {/* Filter Tabs */}
          <div className="bg-white p-5 md:p-10 my-12 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group flex flex-col items-center text-center py-8 px-4 relative ${
                    index < categories.length - 1 ? 'border-r border-gray-200' : ''
                  }`}
                >
                  <div className="text-lg font-semibold text-gray-700 group-hover:text-[#003087] transition-colors duration-300">
                    {category.name}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <span className="arrow text-[#003087] text-[30px] transform transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </div>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {category.id}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Bauhaus-inspired decorative elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-blue-800 -mt-4 -ml-4"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-red-800 -mb-4 -mr-4"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-yellow-400 -mb-4 -ml-4"></div>
          </div>
        </div>
        
        {/* Innovations in alternating layout */}
        <div className="space-y-20">
          {filteredInnovations.map((innovation, index) => (
            <div 
              key={innovation.id} 
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 py-10`}
            >
              {/* Text content */}
              <div className="md:w-1/2 px-4">
                <div className="mb-4">
                  <span className="inline-block bg-blue-800 text-white text-sm px-5 py-1 mb-3">{innovation.year}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-890">{innovation.icon}</span>
                    <h2 className="text-4xl font-bold">{innovation.title}</h2>
                  </div>
                </div>
                <div className="pl-4 border-l-4 border-red-800">
                  <p className="text-gray-700">{innovation.description}</p>
                </div>
                <div className="mt-6">
                  <button className="flex items-center gap-2 text-blue-800 hover:text-blue-600 transition-colors group">
                    <span>Más información</span>
                    <span className="transform transition-transform duration-300 group-hover:translate-x-2">→</span>
                  </button>
                </div>
              </div>
              
              {/* Image */}
<div className="md:w-2/3 relative">
  <img 
    src={innovation.image} 
    alt={innovation.title} 
    className="w-full aspect-[3/3] object-cover object-center relative z-0"
  />
</div>
            </div>
          ))}
        </div>

        {/* Timeline Section */}
        <div className="mt-20 relative">
          <h2 className="text-3xl font-bold text-center mb-12">Cronología de Innovaciones</h2>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-red-800"></div>
          <div className="absolute top-5 right-20 w-6 h-6 bg-blue-800"></div>
          <div className="absolute top-12 right-10 w-8 h-8 bg-yellow-400 transform rotate-45"></div>
          
          <div className="bauhaus-timeline relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300"></div>
            
            {/* Timeline items */}
            <div className="timeline-items space-y-20">
              <div className="timeline-item relative">
                <div className="flex justify-between items-center">
                  <div className="w-5/12 pr-8 text-right">
                    <h3 className="text-xl font-bold">2018</h3>
                    <p className="mt-2">Dr. Carlos Manuel Sánchez de Oleo asume como director del Recinto San Juan.</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-red-800 z-10 shadow-md"></div>
                  <div className="w-5/12 pl-8">
                    <h3 className="text-xl font-bold">2020</h3>
                    <p className="mt-2">Inauguración de la Unidad de Consultoría Jurídica y adaptación a la educación virtual durante la pandemia.</p>
                  </div>
                </div>
              </div>
              
              <div className="timeline-item relative">
                <div className="flex justify-between items-center">
                  <div className="w-5/12 pr-8 text-right">
                    <h3 className="text-xl font-bold">2022</h3>
                    <p className="mt-2">Relanzamiento del deporte universitario y apertura de unidades para personas con discapacidad.</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-800 z-10 shadow-md"></div>
                  <div className="w-5/12 pl-8">
                    <h3 className="text-xl font-bold">2024</h3>
                    <p className="mt-2">Equipamiento de laboratorios especializados con tecnología de vanguardia.</p>
                  </div>
                </div>
              </div>
              
              <div className="timeline-item relative">
                <div className="flex justify-between items-center">
                  <div className="w-5/12 pr-8 text-right">
                    <h3 className="text-xl font-bold">2025</h3>
                    <p className="mt-2">Programa de inclusión digital con entrega de tablets y conectividad gratuita para estudiantes.</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 transform rotate-45 z-10 shadow-md"></div>
                  <div className="w-5/12 pl-8">
                    <h3 className="text-xl font-bold">Visión Futura</h3>
                    <p className="mt-2">Continuación del compromiso con la excelencia e innovación educativa en la región.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mt-20 bg-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-lg relative overflow-hidden">
          {/* Bauhaus-inspired decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-red-800"></div>
          <div className="absolute top-2 left-0 w-full h-1 bg-blue-800"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-10"></div>
          
          <div className="md:w-1/3">
            <div className="w-88 h-88 mx-auto overflow-hidden">
              <img
                src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/Carlos+Manuel+Sa%CC%81nchez+De+O%CC%81leo.png"
                alt="Dr. Carlos Manuel Sánchez de Oleo"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-red-800 pl-4">
              Dr. Carlos Manuel Sánchez de Oleo
            </h2>
            <p className="text-gray-600 mb-4">
              Nacido en El Cercado, República Dominicana, el Dr. Sánchez de Oleo cuenta con doctorados y maestrías de la Universidad Politécnica de Valencia, España. Ha sido profesor de la UASD desde 2005 y director del Recinto San Juan de la Maguana desde 2018.
            </p>
            <p className="text-gray-600">
              Su sólido background en matemáticas y experiencia en investigación, incluyendo una pasantía en el Laboratorio de Física de Partículas CERN en Suiza, han contribuido a su visión innovadora para el desarrollo educativo del recinto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovacionesEducativas;