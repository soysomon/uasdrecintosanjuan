import React from 'react';
import { 
  Target, 
  Eye, 
  Heart,
  BookOpen,
  Users,
  Scale,
  Globe2,
  Lightbulb,
  GraduationCap,
  Handshake
} from 'lucide-react';

const values = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Excelencia Académica",
    description: "Compromiso con los más altos estándares educativos"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Inclusión",
    description: "Educación accesible para todos los sectores sociales"
  },
  {
    icon: <Scale className="w-6 h-6" />,
    title: "Ética",
    description: "Formación basada en principios morales sólidos"
  },
  {
    icon: <Globe2 className="w-6 h-6" />,
    title: "Responsabilidad Social",
    description: "Compromiso con el desarrollo de la comunidad"
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Innovación",
    description: "Búsqueda constante de nuevas soluciones"
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Calidad Educativa",
    description: "Excelencia en la formación profesional"
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Colaboración",
    description: "Trabajo en equipo y cooperación institucional"
  }
];

export function MisionVisionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#2f2382] py-24">
        <div className="absolute inset-0">
          {/* Geometric Patterns */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 transform translate-x-1/3 translate-y-1/3 rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <br></br>
        <br></br>
        <br></br>
          <h1 className="text-5xl font-bold text-white mb-6">
            Misión, Visión y Valores
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Construyendo el futuro de la educación superior en la región sur
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Misión Section */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2f2382] to-[#2f2382]/60 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-white rounded-lg shadow-xl p-8 border border-[#2f2382]/20">
              <div className="flex items-center mb-6">
                <Target className="w-10 h-10 text-[#2f2382] mr-4" />
                <h2 className="text-3xl font-bold text-[#2f2382]">Misión</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Formar profesionales críticos y creativos, que contribuyan al desarrollo sostenible, 
                la defensa del medio ambiente, las buenas prácticas institucionales, y la construcción 
                de una sociedad democrática y más justa.
              </p>
            </div>
          </div>

          {/* Visión Section */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2f2382]/60 to-[#2f2382] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-white rounded-lg shadow-xl p-8 border border-[#2f2382]/20">
              <div className="flex items-center mb-6">
                <Eye className="w-10 h-10 text-[#2f2382] mr-4" />
                <h2 className="text-3xl font-bold text-[#2f2382]">Visión</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Ser un recinto universitario modelo en la formación de profesionales éticos y 
                competentes, reconocido por la calidad de sus aportes al desarrollo científico, 
                tecnológico, social y cultural de la región sur.
              </p>
            </div>
          </div>
        </div>

        {/* Valores Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-[#2f2382] mr-4" />
              <h2 className="text-4xl font-bold text-[#2f2382]">Valores</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestros valores fundamentales guían cada aspecto de nuestra labor educativa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-lg p-6 transition-all duration-300 hover:shadow-xl border border-[#2f2382]/20"
              >
                <div className="absolute top-0 left-0 w-2 h-2 bg-[#2f2382] transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#2f2382] transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#2f2382] transform -translate-x-1/2 translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#2f2382] transform translate-x-1/2 translate-y-1/2" />
                
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#2f2382]/10 rounded-lg text-[#2f2382]">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#2f2382] ml-4">
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}