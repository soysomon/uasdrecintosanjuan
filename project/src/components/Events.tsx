import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { motion } from 'framer-motion';
import { BookOpen, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events: React.FC = () => {
  const events = useEvents();

  return (
    <>
      {/* Director Profile Section - Heidelberg University Style */}
      <section className="py-24 bg-gradient-to-br from-[#051c45] via-[#002a75] to-[#001c50] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        <div className="absolute -top-[500px] -right-[300px] w-[800px] h-[800px] rounded-full bg-blue-400/5 blur-3xl"></div>
        <div className="absolute -bottom-[300px] -left-[200px] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Image container with effects */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="w-full lg:w-1/2 order-2 lg:order-1"
            >
              {/* Web Version (sm and above) */}
              <div className="hidden sm:block relative">
                {/* Decorative frame */}
                <div className="absolute -inset-4 rounded-xl border border-blue-400/20 z-0"></div>
                
                {/* Image with mask and effects */}
                <div className="relative rounded-lg overflow-hidden shadow-2xl z-10">
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#051c45]/90 via-[#051c45]/60 to-transparent z-10"></div>
                  {/* Dot pattern overlay */}
                  <div className="absolute inset-0 z-20 opacity-5 mix-blend-overlay" 
                    style={{ 
                      backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)',
                      backgroundSize: '8px 8px' 
                    }}>
                  </div>
                  
                  <img 
                    src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png"
                    alt="Dr. Carlos Manuel Sánchez De Óleo" 
                    className="w-full aspect-[3/4] object-cover object-center"
                  />
                  
                  {/* Top graphic element */}
                  <div className="absolute top-6 left-6 flex items-center z-30">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                    <div className="w-12 h-px bg-blue-400/60"></div>
                  </div>
                  
                  {/* Bottom text */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                    <h3 className="text-2xl font-bold text-white">Dr. Carlos Manuel Sánchez De Óleo</h3>
                    <p className="text-blue-200 mt-2 font-medium">Director UASD – Centro San Juan</p>
                  </div>
                </div>
              </div>

              {/* Mobile Version (below sm) */}
              <div className="sm:hidden">
                <div className="relative">
                  {/* Decorative frame */}
                  <div className="absolute -inset-4 rounded-xl border border-blue-400/20 z-0"></div>
                  
                  {/* Image with mask and effects */}
                  <div className="relative rounded-lg overflow-hidden shadow-2xl z-10">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#051c45]/90 via-[#051c45]/60 to-transparent z-10"></div>
                    {/* Dot pattern overlay */}
                    <div className="absolute inset-0 z-20 opacity-5 mix-blend-overlay" 
                      style={{ 
                        backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)',
                        backgroundSize: '8px 8px' 
                      }}>
                    </div>
                    
                    <img 
                      src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png"
                      alt="Dr. Carlos Manuel Sánchez De Óleo" 
                      className="w-full aspect-[3/4] object-cover object-center"
                    />
                    
                    {/* Top graphic element */}
                    <div className="absolute top-6 left-6 flex items-center z-30">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                      <div className="w-12 h-px bg-blue-400/60"></div>
                    </div>
                    
                    {/* Bottom text */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                      <h3 className="text-2xl font-bold text-white">Dr. Carlos Manuel Sánchez De Óleo</h3>
                      <p className="text-blue-200 mt-2 font-medium">Director UASD – Centro San Juan</p>
                    </div>
                  </div>
                </div>
                
                {/* Academic info in mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: 0.4, 
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1] 
                  }}
                  className="bg-white p-4 rounded-lg shadow-md mt-4 mx-6"
                >
                  <div className="flex items-center mb-3">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mr-3">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900">Formación Académica</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm pl-4">
                    <li className="relative before:absolute before:top-2.5 before:left-[-1rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue-500">
                      <span className="font-medium">Doctorado en Matemáticas</span>
                      <p className="text-gray-500">Universidad Politécnica de Valencia</p>
                    </li>
                    <li className="relative before:absolute before:top-2.5 before:left-[-1rem] before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue-500">
                      <span className="font-medium">Maestría en Física Aplicada</span>
                      <p className="text-gray-500">Universidad de Barcelona</p>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Content with sophisticated animations */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 order-1 lg:order-2 space-y-8"
            >
              <div>
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  whileInView={{ opacity: 1, width: "100px" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-0.5 bg-blue-400 mb-6"
                ></motion.div>
                
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block px-4 py-1 rounded-full border border-blue-400/30 text-blue-200 text-sm font-medium mb-4"
                >
                  Liderazgo Institucional
                </motion.span>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
                >
                  Comprometido con la <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">excelencia académica</span>
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg text-blue-100 font-medium leading-relaxed"
                >
                  Director UASD – Centro San Juan de la Maguana
                </motion.p>
              </div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg text-white/80 leading-relaxed"
              >
                Maestro de la Universidad Autónoma de Santo Domingo desde 2005, el Dr. Sánchez De Óleo 
                ha dedicado su trayectoria a la transformación de la educación superior en la región. 
                Su visión innovadora ha impulsado importantes avances en infraestructura, calidad 
                educativa y vinculación comunitaria.
              </motion.p>
              
              {/* Achievement card with glassmorphism effect */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-6 rounded-lg"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Award className="w-5 h-5 text-blue-300" />
                  </div>
                  <h4 className="font-semibold text-white text-lg">Logros Destacados</h4>
                </div>
                
                <ul className="space-y-3 pl-12 relative">
                  <div className="absolute top-0 bottom-0 left-5 w-px bg-gradient-to-b from-blue-400/40 via-blue-400/10 to-transparent"></div>
                  
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="relative"
                  >
                    <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-blue-400"></div>
                    <p className="text-white/90 text-[15px]">Director del Proyecto LIMA para la innovación académica</p>
                  </motion.li>
                  
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="relative"
                  >
                    <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-blue-400"></div>
                    <p className="text-white/90 text-[15px]">Colaborador investigador en CERN, Ginebra</p>
                  </motion.li>
                  
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                    className="relative"
                  >
                    <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-blue-400"></div>
                    <p className="text-white/90 text-[15px]">Premio Nacional a la Excelencia Académica 2023</p>
                  </motion.li>
                </ul>
              </motion.div>
              
              {/* Academic information card for web version - Positioned correctly on the page */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="hidden sm:block backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-6 rounded-lg"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-300" />
                  </div>
                  <h4 className="font-semibold text-white text-lg">Formación Académica</h4>
                </div>
                
                <ul className="space-y-3 pl-12 relative">
                  <div className="absolute top-0 bottom-0 left-5 w-px bg-gradient-to-b from-blue-400/40 via-blue-400/10 to-transparent"></div>
                  
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="relative"
                  >
                    <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-blue-400"></div>
                    <p className="text-white/90 text-[15px]">Doctorado en Matemáticas</p>
                    <p className="text-white/70 text-[13px]">Universidad Politécnica de Valencia</p>
                  </motion.li>
                  
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                    className="relative"
                  >
                    <div className="absolute left-[-24px] top-1 w-3 h-3 rounded-full bg-blue-400"></div>
                    <p className="text-white/90 text-[15px]">Maestría en Física Aplicada</p>
                    <p className="text-white/70 text-[13px]">Universidad de Barcelona</p>
                  </motion.li>
                </ul>
              </motion.div>
              
              {/* Button with elegant animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link
                  to="/director/despacho"
                  className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  <span>Conocer más sobre el Director</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;