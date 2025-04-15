import React from 'react';
import { featuredServices } from '../data/staticData';

const QuickLinks: React.FC = () => {
  return (
    <section className="quick-links bg-white p-5 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0">
        {featuredServices.map((service, index) => {
          // Definir clases de bordes para móvil y sm (cuadrícula 2x2)
          const mobileAndSmBorders = [
            index % 2 === 0 ? 'border-r border-gray-200' : '', // Borde derecho en columnas pares (0, 2)
            index < 2 ? 'border-b border-gray-200' : '',       // Borde inferior en filas superiores (0, 1)
          ].join(' ').trim();

          // Definir clases de bordes para lg (cuadrícula 4x1)
          const lgBorders = [
            index < featuredServices.length - 1 ? 'border-r border-gray-200' : '', // Borde derecho en todos menos el último
            'border-b-0', // Asegurar que no haya borde inferior en lg
          ].join(' ').trim();

          return (
            <a
              key={index}
              href={service.link}
              className={`group flex flex-col items-center text-center py-4 relative 
                ${mobileAndSmBorders} 
                sm:${mobileAndSmBorders} 
                lg:${lgBorders}`}
            >
              <div className="text-lg text-gray-700 group-hover:text-[#003087] transition-colors duration-300">
                {service.title}
              </div>
              <div className="mt-2 flex justify-center">
                <span className="arrow text-[#003087] text-[30px] transform transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {service.description}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default QuickLinks;