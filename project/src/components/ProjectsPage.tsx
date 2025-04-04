import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, Building2, GraduationCap, FlaskRound as Flask, ScrollText, ExternalLink, ChevronRight, Star, X } from 'lucide-react';

interface Project {
  title: string;
  description?: string;
  link?: string;
  status?: string;
  date?: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  projects: Project[];
}

const sections: Section[] = [
  {
    id: 'academic',
    title: 'Recursos Académicos',
    icon: <BookOpen className="w-6 h-6" />,
    description: 'Documentación y recursos para el desarrollo académico',
    projects: [
      { title: 'Biografías de docentes', link: '#', date: '2024' },
      { title: 'Conoce tus Docentes - Galería multimedia', link: '#', date: '2024' },
      { title: 'Diplomado en Cosmiatría Especializada', link: '#', date: '2024' },
    ]
  },
  {
    id: 'feasibility',
    title: 'Estudios de Factibilidad',
    icon: <FileText className="w-6 h-6" />,
    description: 'Análisis para nuevos programas académicos',
    projects: [
      { title: 'Licenciatura en Historia', link: '#', status: 'En proceso' },
      { title: 'Licenciatura en Música', status: 'Planificado' },
      { title: 'Licenciatura en Trabajo Social', status: 'En revisión' },
      { title: 'Licenciatura en Sociología', status: 'Planificado' },
      { title: 'Licenciatura en Biología', status: 'En proceso' },
    ]
  },
  {
    id: 'institutional',
    title: 'Documentos Institucionales',
    icon: <ScrollText className="w-6 h-6" />,
    description: 'Documentación oficial y reportes institucionales',
    projects: [
      { title: 'Informe de actividades 2018-2022', link: '#', date: '2022' },
      { title: 'Manual de Procedimientos UCOTESIS', link: '#', date: '2023' },
      { title: 'Plan Estratégico 2022-2026', link: '#', date: '2022' },
      { title: 'Plan Operativo 2023', link: '#', date: '2023' },
    ]
  },
  {
    id: 'expansion',
    title: 'Proyectos de Expansión',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Iniciativas de crecimiento institucional',
    projects: [
      { title: 'SubCentro UASD en Elías Piña', status: 'En ejecución' },
      { title: 'Comedor Universitario', status: 'Planificado' },
      { title: 'Programa de Premédica', status: 'Aprobado' },
      { title: 'Licenciatura en Matemáticas', status: 'En revisión' },
    ]
  },
  {
    id: 'specialized',
    title: 'Proyectos Especializados',
    icon: <Flask className="w-6 h-6" />,
    description: 'Proyectos técnicos y de investigación',
    projects: [
      { title: 'Arquitectura', status: 'En desarrollo' },
      { title: 'Aula Modelo Nivel Inicial', status: 'Completado' },
      { title: 'Liceo Experimental', status: 'En planificación' },
      { title: 'Laboratorio de suelo', status: 'En ejecución' },
      { title: 'Cultivos Experimentales', status: 'Activo' },
    ]
  },
  {
    id: 'resolutions',
    title: 'Resoluciones Oficiales',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'Documentos normativos y resoluciones',
    projects: [
      { title: 'Cambio de Centro a Recinto (No. CM-2020-004)', link: '#', date: '2020' },
      { title: 'Oficinas UASD Elias Piña', link: '#', date: '2021' },
      { title: 'Apertura Pre-Médica (No. 2022-137)', link: '#', date: '2022' },
      { title: 'Apertura Ciencias Políticas (No. 036-2022)', link: '#', date: '2022' },
      { title: 'Apertura Ingeniería Civil (No. 073-2022)', link: '#', date: '2022' },
      { title: 'Apertura Psicología Escolar (No. 2022-410)', link: '#', date: '2022' },
      { title: 'Apertura Licenciatura en Letras (No. 2021-106)', link: '#', date: '2021' },
    ]
  }
];

export function ProjectsPage() {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Hero Section with Bauhaus-inspired design */}
      <div className="relative bg-white py-24">
        <div className="absolute inset-0">
          {/* Geometric Patterns */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#003087]/5 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#003087]/5 transform translate-x-1/3 translate-y-1/3 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#003087]/5 transform -translate-y-1/2 rotate-12" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <br></br>
            <br></br>
            <h1 className="text-[48px] font-bold tracking-tight text-[#000000] mb-6 font-sf-pro">
              Proyectos y Resoluciones
            </h1>
            <p className="text-[20px] text-[#666666] max-w-3xl mx-auto font-sf-pro">
              Iniciativas desarrolladas bajo la dirección del Dr. Carlos Manuel Sánchez De Óleo desde 2018
            </p>
          </motion.div>
        </div>
      </div>

      {/* Featured Achievement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative bg-white rounded-2xl shadow-lg p-8 border border-[#003087]/10"
        >
          <div className="absolute -top-4 -left-4">
            <Star className="w-8 h-8 text-[#003087]" />
          </div>
          <div className="ml-4">
            <h2 className="text-[24px] font-bold text-[#000000] mb-2 font-sf-pro">
              Logro Destacado
            </h2>
            <p className="text-[18px] text-[#666666] font-sf-pro">
              Elevación de categoría de UASD Centro San Juan a Recinto - Un hito histórico para el desarrollo educativo de la región sur.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedSection(section)}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#003087]/10 hover:border-[#003087]/30 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-[#003087]/5 rounded-xl">
                    {section.icon}
                  </div>
                  <h3 className="text-[20px] font-bold text-[#000000] ml-4 font-sf-pro">
                    {section.title}
                  </h3>
                </div>

                <p className="text-[16px] text-[#666666] mb-6 font-sf-pro">
                  {section.description}
                </p>

                <ul className="space-y-3">
                  {section.projects.slice(0, 3).map((project) => (
                    <li
                      key={project.title}
                      className="flex items-center text-[14px] text-[#666666] font-sf-pro"
                      onMouseEnter={() => setHoveredProject(project.title)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      <ChevronRight 
                        className={`w-4 h-4 mr-2 transition-transform duration-300 ${
                          hoveredProject === project.title ? 'translate-x-1' : ''
                        }`}
                      />
                      {project.title}
                    </li>
                  ))}
                </ul>

                {section.projects.length > 3 && (
                  <p className="mt-4 text-[14px] text-[#003087] font-sf-pro">
                    +{section.projects.length - 3} más
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedSection(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-2xl w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedSection(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-[#666666]" />
              </button>

              <div className="flex items-center mb-6">
                <div className="p-3 bg-[#003087]/5 rounded-xl">
                  {selectedSection.icon}
                </div>
                <h3 className="text-[24px] font-bold text-[#000000] ml-4 font-sf-pro">
                  {selectedSection.title}
                </h3>
              </div>

              <p className="text-[16px] text-[#666666] mb-8 font-sf-pro">
                {selectedSection.description}
              </p>

              <div className="space-y-4">
                {selectedSection.projects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h4 className="text-[16px] font-semibold text-[#000000] font-sf-pro">
                        {project.title}
                      </h4>
                      {project.status && (
                        <p className="text-[14px] text-[#666666] font-sf-pro">
                          Estado: {project.status}
                        </p>
                      )}
                      {project.date && (
                        <p className="text-[14px] text-[#666666] font-sf-pro">
                          {project.date}
                        </p>
                      )}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        className="flex items-center text-[#003087] hover:text-[#003087]/80 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}