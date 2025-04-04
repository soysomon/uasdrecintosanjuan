


import React, { useState, useEffect } from 'react';
import { Clock, GraduationCap, BookOpen, ArrowRight, Search, X, Sparkles, MapPin, Building2 } from 'lucide-react';
import Image from 'next/image';

// Función para optimizar URLs de imágenes
const getOptimizedImageUrl = (url: string) => {
  // Si la URL ya contiene parámetros o es local, la devolvemos tal cual
  if (url.includes('?') || url.startsWith('/')) return url;

  // Agregar parámetros de optimización
  return `${url}?auto=format,compress&q=80&fit=crop&w=800&h=450`;
};

interface Career {
  code: string;
  name: string;
  duration: string;
  credits: number;
  imageUrl: string;
  pensumUrl: string;
}

interface Faculty {
  id: string;
  name: string;
  color: string;
  careers: Career[];
}

// Colores oficiales de las facultades UASD
const faculties: Faculty[] = [
  {
    id: 'humanities',
    name: 'Humanidades',
    color: '#911422',
    careers: [
      {
        code: 'CSPE-30403',
        name: 'Licenciatura en Comunicación Social / Periodismo',
        duration: '4 años',
        credits: 200,
        imageUrl: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&q=80&w=800',
        pensumUrl: 'https://soft.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-CSRP&plan=000012&nivel=GR'
      },
      {
        code: 'LEMI-30701',
        name: 'Licenciatura en Lenguas Modernas / Inglés',
        duration: '4 años',
        credits: 190,
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&q=80&w=800',
        pensumUrl: 'https://soft.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-LEMI&plan=000012&nivel=GR'
      },
      {
        code: 'LET-30801',
        name: 'Licenciatura en Letras',
        duration: '4 años',
        credits: 185,
        imageUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&q=80&w=800',
        pensumUrl: 'https://soft.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-LET&plan=000012&nivel=GR'
      },
      {
     //---------------------Pensum Pendiente--------------
        code: 'PSIE-31004',
        name: 'Licenciatura Psicología Escolar',
        duration: '4 años',
        credits: 200,
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
        code: 'PSIC-31002',
        name: 'Licenciatura en Psicología Clínica',
        duration: '4 años',
        credits: 200,
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&q=80&w=800',
        pensumUrl: 'https://soft.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-PSIC&plan=000012&nivel=GR'
      }
    ]
  },
  {
    id: 'sciences',
    name: 'Ciencias',
    color: '#00a3e6',
    careers: [
      {
        code: 'INFO-40601',
        name: 'Licenciatura en Informática',
        duration: '4 años',
        credits: 200,
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&q=80&w=800',
        pensumUrl: 'https://soft.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-INFO&plan=200820&nivel=GR'
      },

      //---------------------Pensum Pendiente--------------
      {
        code: 'BIO-40101',
        name: 'Licenciatura en Biología para Educación Secundaria',
        duration: '4 años',
        credits: 190,
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
       //---------------------Pensum Pendiente--------------
      {
        code: 'FIS-40201',
        name: 'Licenciatura en Física para Educación Secundaria',
        duration: '4 años',
        credits: 195,
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },

       //---------------------Pensum Pendiente--------------
      {
        code: 'MAT-40301',
        name: 'Licenciatura en Matemáticas para Educación Secundaria',
        duration: '4 años',
        credits: 190,
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },

         //---------------------Pensum Pendiente--------------
      {
        code: 'GEO-40401',
        name: 'Licenciatura en Ciencias de la Tierra',
        duration: '4 años',
        credits: 195,
        imageUrl: 'https://images.unsplash.com/photo-1581093458791-9cd6cd0c7b01?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
       //---------------------Pensum Pendiente--------------
      {
        code: 'QUI-40501',
        name: 'Licenciatura en Química para Educación Secundaria',
        duration: '4 años',
        credits: 195,
        imageUrl: 'https://images.unsplash.com/photo-1532634993-15f421e42ec0?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      }
    ]
  },
  {
    id: 'economics',
    name: 'Ciencias Económicas y Sociales',
    color: '#f47b20',
    careers: [
      {
          //---------------------Pensum Pendiente--------------
        code: 'ADME-50201',
        name: 'Licenciatura en Administración de Empresas',
        duration: '4 años',
        credits: 200,
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
         //---------------------Pensum Pendiente--------------
        code: 'CONT-50301',
        name: 'Licenciatura en Contabilidad',
        duration: '4 años',
        credits: 195,
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
         //---------------------Pensum Pendiente--------------
        code: 'MERC-50203',
        name: 'Licenciatura en Mercadotecnia',
        duration: '4 años',
        credits: 190,
        imageUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      }
    ]
  },
  {
    id: 'law',
    name: 'Ciencias Jurídicas y Políticas',
    color: '#ff1c07',
    careers: [
      {
        code: 'DERE-60202',
        name: 'Licenciatura en Derecho',
        duration: '4 años',
        credits: 200,
        imageUrl: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&q=80&w=800',
        pensumUrl: 'https://soft.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-DERE&plan=000012&nivel=GR'
      },
      {
        code: 'CSPO-60301',
        name: 'Licenciatura en Ciencias Políticas',
        duration: '4 años',
        credits: 190,
        imageUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&q=80&w=800',
        pensumUrl: 'https://soft.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-CSPO&plan=000012&nivel=GR'
      }
    ]
  },
  {
    id: 'engineering',
    name: 'Ingeniería y Arquitectura',
    color: '#2f5ba7',
    careers: [
      {
        code: 'ICIV-70401',
        name: 'Ingeniería Civil',
        duration: '5 años',
        credits: 250,
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&q=80&w=800',
        pensumUrl: 'https://soft.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-ICIV&plan=000012&nivel=GR'
      },
      {
        code: 'AGRI-70601',
        name: 'Agrimensura',
        duration: '4 años',
        credits: 200,
        imageUrl: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      }
    ]
  },
  {
    id: 'health',
    name: 'Ciencias de la Salud',
    color: '#f3fa33', 
    careers: [
      {
        code: 'BIOA-80902',
        name: 'Licenciatura en Bioanálisis',
        duration: '4 años',
        credits: 200,
        imageUrl: 'https://images.unsplash.com/photo-1579165466991-467135ad3875?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
        code: 'ENF1-80601',
        name: 'Licenciatura en Enfermería',
        duration: '4 años',
        credits: 210,
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
        code: 'DMED-81001',
        name: 'Doctor en Medicina',
        duration: '6 años',
        credits: 300,
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      }
    ]
  },
  {
    id: 'agronomy',
    name: 'Ciencias Agronómicas y Veterinarias',
    color: '#006400',
    careers: [
      {
        code: 'IADA-90210',
        name: 'Ingeniería Agronómica / Desarrollo Agrícola',
        duration: '5 años',
        credits: 240,
        imageUrl: 'https://images.unsplash.com/photo-1592991538534-00972b6f59ab?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
        code: 'IAPC-90209',
        name: 'Ingeniería Agronómica / Producción de Cultivos',
        duration: '5 años',
        credits: 240,
        imageUrl: 'https://images.unsplash.com/photo-1592991538534-00972b6f59ab?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
        code: 'IASR-90208',
        name: 'Ingeniería Agronómica / Suelo y Riego',
        duration: '5 años',
        credits: 240,
        imageUrl: 'https://images.unsplash.com/photo-1592991538534-00972b6f59ab?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
        code: 'IZOO-90306',
        name: 'Ingeniería en Zootecnia',
        duration: '5 años',
        credits: 240,
        imageUrl: 'https://images.unsplash.com/photo-1592991538534-00972b6f59ab?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      }
    ]
  },
  {
    id: 'education',
    name: 'Ciencias de la Educación',
    color: '#4B0082',
    careers: [
      {
        code: 'EDOA-30951',
        name: 'Licenciatura en Educación / Orientación Académica',
        duration: '4 años',
        credits: 180,
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
        code: 'EDBA-24355',
        name: 'Licenciatura en Educación Básica',
        duration: '4 años',
        credits: 180,
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
        code: 'EDFI-30957',
        name: 'Licenciatura en Educación Física',
        duration: '4 años',
        credits: 180,
        imageUrl: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      },
      {
        code: 'EDUI-30954',
        name: 'Licenciatura en Educación Inicial',
        duration: '4 años',
        credits: 180,
        imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&q=80&w=800',
        pensumUrl: 'https://ejemplo.com/pensum/INFO-40601'
      }
    ]
  }
];

// Contraste de texto adaptativo para cada color de facultad
const getTextColorForBackground = (bgColor: string) => {
  // Color de Ciencias de la Salud necesita texto oscuro para contraste
  if (bgColor === '#f3fa33') return '#000000';

  // Para otros colores claros
  if (bgColor === '#00a3e6' || bgColor.toLowerCase() === '#ffffff')
    return '#000000';

  return '#ffffff'; // Color para fondos oscuros
};

export function DegreesPage() {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  // Simular carga de imágenes y contenido
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Marcar cuando una imagen se carga completamente
  const handleImageLoaded = (code: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [code]: true
    }));
  };

  // Filtrar carreras según la facultad seleccionada y término de búsqueda
  const filteredCareers = searchTerm
    ? faculties.flatMap(f => f.careers).filter(career =>
        career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedFaculty
      ? selectedFaculty.careers
      : faculties.flatMap(f => f.careers);

  // Encontrar la facultad a la que pertenece una carrera
  const getFacultyForCareer = (career: Career): Faculty | undefined => {
    return faculties.find(f => f.careers.some(c => c.code === career.code));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#2f2382] to-[#1a1464] py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10" />
          {/* Elementos geométricos modernos */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-xl" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-lg" />
          <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-[#1a1464]/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="text-center animate-fade-in">
  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-6xl mt-12">
    Carreras de Grado
  </h1>
  <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-100">
    Explora nuestras ofertas académicas
  </p>
</div>


        </div>
      </div>

      {/* Faculty Tabs */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex whitespace-nowrap py-3 px-4 min-w-max">
            <button
              onClick={() => {
                setSelectedFaculty(null);
                setSearchTerm('');
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 mr-2 ${
                !selectedFaculty && !searchTerm
                  ? 'bg-[#2f2382] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todas las Carreras
            </button>

            {faculties.map(faculty => (
              <button
                key={faculty.id}
                onClick={() => {
                  setSelectedFaculty(faculty);
                  setSearchTerm('');
                }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 mr-2`}
                style={{
                  backgroundColor: selectedFaculty?.id === faculty.id ? faculty.color : '#f3f4f6',
                  color: selectedFaculty?.id === faculty.id
                    ? getTextColorForBackground(faculty.color)
                    : '#4b5563'
                }}
              >
                {faculty.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o código de carrera..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-[#2f2382] focus:border-[#2f2382] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Careers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          // Skeleton loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow animate-pulse">
                <div className="h-1 bg-gray-300" />
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="flex justify-between pt-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="h-8 bg-gray-200 rounded" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCareers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCareers.map((career, index) => {
              const faculty = getFacultyForCareer(career);
              if (!faculty) return null;

              return (
                <div
                  key={career.code}
                  className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                  onClick={() => {
                    setSelectedCareer(career);
                  }}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg h-full flex flex-col">
                    {/* Faculty Color Bar */}
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: faculty.color }}
                    />

                    {/* Career Image */}
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-gray-200 animate-pulse ${
                          imagesLoaded[career.code] ? 'opacity-0' : 'opacity-100'
                        } transition-opacity duration-300`}
                      />
                      <img
                        src={getOptimizedImageUrl(career.imageUrl)}
                        alt={career.name}
                        onLoad={() => handleImageLoaded(career.code)}
                        className={`object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500 ${
                          imagesLoaded[career.code] ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
                    </div>

                    {/* Career Info */}
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#2f2382] transition-colors">
                        {career.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{career.code}</p>

                      <div className="flex items-center justify-between text-sm mt-auto">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{career.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <GraduationCap className="w-4 h-4 mr-1" />
                          <span>{career.credits} cr.</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          className="flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md border transition-colors"
                          style={{
                            borderColor: faculty.color,
                            color: faculty.color
                          }}
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          Ver Pensum
                        </button>
                        <button
                          className="flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                          style={{
                            backgroundColor: faculty.color,
                            color: getTextColorForBackground(faculty.color)
                          }}
                        >
                          <ArrowRight className="w-4 h-4 mr-1" />
                          Inscribirme
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // No results state
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-500">
              Intenta con otros términos de búsqueda o selecciona otra facultad
            </p>
          </div>
        )}
      </div>

      {/* Career Details Modal */}
      {selectedCareer && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
          onClick={() => setSelectedCareer(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-up shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Career Image */}
              <div className="relative h-64">
                <img
                  src={getOptimizedImageUrl(selectedCareer.imageUrl)}
                  alt={selectedCareer.name}
                  className="w-full h-full object-cover"
                  loading="eager" // Cargar inmediatamente para mejor UX
                />
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: `linear-gradient(to bottom, ${getFacultyForCareer(selectedCareer)?.color}00 0%, ${getFacultyForCareer(selectedCareer)?.color}dd 100%)`
                  }}
                />
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Career Content */}
              <div className="p-8">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-6">
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: getFacultyForCareer(selectedCareer)?.color }}
                    >
                      {selectedCareer.code}
                    </p>
                    <h2
                      className="text-3xl font-bold"
                      style={{
                        color: getFacultyForCareer(selectedCareer)?.color,
                        textShadow: getFacultyForCareer(selectedCareer)?.id === 'health' ? '0 1px 0 rgba(0,0,0,0.2)' : 'none'
                      }}
                    >
                      {selectedCareer.name}
                    </h2>
                    <p className="text-gray-500 mt-2">
                      Facultad de {getFacultyForCareer(selectedCareer)?.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="p-2 rounded-full"
                          style={{
                            backgroundColor: `${getFacultyForCareer(selectedCareer)?.color}20`,
                            color: getFacultyForCareer(selectedCareer)?.color
                          }}
                        >
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duración</p>
                          <p className="font-semibold">{selectedCareer.duration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="p-2 rounded-full"
                          style={{
                            backgroundColor: `${getFacultyForCareer(selectedCareer)?.color}20`,
                            color: getFacultyForCareer(selectedCareer)?.color
                          }}
                        >
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Créditos</p>
                          <p className="font-semibold">{selectedCareer.credits}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                   

                  <a
                      href={selectedCareer.pensumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-300 border hover:shadow-md"
                      style={{
                        borderColor: getFacultyForCareer(selectedCareer)?.color,
                        color: getFacultyForCareer(selectedCareer)?.color
                      }}
                    >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Ver Plan de Estudios
                  </a>
                    <button
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
                      style={{
                        backgroundColor: getFacultyForCareer(selectedCareer)?.color,
                        color: getTextColorForBackground(getFacultyForCareer(selectedCareer)?.color || '#2f2382')
                      }}
                    >
                      Inscribirme Ahora
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
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
