import React, { useState } from 'react';
import { ExternalLink, MapPin, ChevronRight } from 'lucide-react';
import '../UnidadesPage.css';

interface Unit {
  id: string;
  name: string;
  description: string;
  location: string;
  category: 'academic' | 'administrative' | 'student-services' | 'research';
}

const units: Unit[] = [
  {
    id: 'direccion-general',
    name: 'Dirección General',
    description: 'Dirección general del recinto universitario',
    location: 'Edificio Administrativo, 3er Nivel',
    category: 'administrative',
    rector: 'Dr. Carlos Manuel Sánchez De Óleo' 
  } as Unit & { rector: string },
  {
    id: 'admisiones',
    name: 'Admisiones',
    description: 'Gestión de procesos de admisión y nuevo ingreso de estudiantes',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'student-services'
  },
  {
    id: 'almacen',
    name: 'Almacén',
    description: 'Administración de inventario y suministros',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'administrative'
  },
  {
    id: 'sub-direccion-administrativa',
    name: 'Sub-Dirección Administrativa',
    description: 'Gestión de procesos administrativos del recinto',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative'
  },
  {
    id: 'sub-direccion-academica',
    name: 'Sub-Dirección Académica',
    description: 'Supervisión y gestión de procesos académicos',
    location: 'Edificio Académico, 2do Nivel',
    category: 'academic'
  },
  {
    id: 'archivo',
    name: 'Archivo',
    description: 'Gestión y conservación de documentos históricos y administrativos',
    location: 'Edificio Administrativo, Sótano',
    category: 'administrative'
  },
  {
    id: 'auditoria',
    name: 'Auditoría',
    description: 'Control y supervisión de procesos financieros',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative'
  },
  {
    id: 'bedeleria',
    name: 'Bedelería',
    description: 'Control docente y gestión de aulas',
    location: 'Edificio Académico, 1er Nivel',
    category: 'academic'
  },
  {
    id: 'biblioteca',
    name: 'Biblioteca',
    description: 'Servicios bibliotecarios y recursos de investigación',
    location: 'Edificio de Biblioteca',
    category: 'academic'
  },
  {
    id: 'bienestar-estudiantil',
    name: 'Bienestar Estudiantil',
    description: 'Servicios de apoyo y asistencia para el bienestar del estudiante',
    location: 'Edificio de Servicios Estudiantiles, 2do Nivel',
    category: 'student-services'
  },
  {
    id: 'comedor',
    name: 'Comedor',
    description: 'Servicios de alimentación para la comunidad universitaria',
    location: 'Edificio del Comedor',
    category: 'student-services'
  },
  {
    id: 'caja-general',
    name: 'Caja General',
    description: 'Gestión de pagos y transacciones financieras',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative'
  },
  {
    id: 'compras',
    name: 'Compras',
    description: 'Adquisición de bienes y servicios para la universidad',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative'
  },
  {
    id: 'consultoria-juridica',
    name: 'Consultoría Jurídica',
    description: 'Asesoría legal y representación jurídica de la institución',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative'
  },
  {
    id: 'consultorio-medico',
    name: 'Consultorio Médico',
    description: 'Servicios de salud y atención médica',
    location: 'Edificio de Servicios Estudiantiles, 1er Nivel',
    category: 'student-services'
  },
  {
    id: 'contabilidad',
    name: 'Contabilidad',
    description: 'Registro y control de operaciones financieras',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative'
  },
  {
    id: 'coordinacion-administrativa',
    name: 'Coordinación Administrativa',
    description: 'Coordinación de procesos administrativos',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative'
  },
  {
    id: 'coordinacion-academica',
    name: 'Coordinación Académica',
    description: 'Coordinación de programas y actividades académicas',
    location: 'Edificio Académico, 3er Nivel',
    category: 'academic'
  },
  {
    id: 'cursos-optativos',
    name: 'Cursos Optativos de Tesis',
    description: 'Gestión y coordinación de cursos optativos y tesis',
    location: 'Edificio Académico, 3er Nivel',
    category: 'academic'
  },
  {
    id: 'deportes',
    name: 'Deportes',
    description: 'Coordinación de actividades deportivas y recreativas',
    location: 'Complejo Deportivo',
    category: 'student-services'
  },
  {
    id: 'economato',
    name: 'Economato',
    description: 'Gestión de recursos económicos y materiales',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative'
  },
  {
    id: 'educacion-continuada',
    name: 'Educación Continuada',
    description: 'Programas de formación y actualización profesional',
    location: 'Edificio Académico, 2do Nivel',
    category: 'academic'
  },
  {
    id: 'extension',
    name: 'Extensión',
    description: 'Vinculación universidad-comunidad y actividades de extensión',
    location: 'Edificio Académico, 1er Nivel',
    category: 'academic'
  },
  {
    id: 'finca-experimental',
    name: 'Finca Experimental',
    description: 'Espacio para prácticas e investigación agrícola',
    location: 'Campus Externo',
    category: 'research'
  },
  {
    id: 'gerencia-financiera',
    name: 'Gerencia Financiera',
    description: 'Administración de recursos financieros',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative'
  },
  {
    id: 'investigacion',
    name: 'Investigación',
    description: 'Coordinación de proyectos de investigación',
    location: 'Edificio de Investigación',
    category: 'research'
  },
  {
    id: 'mayordoma',
    name: 'Mayordomía',
    description: 'Gestión de servicios generales y mantenimiento',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'administrative'
  },
  {
    id: 'ars-uasd',
    name: 'ARS UASD',
    description: 'Administradora de Riesgos de Salud de la universidad',
    location: 'Edificio de Servicios Estudiantiles, 1er Nivel',
    category: 'student-services'
  },
  {
    id: 'multimedia',
    name: 'Multimedia',
    description: 'Recursos audiovisuales y servicios multimedia',
    location: 'Edificio Académico, 1er Nivel',
    category: 'academic'
  },
  {
    id: 'orientacion',
    name: 'Orientación',
    description: 'Servicios de orientación académica y profesional',
    location: 'Edificio de Servicios Estudiantiles, 2do Nivel',
    category: 'student-services'
  },
  {
    id: 'ornato',
    name: 'Ornato',
    description: 'Cuidado y mantenimiento de áreas verdes',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'administrative'
  },
  {
    id: 'planificacion',
    name: 'Planificación',
    description: 'Desarrollo de planes estratégicos y proyectos institucionales',
    location: 'Edificio Administrativo, 3er Nivel',
    category: 'administrative'
  },
  {
    id: 'planta-fisica',
    name: 'Planta Física',
    description: 'Mantenimiento y desarrollo de infraestructura',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'administrative'
  },
  {
    id: 'postgrado',
    name: 'Postgrado',
    description: 'Coordinación de programas de postgrado',
    location: 'Edificio Académico, 3er Nivel',
    category: 'academic'
  },
  {
    id: 'protocolo',
    name: 'Protocolo',
    description: 'Organización de eventos y ceremonias institucionales',
    location: 'Edificio Administrativo, 3er Nivel',
    category: 'administrative'
  },
  {
    id: 'recursos-humanos',
    name: 'Recursos Humanos',
    description: 'Gestión del personal y relaciones laborales',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative'
  },
  {
    id: 'redes-sistemas',
    name: 'Redes y Sistemas',
    description: 'Soporte técnico e infraestructura tecnológica',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative'
  },
  {
    id: 'registro',
    name: 'Registro',
    description: 'Gestión de inscripciones y expedientes académicos',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative'
  },
  {
    id: 'seguridad',
    name: 'Seguridad',
    description: 'Servicios de seguridad y vigilancia del campus',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'administrative'
  },
  {
    id: 'transportacion',
    name: 'Transportación',
    description: 'Servicio de transporte para estudiantes y personal',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'student-services'
  },
  {
    id: 'uasd-virtual',
    name: 'UASD Virtual',
    description: 'Gestión de plataformas y cursos virtuales',
    location: 'Edificio Académico, 2do Nivel',
    category: 'academic'
  },
  {
    id: 'plan-retiro',
    name: 'Plan de Retiro',
    description: 'Administración de planes de jubilación del personal',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative'
  },
  {
    id: 'inclusion-accesibilidad',
    name: 'Inclusión y Accesibilidad',
    description: 'Programas y servicios para estudiantes con necesidades especiales',
    location: 'Edificio de Servicios Estudiantiles, 1er Nivel',
    category: 'student-services'
  },
  {
    id: 'caja',
    name: 'Caja',
    description: 'Gestión de pagos y cobros diarios',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative'
  },
  {
    id: 'apoyo-docente',
    name: 'Apoyo Docente',
    description: 'Servicios de apoyo para la actividad docente',
    location: 'Edificio Académico, 2do Nivel',
    category: 'academic'
  },
  {
    id: 'ofic-adm-elias-pina',
    name: 'Oficina Administrativa Elías Piña',
    description: 'Coordinación administrativa de la extensión en Elías Piña',
    location: 'Extensión Elías Piña',
    category: 'administrative'
  },
  {
    id: 'laboratorio',
    name: 'Laboratorio',
    description: 'Espacios para prácticas y experimentos científicos',
    location: 'Edificio de Ciencias',
    category: 'academic'
  },
  {
    id: 'enfermeria',
    name: 'Enfermería',
    description: 'Servicios de primeros auxilios y atención básica en salud',
    location: 'Edificio de Servicios Estudiantiles, 1er Nivel',
    category: 'student-services'
  }
];

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'academic':
      return 'UNIDAD ACADÉMICA';
    case 'administrative':
      return 'UNIDAD ADMINISTRATIVA';
    case 'student-services':
      return 'SERVICIO ESTUDIANTIL';
    case 'research':
      return 'UNIDAD DE INVESTIGACIÓN';
    default:
      return 'UNIDAD';
  }
};

export function UnidadesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todas las Unidades' },
    { id: 'academic', name: 'Académicas' },
    { id: 'administrative', name: 'Administrativas' },
    { id: 'student-services', name: 'Servicios Estudiantiles' },
    { id: 'research', name: 'Investigación' }
  ];

  // Extraemos la Dirección General para mostrarla por separado
  const direccionGeneral = units.find(unit => unit.id === 'direccion-general');
  
  // Filtramos las unidades (excluyendo la dirección general)
  const filteredUnits = units.filter(unit => {
    const isNotDireccionGeneral = unit.id !== 'direccion-general';
    const matchesCategory = selectedCategory === 'all' || unit.category === selectedCategory;
    return isNotDireccionGeneral && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200 nav-offset"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">UNIDADES</h1>
        </div>
      </header>

      {/* Introduction section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/5">
              <p className="text-gray-700 leading-relaxed mb-4">
                Las Unidades son responsables de la gestión universitaria. Representan a la Universidad externamente y coordinan la cooperación entre los miembros de la universidad internamente. Cada unidad tiene funciones específicas dentro de la administración universitaria.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Dentro de la administración universitaria, cada unidad es responsable de un área específica de operaciones.
              </p>
            </div>
            <div className="md:w-2/5 space-y-3">
              {/* Resources section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Recursos adicionales</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <a href="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Ley+de+Creacio%CC%81n+de+la+UASD.pdf" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">

                    {/*Documentos a la espera de ser subidos- Web no los tiene */}
                    <span className="text-gray-700">Reglamento universitario (PDF)</span>
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </a>
                  <a href="#" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                    <span className="text-gray-700">Informe anual 2023 (PDF)</span>
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </a>

                
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
{/* Dirección General Destacada */}
{direccionGeneral && (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/3">
          <img 
            src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png" 
            alt="Dirección General" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:w-2/3 p-8">
          <div className="uppercase text-xs tracking-widest text-gray-500 mb-1">
            {getCategoryLabel(direccionGeneral.category)}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{direccionGeneral.name}</h2>
          
          <p className="text-gray-700 text-lg mb-6">{direccionGeneral.description}</p>
          
          {/* Añadimos el nombre del rector */}
          <p className="text-gray-800 font-medium mb-6">
            <span className="font-bold">Director:</span> {(direccionGeneral as any).rector}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-3 text-gray-500" />
              <span>{direccionGeneral.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Filter section */}
      <div className="bg-white border-b border-gray-200 pt-10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-0">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group flex flex-col items-center text-center py-4 relative cursor-pointer ${
                      index < categories.length - 1 ? 'border-r border-gray-200' : ''
                    } ${selectedCategory === category.id ? 'bg-gray-50' : ''}`}
                  >
                    <div className={`text-lg font-semibold ${selectedCategory === category.id ? 'text-[#003087]' : 'text-gray-700 group-hover:text-[#003087]'} transition-colors duration-300`}>
                      {category.name}
                    </div>
                    <div className="mt-2 flex justify-center">
                      <span className="arrow text-[#003087] text-[30px] transform transition-transform duration-300 group-hover:translate-x-2">
                        →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Unit cards with minimal design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-gray-300"
            >
              <div className="p-6">
                <div className="uppercase text-xs tracking-widest text-gray-500 mb-1">
                  {getCategoryLabel(unit.category)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{unit.name}</h3>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="truncate">{unit.location}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}