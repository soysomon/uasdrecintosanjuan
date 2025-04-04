import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { User, Search, MapPin, GraduationCap, Briefcase, Award, ChevronLeft } from 'lucide-react';
import API_ROUTES from '../../config/api';

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
  isPublished: boolean;
}

const ResidentFacultyPage: React.FC = () => {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [filteredDepartamento, setFilteredDepartamento] = useState<string>('');
  
  const location = useLocation();
  // Determinar si estamos en la página de residentes o no residentes
  const isResidentPage = !location.pathname.includes('no-residentes');
  const tipoDocente = isResidentPage ? 'residente' : 'no_residente';
  
  useEffect(() => {
    fetchDocentes();
  }, [tipoDocente]); // Recargar cuando cambia el tipo de docente
  
  const fetchDocentes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ROUTES.DOCENTES_BY_TYPE(tipoDocente)}`);
      
      // Filtrar solo los docentes publicados
      const docentesPublicados = response.data.filter((doc: Docente) => doc.isPublished);
      setDocentes(docentesPublicados);
      
      // Extraer departamentos únicos para el filtro
      const uniqueDepartamentos = Array.from(
        new Set(
          docentesPublicados
            .map((doc: Docente) => doc.departamento)
            .filter(Boolean) // Eliminar valores undefined o vacíos
        )
      ) as string[];
      
      setDepartamentos(uniqueDepartamentos);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching docentes:', err);
      setError('No se pudieron cargar los docentes. Por favor, inténtalo de nuevo más tarde.');
      setLoading(false);
    }
  };
  
  // Filtrar docentes según búsqueda y departamento
  const filteredDocentes = docentes.filter(docente => {
    const matchesSearch = searchTerm === '' || 
      docente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      docente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (docente.cargo && docente.cargo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartamento = filteredDepartamento === '' || 
      docente.departamento === filteredDepartamento;
    
    return matchesSearch && matchesDepartamento;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
            <ChevronLeft size={16} className="mr-1" />
            Volver al Inicio
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <User className="mr-3 text-blue-600" size={28} />
              Docentes {isResidentPage ? 'Residentes' : 'No Residentes'}
            </h1>
            
            {/* Toggle entre residentes y no residentes */}
            <Link 
              to={isResidentPage ? '/docentes/no-residentes' : '/docentes/residentes'} 
              className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Ver Docentes {isResidentPage ? 'No Residentes' : 'Residentes'}
            </Link>
          </div>
          
          <p className="text-gray-600 mb-8">
            {isResidentPage 
              ? 'Nuestros docentes residentes forman parte del cuerpo académico permanente de UASD Recinto San Juan.' 
              : 'Los docentes no residentes colaboran con UASD Recinto San Juan en programas específicos y cursos especializados.'}
          </p>
          
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o cargo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            {departamentos.length > 0 && (
              <div className="w-full md:w-64">
                <select
                  value={filteredDepartamento}
                  onChange={(e) => setFilteredDepartamento(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="">Todos los departamentos</option>
                  {departamentos.map(depto => (
                    <option key={depto} value={depto}>{depto}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Listado de docentes */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-blue-600 font-medium">Cargando docentes...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchDocentes}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : filteredDocentes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <User className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-500 text-lg">No se encontraron docentes</p>
              {(searchTerm || filteredDepartamento) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilteredDepartamento('');
                  }}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocentes.map(docente => (
                <Link 
                  key={docente._id}
                  to={`/docentes/${docente.slug}`}
                  className="block group"
                >
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group-hover:border-blue-300">
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
                    
                    <div className="p-4">
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentFacultyPage;