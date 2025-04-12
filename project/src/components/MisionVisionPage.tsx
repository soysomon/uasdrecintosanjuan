import React from 'react';
import { motion } from 'framer-motion';

// Valores simplificados sin íconos
const values = [
  {
    title: "Excelencia Académica",
    description: "Compromiso con los más altos estándares educativos"
  },
  {
    title: "Inclusión",
    description: "Educación accesible para todos los sectores sociales"
  },
  {
    title: "Ética",
    description: "Formación basada en principios morales sólidos"
  },
  {
    title: "Responsabilidad Social",
    description: "Compromiso con el desarrollo de la comunidad"
  },
  {
    title: "Innovación",
    description: "Búsqueda constante de nuevas soluciones"
  },
  {
    title: "Calidad Educativa",
    description: "Excelencia en la formación profesional"
  },
  {
    title: "Colaboración",
    description: "Trabajo en equipo y cooperación institucional"
  }
];

export function MisionVisionPage() {
  // Color principal: Azul constitucional
  const primaryColor = '#003087';
  // Color secundario para el hero (un azul más profundo pero complementario)
  const heroColor = '#001F54';
  
  return (
    <div className="min-h-screen bg-white">
      {/* Espaciador para el nav */}
      <div className="pt-24 md:pt-28">
        {/* Hero Section con motion figures */}
        <div className="relative h-[60vh] bg-[#001F54] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/mision-vision.jpg"
              alt="UASD Misión y Visión"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#001F54]/70 to-[#001F54]/90" />
          
          {/* Animated geometric shapes */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/4 left-0 w-96 h-96 bg-white/10"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full"
          />
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: -45 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="absolute top-0 right-1/3 w-64 h-64 bg-white/10"
          />

          <div className="relative z-10 max-w-6xl mx-auto h-full flex items-center">
            <div className="px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <h1 className="text-5xl font-light tracking-tight text-white leading-tight mb-6">
                  Misión, Visión y Valores
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-xl font-light text-white">
                  Construyendo el futuro de la educación superior en la región sur
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Misión Section */}
            <div>
              <div className="border-t-2 border-[#003087] pt-6">
                <h2 className="text-2xl font-medium text-gray-900 mb-6">Misión</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Formar profesionales críticos y creativos, que contribuyan al desarrollo sostenible, 
                  la defensa del medio ambiente, las buenas prácticas institucionales, y la construcción 
                  de una sociedad democrática y más justa.
                </p>
              </div>
            </div>

            {/* Visión Section */}
            <div>
              <div className="border-t-2 border-[#003087] pt-6">
                <h2 className="text-2xl font-medium text-gray-900 mb-6">Visión</h2>
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
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Valores Institucionales</h2>
            <div className="w-16 h-1 bg-[#003087] mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mb-12">
              Nuestros valores fundamentales guían cada aspecto de nuestra labor educativa
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {values.map((value, index) => (
                <div key={index} className="border-t border-gray-200 pt-4">
                  <h3 className="text-xl font-medium text-[#003087] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}