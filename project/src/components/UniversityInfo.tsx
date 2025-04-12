import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UniversidadSection: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Content with sophisticated animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 order-1 space-y-8"
          >
            <div>
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: "100px" }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-0.5 bg-[#003087] mb-6"
              ></motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              >
                UNIVERSIDAD
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-gray-600 font-medium leading-relaxed"
              >
                UASD - Centro San Juan de la Maguana
              </motion.p>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-gray-700 leading-relaxed"
            >
              Fundado en 1995, el Centro UASD San Juan de la Maguana es una extensión de la Universidad Autónoma de Santo Domingo, 
              la primera universidad del Nuevo Mundo. El centro ha crecido significativamente desde su fundación, convirtiéndose en un pilar fundamental
               para el desarrollo académico y profesional de la región sur del país. Ofrece múltiples carreras en distintas áreas del conocimiento, 
               atendiendo a miles de estudiantes de San Juan y provincias circundantes, contribuyendo así al desarrollo social, cultural y económico 
               de toda la región.
            </motion.p>
            
            <div className="space-y-4">
              <Link to="/inicio/historia" className="flex items-center text-[#003087] border-b border-gray-200 py-2 group transition-all duration-300">
                <span>Historia de la Universidad</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link 
  to="/TourVirtual" 
  className="flex items-center text-[#003087] border-b border-gray-200 py-2 group transition-all duration-300"
>
  <span>Tour Virtual</span>
  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
</Link>
              
              <Link to="/inicio/consejo-directivo" className="flex items-center text-[#003087] border-b border-gray-200 py-2 group transition-all duration-300">
                <span>Consejo Directivo
                </span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link
                to="/inicio/proyectos"
                className="group inline-flex items-center px-6 py-3 bg-[#003087] hover:bg-[#00246d] text-white rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-blue-900/25"
              >
                <span>Proyectos y Resoluciones</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Image container with effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="w-full lg:w-1/2 order-2"
          >
            <div className="relative">
              {/* Decorative frame */}
              {/*<div className="absolute -inset-4 rounded-xl border border-[#003087]/20 z-0"></div>
              
              {/* Image with mask and effects */}
              <div className="relative rounded-lg overflow-hidden shadow-2xl z-10">
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#003087]/90 via-[#003087]/60 to-transparent z-10"></div>
                
                {/* Dot pattern overlay */}
                <div className="absolute inset-0 z-20 opacity-5 mix-blend-overlay" 
                  style={{ 
                    backgroundImage: 'radial-gradient(#000000 0.5px, transparent 0.5px)',
                    backgroundSize: '8px 8px' 
                  }}>
                </div>
                
                <img 
                  src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/2.jpg"
                  alt="UASD Centro San Juan" 
                  className="w-full aspect-[3/3] object-cover object-center"
                />
                
                {/* Top graphic element */}
                <div className="absolute top-6 left-6 flex items-center z-20">
                  <div className="w-2 h-2 rounded-full bg-[#003087] mr-2"></div>
                  <div className="w-12 h-px bg-[#003087]/60"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UniversidadSection;