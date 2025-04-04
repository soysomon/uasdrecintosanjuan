import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, FileText, ChevronRight, Book, GraduationCap, Loader, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import API_ROUTES from '../../config/api';
import { PublicacionDocente } from '../../components/PublicacionesDocentesManager';

interface DocenteCount {
  residentes: number;
  noResidentes: number;
}

const DocentesPage: React.FC = () => {
  const [docenteCount, setDocenteCount] = useState<DocenteCount>({ residentes: 0, noResidentes: 0 });
  const [publicaciones, setPublicaciones] = useState<PublicacionDocente[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(true);

  useEffect(() => {
    fetchDocenteCount();
    fetchPublicaciones();
  }, []);

  const fetchDocenteCount = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ROUTES.DOCENTES);

      // Calcular conteo por tipo
      const counts = response.data.reduce((acc: DocenteCount, docente: any) => {
        if (docente.tipo === 'residente' && docente.isPublished) {
          acc.residentes += 1;
        } else if (docente.tipo === 'no_residente' && docente.isPublished) {
          acc.noResidentes += 1;
        }
        return acc;
      }, { residentes: 0, noResidentes: 0 });

      setDocenteCount(counts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching docente counts:', err);
      setLoading(false);
      toast.error('Error al cargar información de docentes', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    }
  };

  const fetchPublicaciones = async () => {
    try {
      setLoadingPublicaciones(true);
      const response = await axios.get(API_ROUTES.PUBLICACIONES_DOCENTES);

      // Filtrar solo publicaciones publicadas
      const publicadas = response.data.filter((pub: PublicacionDocente) => pub.isPublished);

      // Ordenar por volumen
      publicadas.sort((a: PublicacionDocente, b: PublicacionDocente) => {
        // Extraer números del volumen (si es posible)
        const numA = parseInt(a.volumen.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.volumen.replace(/\D/g, '')) || 0;
        return numA - numB;
      });

      setPublicaciones(publicadas);
      setLoadingPublicaciones(false);
    } catch (err) {
      console.error('Error fetching publicaciones:', err);
      setLoadingPublicaciones(false);
      toast.error('Error al cargar publicaciones', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="mr-3 text-blue-600" size={28} />
            Equipo Docente
          </h1>

          <p className="text-gray-600 mb-8 max-w-3xl">
            Conoce al equipo docente de UASD Recinto San Juan, conformado por profesionales destacados en sus áreas. Nuestros docentes son el pilar fundamental de la calidad educativa que ofrecemos a nuestros estudiantes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sección Docentes Residentes */}
            <Link to="/docentes/residentes" className="block group">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <User className="text-blue-600 mr-2" size={24} />
                      <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        Docentes Residentes
                      </h2>
                    </div>

                    <p className="text-gray-600 mb-3">
                      Nuestros docentes residentes conforman el cuerpo académico permanente del recinto, dedicados a tiempo completo a la formación de nuestros estudiantes.
                    </p>

                    {loading ? (
                      <div className="flex items-center text-blue-600">
                        <Loader size={16} className="animate-spin mr-2" />
                        <span>Cargando...</span>
                      </div>
                    ) : (
                      <p className="text-blue-600 font-medium">
                        {docenteCount.residentes} docentes activos
                      </p>
                    )}
                  </div>

                  <ChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
                </div>
              </div>
            </Link>

            {/* Sección Docentes No Residentes */}
            <Link to="/docentes/no-residentes" className="block group">
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <GraduationCap className="text-purple-600 mr-2" size={24} />
                      <h2 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        Docentes No Residentes
                      </h2>
                    </div>

                    <p className="text-gray-600 mb-3">
                      Profesionales que colaboran en programas específicos, aportando experiencia especializada en diversas áreas del conocimiento.
                    </p>

                    {loading ? (
                      <div className="flex items-center text-purple-600">
                        <Loader size={16} className="animate-spin mr-2" />
                        <span>Cargando...</span>
                      </div>
                    ) : (
                      <p className="text-purple-600 font-medium">
                        {docenteCount.noResidentes} docentes colaboradores
                      </p>
                    )}
                  </div>

                  <ChevronRight className="text-gray-400 group-hover:text-purple-500 transition-colors" size={20} />
                </div>
              </div>
            </Link>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">
            Publicaciones Sobre Nuestros Docentes
          </h2>

          {loadingPublicaciones ? (
            <div className="flex justify-center items-center py-8">
              <Loader size={24} className="animate-spin text-blue-600 mr-3" />
              <span className="text-blue-600">Cargando publicaciones...</span>
            </div>
          ) : publicaciones.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Book size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No hay publicaciones disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publicaciones.map((publicacion) => (
                <a
                  key={publicacion._id}
                  href={publicacion.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-start">
                      <div className="mr-4 relative overflow-hidden rounded-lg" style={{ width: '80px', height: '110px' }}>
                        {publicacion.portadaUrl ? (
                          <img
                            src={publicacion.portadaUrl}
                            alt={publicacion.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="bg-blue-50 w-full h-full flex items-center justify-center">
                            <Book className="text-blue-600" size={36} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors flex items-center">
                          {publicacion.titulo}
                        </h3>
                        <p className="text-blue-600 text-sm mb-2">{publicacion.volumen} • {publicacion.anio}</p>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {publicacion.descripcion || 'Publicación que presenta los perfiles, trayectorias y contribuciones de los docentes destacados del recinto.'}
                        </p>

                        {publicacion.pdfUrl && (
                          <div className="mt-3 flex items-center text-sm text-blue-600 font-medium">
                            <FileText size={14} className="mr-1" />
                            <span>Ver PDF</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocentesPage;
