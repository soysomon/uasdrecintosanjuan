import React, { useState } from 'react';
import { Phone, Mail, Building2, Users, Search, ChevronRight, ExternalLink, Clock, MapPin, ChevronLeft, X } from 'lucide-react';
import '../UnidadesPage.css';

interface Unit {
  id: string;
  name: string;
  manager: string;
  extension?: string;
  phone?: string;
  description: string;
  location: string;
  schedule: string;
  category: 'academic' | 'administrative' | 'student-services' | 'research';
}

const units: Unit[] = [
  {
    id: 'admissions',
    name: 'Admisiones',
    manager: 'Modesta Javier',
    extension: '137',
    description: 'Gestión de procesos de admisión y nuevo ingreso de estudiantes',
    location: 'Edificio Administrativo, 1er Nivel',
    schedule: 'Lunes a Viernes 8:00 AM - 4:00 PM',
    category: 'student-services'
  },
  {
    id: 'student-welfare',
    name: 'Bienestar Estudiantil',
    manager: 'Efraín Guzmán',
    extension: '136',
    description: 'Servicios de apoyo y asistencia para el bienestar del estudiante',
    location: 'Edificio de Servicios Estudiantiles, 2do Nivel',
    schedule: 'Lunes a Viernes 8:00 AM - 4:00 PM',
    category: 'student-services'
  },
  {
    id: 'general-cashier',
    name: 'Caja General',
    manager: 'Miriam Milano',
    extension: '109',
    description: 'Gestión de pagos y transacciones financieras',
    location: 'Edificio Administrativo, 1er Nivel',
    schedule: 'Lunes a Viernes 8:00 AM - 3:00 PM',
    category: 'administrative'
  },
  {
    id: 'teacher-control',
    name: 'Control Docente',
    manager: 'Nancy Bello Medina',
    extension: '120',
    description: 'Supervisión y control de la actividad docente',
    location: 'Edificio Académico, 2do Nivel',
    schedule: 'Lunes a Viernes 8:00 AM - 4:00 PM',
    category: 'academic'
  },
  {
    id: 'academic-coordination',
    name: 'Coordinación Académica',
    manager: 'Leonor Taveras',
    extension: '138',
    description: 'Coordinación de programas y actividades académicas',
    location: 'Edificio Académico, 3er Nivel',
    schedule: 'Lunes a Viernes 8:00 AM - 4:00 PM',
    category: 'academic'
  },
  {
    id: 'sports',
    name: 'Deporte',
    manager: 'Juan Roa',
    extension: '119',
    description: 'Coordinación de actividades deportivas y recreativas',
    location: 'Complejo Deportivo',
    schedule: 'Lunes a Sábado 8:00 AM - 6:00 PM',
    category: 'student-services'
  },
  {
    id: 'direction',
    name: 'Dirección',
    manager: 'Carlos Manuel Sánchez De Óleo',
    description: 'Dirección general del recinto universitario',
    location: 'Edificio Administrativo, 3er Nivel',
    schedule: 'Lunes a Viernes 9:00 AM - 5:00 PM',
    category: 'administrative'
  },
  {
    id: 'library',
    name: 'Biblioteca',
    manager: 'Bienvenido Romero',
    extension: '132',
    description: 'Servicios bibliotecarios y recursos de investigación',
    location: 'Edificio de Biblioteca',
    schedule: 'Lunes a Viernes 8:00 AM - 8:00 PM',
    category: 'academic'
  },
  {
    id: 'medical',
    name: 'Dispensario',
    manager: 'Ana Teresa Canario',
    phone: '809-557-2299',
    description: 'Servicios de salud y atención médica',
    location: 'Edificio de Servicios Estudiantiles, 1er Nivel',
    schedule: 'Lunes a Viernes 8:00 AM - 4:00 PM',
    category: 'student-services'
  },
  {
    id: 'research',
    name: 'Investigación',
    manager: 'Rubén Ramírez',
    phone: '809-557-7948',
    description: 'Coordinación de proyectos de investigación',
    location: 'Edificio de Investigación',
    schedule: 'Lunes a Viernes 9:00 AM - 5:00 PM',
    category: 'research'
  }
];

// Map of placeholder images for each manager - to be replaced later
const managerImages: Record<string, string> = {
  'Modesta Javier': 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/Modesta+Javier+Rosario.png',
  'Efraín Guzmán': 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/Efra%C3%ADn+Guzm%C3%A1n+Nova.jpg',
  'Miriam Milano': 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/Miriam+Miliano+F%C3%A9liz.jpg',
  'Nancy Bello Medina': 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-docentes/Nancy-Bello-Medina.png',
  'Leonor Taveras': 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/Leonor+Taveras+Mateo.png',
  'Juan Roa': 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/Juan+Antonio+Roa+Jim%C3%A9nez.jpg',
  'Carlos Manuel Sánchez De Óleo': 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png',
  'Bienvenido Romero': 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Bienvenido+Romero+Bocio.jpg',
  'Ana Teresa Canario': 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-docentes/Ana-Teresa-Canario.png',
  'Rubén Ramírez': 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Rub%C3%A9n+Ram%C3%ADrez+Tavera.jpg'
};

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
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const categories = [
    { id: 'all', name: 'Todas las Unidades' },
    { id: 'academic', name: 'Académicas' },
    { id: 'administrative', name: 'Administrativas' },
    { id: 'student-services', name: 'Servicios Estudiantiles' },
    { id: 'research', name: 'Investigación' }
  ];

  const filteredUnits = units.filter(unit => {
    // Eliminada la condición de búsqueda por texto
    const matchesCategory = selectedCategory === 'all' || unit.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200 nav-offset"> 
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h1 className="text-4xl font-bold text-gray-900">UNIDADES</h1>
  </div>
</header>

      {/* Introduction section - based on Heidelberg Uni style */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/5">
              <p className="text-gray-700 leading-relaxed mb-4">
                Las Unidades son responsables de la gestión universitaria. Representan a la Universidad externamente y coordinan la cooperación entre los miembros de la universidad internamente. Cada unidad está dirigida por un encargado y tiene funciones específicas dentro de la administración universitaria.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Los encargados de unidad son seleccionados por sus méritos y experiencia. Dentro de la administración universitaria, cada miembro es responsable de un área específica de operaciones.
              </p>
            </div>
            <div className="md:w-2/5 space-y-3">
              {/* Resources section - similar to Heidelberg Uni */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Recursos adicionales</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <a href="#" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                    <span className="text-gray-700">Reglamento universitario (PDF)</span>
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </a>
                  <a href="#" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                    <span className="text-gray-700">Constitución de la universidad</span>
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

     {/* Search and Filter section */}
<div className="bg-white border-b border-gray-200 pt-20 mt-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* El input de búsqueda ya no está aquí */}
      <div className="w-full">
        <div className="grid grid-cols-5 gap-0">
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
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Filtrar por {category.name.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Main content - Unit cards styled like the Heidelberg University example */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              onClick={() => setSelectedUnit(unit)}
              className="bg-white overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
            >
              <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                <img
                  src={managerImages[unit.manager]}
                  alt={unit.manager}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="uppercase text-xs tracking-widest text-gray-500 mb-1">
                  {getCategoryLabel(unit.category)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-0.5">{unit.name}</h3>
                <p className="text-sm text-gray-600 mb-4 font-medium">
                  {unit.manager}
                </p>

                <div className="flex items-center justify-between">
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

      {/* Modal for detailed view - Modern and minimal design */}
      {selectedUnit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUnit(null)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white/80 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left side - Image */}
              <div className="md:w-2/5 bg-gray-100">
                <div className="aspect-w-4 aspect-h-5">
                  <img
                    src={managerImages[selectedUnit.manager]}
                    alt={selectedUnit.manager}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right side - Information */}
              <div className="md:w-3/5 p-8">
                <div className="uppercase text-xs tracking-widest text-gray-500 mb-1">
                  {getCategoryLabel(selectedUnit.category)}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedUnit.name}
                </h2>

                <div className="text-lg text-gray-700 font-medium mb-6">
                  {selectedUnit.manager}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Descripción</h3>
                    <p className="text-gray-700">{selectedUnit.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Información de contacto</h3>
                    <div className="space-y-2">
                      {selectedUnit.extension && (
                        <div className="flex items-center text-gray-700">
                          <Phone className="w-4 h-4 mr-3 text-gray-500" />
                          <span>Extensión: {selectedUnit.extension}</span>
                        </div>
                      )}
                      {selectedUnit.phone && (
                        <div className="flex items-center text-gray-700">
                          <Phone className="w-4 h-4 mr-3 text-gray-500" />
                          <span>{selectedUnit.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                        <span>{selectedUnit.location}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-3 text-gray-500" />
                        <span>{selectedUnit.schedule}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <a href="#" className="inline-flex items-center text-gray-700 hover:text-gray-900">
                      <span>Contactar por correo electrónico</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
