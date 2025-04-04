import React from 'react';
import { MapPin, Users, BookOpen, GraduationCap, Building2, Calendar } from 'lucide-react';

interface Statistic {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const statistics: Statistic[] = [
  { icon: <Users className="w-6 h-6" />, value: "500+", label: "Estudiantes" },
  { icon: <BookOpen className="w-6 h-6" />, value: "10", label: "Programas Académicos" },
  { icon: <GraduationCap className="w-6 h-6" />, value: "50+", label: "Docentes" },
  { icon: <Building2 className="w-6 h-6" />, value: "1", label: "Campus" },
  { icon: <Calendar className="w-6 h-6" />, value: "2020", label: "Año de Fundación" }
];

export function EliasPinaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Bauhaus-inspired design */}
      <div className="relative h-[70vh] bg-[#2f2382] overflow-hidden">
        {/* Geometric Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/10 transform translate-x-1/4 translate-y-1/4 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between h-full py-12">
            <div className="text-white lg:w-1/2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <MapPin className="w-8 h-8 mr-3" />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  UASD Elías Piña
                </h1>
              </div>
              <p className="text-xl text-white/90 max-w-2xl">
                Expandiendo las fronteras del conocimiento en la región fronteriza,
                llevando educación superior de calidad a nuevos horizontes.
              </p>
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative w-full h-[300px] lg:h-[400px] rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://i.ibb.co/mF2MszGb/uasd-elias-pi-a.jpg"
                  alt="UASD Elías Piña"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2f2382]/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-xl shadow-xl border border-[#2f2382]/10 p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {statistics.map((stat, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2f2382] to-[#2f2382]/60 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-white p-4 rounded-lg text-center">
                  <div className="text-[#2f2382] flex justify-center mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-[#2f2382]">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* About Section */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#2f2382]" />
            <div className="relative bg-white p-8 rounded-lg shadow-xl border border-[#2f2382]/10">
              <h2 className="text-3xl font-bold text-[#2f2382] mb-6">Sobre Nosotros</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                El SubCentro UASD Elías Piña representa la expansión estratégica de la 
                Universidad Autónoma de Santo Domingo hacia la región fronteriza, 
                brindando acceso a educación superior de calidad a las comunidades 
                de la provincia y áreas circundantes.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nuestro compromiso es formar profesionales competentes que contribuyan 
                al desarrollo socioeconómico de la región, fortaleciendo los lazos 
                comunitarios y promoviendo la excelencia académica.
              </p>
            </div>
          </div>

          {/* Programs Section */}
          <div className="relative mt-12 lg:mt-24">
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#2f2382] transform rotate-45" />
            <div className="relative bg-white p-8 rounded-lg shadow-xl border border-[#2f2382]/10">
              <h2 className="text-3xl font-bold text-[#2f2382] mb-6">Oferta Académica</h2>
              <ul className="space-y-4">
                {[
                  "Educación",
                  "Psicología",
                  "Derecho",
                  "Contabilidad",
                  "Administración de Empresas",
                  "Mercadotecnia"
                ].map((program, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-[#2f2382] mr-3" />
                    <span className="text-gray-700">{program}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}