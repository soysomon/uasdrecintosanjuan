import React, { useState } from 'react';
import { Phone, Mail, Building2, Users, Search, ChevronRight, ExternalLink, Clock, MapPin, ChevronLeft } from 'lucide-react';

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
    manager: 'Nancy Bello',
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

export function UnidadesPage() {
  const [searchTerm, setSearchTerm] = useState('');
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
    const matchesSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || unit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Bauhaus-inspired design */}
      <div className="relative bg-[#2f2382] py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f2382]/95 to-[#2f2382]/70" />
          {/* Geometric shapes */}
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
              Directorio de Unidades
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-100">
              Explora nuestras unidades académicas y administrativas
            </p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction Section */}
        <div className="mt-12 mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Encuentra tu Unidad
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre información detallada sobre nuestras unidades académicas, administrativas y de servicios estudiantiles.
          </p>
        </div>

        {/* Search and Filter Section - Now positioned lower */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#2f2382]/10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Search Input */}
              <div className="relative flex-grow w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o encargado..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#2f2382] focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Navigation */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-2">
                <button className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                        selectedCategory === category.id
                          ? 'bg-[#2f2382] text-white shadow-lg'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                <button className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className="group relative bg-white rounded-lg shadow-xl overflow-hidden border border-[#2f2382]/10 hover:border-[#2f2382]/30 transition-all duration-300"
              onClick={() => setSelectedUnit(unit)}
            >
              <div className="absolute top-0 left-0 w-2 h-2 bg-[#2f2382]" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#2f2382]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#2f2382]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#2f2382]" />
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Building2 className="w-8 h-8 text-[#2f2382]" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">{unit.name}</h3>
                    <p className="text-sm text-gray-500">{unit.manager}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{unit.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  {unit.extension && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>Ext. {unit.extension}</span>
                    </div>
                  )}
                  {unit.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{unit.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{unit.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{unit.schedule}</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-6 h-6 text-[#2f2382]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for detailed view */}
      {selectedUnit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#2f2382]">{selectedUnit.name}</h2>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Cerrar</span>
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Información General</h3>
                  <p className="text-gray-600">{selectedUnit.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Encargado</h3>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-[#2f2382] mr-2" />
                    <span>{selectedUnit.manager}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contacto</h3>
                  <div className="space-y-2">
                    {selectedUnit.extension && (
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-[#2f2382] mr-2" />
                        <span>Extensión: {selectedUnit.extension}</span>
                      </div>
                    )}
                    {selectedUnit.phone && (
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-[#2f2382] mr-2" />
                        <span>{selectedUnit.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ubicación y Horario</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-[#2f2382] mr-2" />
                      <span>{selectedUnit.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-[#2f2382] mr-2" />
                      <span>{selectedUnit.schedule}</span>
                    </div>
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