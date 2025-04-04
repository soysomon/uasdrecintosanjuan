import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Search,  
  User,
  Briefcase,
  ChevronLeft,
  GraduationCap, 
  MapPin
} from 'lucide-react';
import API_ROUTES from '../config/api';

// Interfaces
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
  videoUrl?: string; 
  educacion?: Educacion[];
  idiomas?: string[];
  experienciaProfesional?: Experiencia[];
  reconocimientos?: Reconocimiento[];
  participacionEventos?: Evento[];
  isPublished: boolean;
}

export function NonResidentFacultyPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Todos');
  const [departments, setDepartments] = useState<string[]>(['Todos']);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch docentes no residentes from API
  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ROUTES.DOCENTES_BY_TYPE('no_residente'));
        
        // Filtrar solo los docentes publicados
        const docentesPublicados = response.data.filter((doc: Docente) => doc.isPublished);
        setDocentes(docentesPublicados);
        
        // Extract unique departments for filtering
        const uniqueDepartments = Array.from(
          new Set(
            docentesPublicados
              .map((doc: Docente) => doc.departamento)
              .filter(Boolean)
          )
        ) as string[];
        
        setDepartments(['Todos', ...uniqueDepartments]);
        
        // Extract specializations (from especialidad field)
        const allSpecializations = docentesPublicados
        .map((doc: Docente) => doc.especialidad)
        .filter(Boolean) as string[];
          
        setSpecializations(Array.from(new Set(allSpecializations)));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching docentes:', err);
        setError('No se pudieron cargar los docentes. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      }
    };
    
    fetchDocentes();
  }, []);
  
  // Filter docentes based on search term, department and specialization
  const filteredDocentes = docentes.filter(docente => {
    const fullName = `${docente.nombre} ${docente.apellidos}`.toLowerCase();
    const matchesSearch = searchTerm === '' || 
                        fullName.includes(searchTerm.toLowerCase()) ||
                        (docente.especialidad && 
                          docente.especialidad.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (docente.cargo && 
                          docente.cargo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === 'Todos' || 
                            (docente.departamento === selectedDepartment);
    
    const matchesSpecialization = selectedSpecialization.length === 0 ||
                               (docente.especialidad && 
                                 selectedSpecialization.includes(docente.especialidad));
    
    return matchesSearch && matchesDepartment && matchesSpecialization;
  });

  const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);
  const paginatedDocentes = filteredDocentes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      {/* Hero Section */}
      <div className="relative bg-[#003087] py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#003087]/95 to-[#003087]/70" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 transform translate-x-1/3 translate-y-1/3 rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Docentes No Residentes
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-100">
              Conoce a nuestro equipo de profesionales dedicados a la excelencia académica
            </p>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="container mx-auto px-4 pt-6 -mt-12 relative z-10">
        <Link to="/docentes-page" className="text-white hover:text-gray-200 transition-colors flex items-center mb-4">
          <ChevronLeft size={16} className="mr-1" />
          Volver a Docentes
        </Link>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o especialización..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#003087] focus:ring-[#003087] transition-colors"
              />
            </div>

            {/* Department Filter */}
            {departments.length > 1 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Departamento:</p>
                <div className="flex flex-wrap gap-2">
                  {departments.map((department) => (
                    <button
                      key={department}
                      onClick={() => setSelectedDepartment(department)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDepartment === department
                          ? 'bg-[#003087] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {department}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specialization Filter */}
            {specializations.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Especialización:</p>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((specialization) => (
                    <button
                      key={specialization}
                      onClick={() => {
                        setSelectedSpecialization(prev =>
                          prev.includes(specialization)
                            ? prev.filter(s => s !== specialization)
                            : [...prev, specialization]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedSpecialization.includes(specialization)
                          ? 'bg-[#003087] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {specialization}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Faculty Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003087]"></div>
            <span className="ml-3 text-[#003087] font-medium">Cargando docentes...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : filteredDocentes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <User className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-gray-500 text-lg">No se encontraron docentes</p>
            {(searchTerm || selectedDepartment !== 'Todos' || selectedSpecialization.length > 0) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartment('Todos');
                  setSelectedSpecialization([]);
                }}
                className="mt-4 text-[#003087] hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paginatedDocentes.map((docente, index) => (
                <motion.div
                  key={docente._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    to={`/docentes/${docente.slug}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group-hover:border-blue-300 h-full flex flex-col">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-100 relative">
                        {docente.fotoPerfil ? (
                          <img
                            src={docente.fotoPerfil}
                            alt={`${docente.nombre} ${docente.apellidos}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={64} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                          {docente.nombre} {docente.apellidos}
                        </h3>
                        
                        {docente.cargo && (
                          <p className="text-blue-600 text-sm mt-1 flex items-center">
                            <Briefcase size={14} className="mr-1" />
                            {docente.cargo}
                          </p>
                        )}
                        
                        {docente.departamento && (
                          <p className="text-gray-500 text-sm mt-1 flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {docente.departamento}
                          </p>
                        )}
                        
                        {docente.especialidad && (
                          <p className="text-gray-500 text-sm mt-1 flex items-center">
                            <GraduationCap size={14} className="mr-1" />
                            {docente.especialidad}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-[#003087] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default NonResidentFacultyPage;