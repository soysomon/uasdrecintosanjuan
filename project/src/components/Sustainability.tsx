import React from 'react';

const Sustainability: React.FC = () => {
  return (
    <section className="research-institutions flex flex-col md:flex-row bg-white py-12 px-4 md:px-8 lg:px-12">
     {/* Imagen del edificio - lado izquierdo */}
<div className="w-full md:w-1/2 md:pr-8">
  <div className="relative overflow-hidden">
    <img 
      src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-11.jpg" 
      alt="Edificio de Investigación UASD" 
      className="w-full aspect-[16/14] object-cover object-center"
    />
  </div>

      </div>

      {/* Contenido informativo - lado derecho */}
      <div className="w-full md:w-1/2 pt-8 md:pt-0 flex flex-col">
        <h2 className="text-4xl md:text-5xl font-bold text-[#333] mb-6 border-l-8 border-[#cc0033] pl-4">
          INNOVACIONES
        </h2>

        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Bajo el liderazgo del Dr. Carlos Manuel Sánchez De Óleo, el Recinto San Juan de la UASD 
          impulsa la inclusión tecnológica, el desarrollo local y la modernización de infraestructuras 
          para formar profesionales preparados para los retos del futuro.
        </p>

        <div className="flex flex-col space-y-16 mt-auto">
          {/* Enlaces de navegación con estilo Bauhaus */}
          <a href="/innovaciones" className="flex items-center justify-between group p-4 border-l-4 border-[#003087] hover:bg-gray-50 transition-all">
            <span className="text-lg font-medium">Inclusión Tecnológica y Digitalización</span>
            <span className="text-[#003087] group-hover:translate-x-2 transition-transform">→</span>
          </a>
          
          <a href="/innovaciones" className="flex items-center justify-between group p-4 border-l-4 border-[#003087] hover:bg-gray-50 transition-all">
            <span className="text-lg font-medium">Mejoras en Infraestructura y Recursos Educativos</span>
            <span className="text-[#003087] group-hover:translate-x-2 transition-transform">→</span>
          </a>
          
          <a href="/innovaciones" className="flex items-center justify-between group p-4 border-l-4 border-[#003087] hover:bg-gray-50 transition-all">
            <span className="text-lg font-medium">Servicios y Bienestar Estudiantil</span>
            <span className="text-[#003087] group-hover:translate-x-2 transition-transform">→</span>
          </a>

          <a href="/innovaciones" className="flex items-center justify-between bg-[#cc0033] text-white p-4 mt-4 group hover:bg-[#aa0022] transition-colors">
            <span className="text-lg font-medium">Descubrir Innovaciones</span>
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Sustainability;