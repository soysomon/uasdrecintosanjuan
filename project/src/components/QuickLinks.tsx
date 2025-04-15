import React from 'react';
import { featuredServices } from '../data/staticData';

const QuickLinks: React.FC = () => {
  return (
    <section className="quick-links bg-white p-5 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0">
        {featuredServices.map((service, index) => (
          <a
            key={index}
            href={service.link}
            className={`group flex flex-col items-center text-center py-4 relative 
              ${index % 2 === 0 ? 'border-r border-gray-200 sm:border-r sm:border-gray-200' : ''} 
              ${index < 2 ? 'border-b border-gray-200 sm:border-b sm:border-gray-200' : ''} 
              lg:${index < featuredServices.length - 1 ? 'border-r border-gray-200' : ''} 
              lg:border-b-0`}
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
        ))}
      </div>
    </section>
  );
};

export default QuickLinks;