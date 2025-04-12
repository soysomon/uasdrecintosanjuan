import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { User, Search, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [filteredDepartamento, setFilteredDepartamento] = useState('');
  const [showQuickLinks, setShowQuickLinks] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const location = useLocation();
  const isResidentPage = !location.pathname.includes('no-residentes');
  const tipoDocente = isResidentPage ? 'residente' : 'no_residente';
  const docentesPerPage = 12;

  useEffect(() => {
    fetchDocentes();
  }, [tipoDocente]);

  const fetchDocentes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ROUTES.DOCENTES_BY_TYPE(tipoDocente)}`);
      const docentesPublicados = response.data.filter((doc: Docente) => doc.isPublished);
      setDocentes(docentesPublicados);
      
      const uniqueDepartamentos = Array.from(
        new Set(docentesPublicados.map((doc: Docente) => doc.departamento).filter(Boolean))
      ) as string[];
      setDepartamentos(uniqueDepartamentos);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching docentes:', err);
      setError('No se pudieron cargar los docentes. Por favor, intenta de nuevo más tarde.');
      setLoading(false);
    }
  };

  const toggleQuickLinks = () => {
    setShowQuickLinks(!showQuickLinks);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredDocentes = docentes.filter(docente => {
    const matchesSearch =
      searchTerm === '' ||
      docente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (docente.cargo && docente.cargo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartamento = filteredDepartamento === '' || docente.departamento === filteredDepartamento;
    return matchesSearch && matchesDepartamento;
  }).sort((a, b) => {
    const nameA = `${a.nombre} ${a.apellidos}`.toLowerCase();
    const nameB = `${b.nombre} ${b.apellidos}`.toLowerCase();
    return sortOrder === 'asc' 
      ? nameA.localeCompare(nameB) 
      : nameB.localeCompare(nameA);
  });

  // Paginación
  const indexOfLastDocente = currentPage * docentesPerPage;
  const indexOfFirstDocente = indexOfLastDocente - docentesPerPage;
  const currentDocentes = filteredDocentes.slice(indexOfFirstDocente, indexOfLastDocente);
  const totalPages = Math.ceil(filteredDocentes.length / docentesPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Navegación */}
        <nav className="mb-10" aria-label="Navegación principal">
          <Link
            to="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-900 text-sm transition-colors duration-200 focus:outline-none"
          >
            <ChevronLeft size={16} className="mr-1" aria-hidden="true" />
            Volver
          </Link>
        </nav>

        {/* Encabezado */}
        <header className="mb-12">
          <h1 className="text-3xl font-light text-gray-900 mb-1">
            {isResidentPage ? 'Docentes Residentes' : 'Docentes No Residentes'}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <p className="text-gray-500 text-sm mb-6 md:mb-0 max-w-2xl">
              {isResidentPage
                ? 'Nuestros docentes residentes forman parte del cuerpo académico permanente de UASD Recinto San Juan.'
                : 'Los docentes no residentes colaboran con UASD Recinto San Juan en programas específicos y cursos especializados.'}
            </p>
            <Link
              to={isResidentPage ? '/docentes/no-residentes' : '/docentes/residentes'}
              className="text-sm text-gray-500 hover:text-gray-900 border-b border-gray-300 hover:border-gray-900 pb-1 transition-colors duration-200"
            >
              Ver Docentes {isResidentPage ? 'No Residentes' : 'Residentes'}
            </Link>
          </div>
        </header>

        {/* Filtros de Departamentos - Estilo QuickLinks con botón para expandir/colapsar */}
        {departamentos.length > 0 && (
          <div className="relative mb-10">
            {/* Botón circular para mostrar/ocultar QuickLinks */}
            <button 
              onClick={toggleQuickLinks}
              className="absolute z-10 left-1/2 transform -translate-x-1/2 -bottom-5 w-10 h-10 rounded-full bg-blue shadow-md flex items-center justify-center border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
              aria-label={showQuickLinks ? "Ocultar filtros de departamentos" : "Mostrar filtros de departamentos"}
            >
              {showQuickLinks ? 
                <ChevronUp className="text-gray-600" size={20} /> : 
                <ChevronDown className="text-gray-600" size={20} />
              }
            </button>
            
            {/* Panel de QuickLinks */}
            <section className={`quick-links bg-white p-5 border border-gray-100 rounded-md shadow-sm transition-all duration-300 ${
              showQuickLinks ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-y-2">
              <button
  key="todos"
  onClick={() => setFilteredDepartamento('')}
  className={`group flex flex-col items-center text-center py-4 relative border-r border-gray-200 ${
    filteredDepartamento === '' ? 'text-[#003087]' : 'text-gray-500'
  }`}
>
  <div className="text-sm font-normal group-hover:text-[#003087] transition-colors duration-300">
    Todos los departamentos
  </div>
  <div className="mt-2 flex justify-center">
    <span className="arrow text-[#003087] text-[30px] transform transition-transform duration-300 group-hover:translate-x-2">
      →
    </span>
  </div>
</button>

{departamentos.map((depto, index) => (
  <button
    key={depto}
    onClick={() => setFilteredDepartamento(depto)}
    className={`group flex flex-col items-center text-center py-4 relative ${
      index < departamentos.length - 1 ? 'border-r border-gray-200' : ''
    } ${
      filteredDepartamento === depto ? 'text-[#003087]' : 'text-gray-700'
    }`}
  >
    <div className="text-sm font-normal group-hover:text-[#003087] transition-colors duration-300">
      {depto}
    </div>
    <div className="mt-2 flex justify-center">
      <span className="arrow text-[#003087] text-[30px] transform transition-transform duration-300 group-hover:translate-x-2">
        →
      </span>
    </div>
  </button>
))}
              </div>
            </section>
          </div>
        )}

        {/* Barra de búsqueda y ordenación alfabética */}
        <div className="mb-8 flex flex-wrap items-center justify-between">
          <div className="relative w-full md:w-auto md:flex-grow mr-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
              aria-hidden="true"
            />
            <input
              id="search-docentes"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o cargo..."
              className="w-full pl-10 pr-4 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-200 bg-transparent"
            />
          </div>
          <button 
            onClick={toggleSortOrder}
            className="mt-4 md:mt-0 px-3 py-1 border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 rounded flex items-center"
          >
            Ordenar: A-Z {sortOrder === 'asc' ? '↓' : '↑'}
          </button>
        </div>

        {/* Contenido */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-700"></div>
              <span className="ml-3 text-gray-600 text-sm">Cargando docentes...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchDocentes}
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
              >
                Reintentar
              </button>
            </div>
          ) : filteredDocentes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No se encontraron docentes con los criterios seleccionados</p>
              {(searchTerm || filteredDepartamento) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilteredDepartamento('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentDocentes.map((docente) => (
                  <Link
                    key={docente._id}
                    to={`/docentes/${docente.slug}`}
                    className="block group relative overflow-hidden bg-gray-100 hover:bg-blue-50 transition-all duration-300 focus:outline-none"
                  >
                    <div className="p-4">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-100 mb-4">
                        {docente.fotoPerfil ? (
                          <img
                            src={docente.fotoPerfil}
                            alt={`${docente.nombre} ${docente.apellidos}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <User size={32} className="text-gray-400" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors duration-200">
                          {docente.nombre} {docente.apellidos}
                        </h3>
                        {docente.cargo && (
                          <p className="text-gray-500 text-xs">
                            {docente.cargo}
                          </p>
                        )}
                        {docente.departamento && (
                          <p className="text-gray-400 text-xs">
                            {docente.departamento}
                          </p>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-4">
                        <span className="text-[#003087] text-xl">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <nav className="inline-flex space-x-1" aria-label="Paginación">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-2 ${
                          currentPage === number
                            ? 'bg-blue-50 text-[#003087] font-medium'
                            : 'text-gray-500 hover:bg-gray-50'
                        } rounded-md transition-colors duration-200 text-sm`}
                        aria-current={currentPage === number ? 'page' : undefined}
                      >
                        {number}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentFacultyPage;