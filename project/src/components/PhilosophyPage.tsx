import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { School, BookOpen, Scale, Globe2, ChevronRight, X } from 'lucide-react';

interface PhilosophyCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  color: string;
}

const philosophyCards: PhilosophyCard[] = [
  {
    id: 'naturaleza',
    title: 'Naturaleza Institucional',
    icon: <School className="w-8 h-8" />,
    description: 'Los fundamentos que definen nuestra identidad como institución educativa.',
    details: [
      'Institución integradora que une a la comunidad académica',
      'Patrimonio social público de alto valor estratégico',
      'Sistema Nacional de Educación Superior Estatal',
      'Compromiso con la excelencia y la innovación'
    ],
    color: '#003087'
  },
  {
    id: 'modelo',
    title: 'Modelo Educativo',
    icon: <BookOpen className="w-8 h-8" />,
    description: 'Nuestro enfoque integral para la formación de profesionales.',
    details: [
      'Docencia de excelencia',
      'Investigación innovadora',
      'Extensión social',
      'Desarrollo del pensamiento crítico',
      'Fomento de la creatividad'
    ],
    color: '#1a237e'
  },
  {
    id: 'principios',
    title: 'Principios Fundamentales',
    icon: <Scale className="w-8 h-8" />,
    description: 'Los valores que guían nuestras acciones y decisiones.',
    details: [
      'Autonomía académica y administrativa',
      'Democracia participativa',
      'Excelencia en todas las áreas',
      'Compromiso con la verdad',
      'Responsabilidad social'
    ],
    color: '#0d47a1'
  },
  {
    id: 'compromiso',
    title: 'Compromiso Institucional',
    icon: <Globe2 className="w-8 h-8" />,
    description: 'Nuestra responsabilidad con la sociedad y el desarrollo.',
    details: [
      'Formación integral de profesionales',
      'Contribución al desarrollo nacional',
      'Preservación de la identidad cultural',
      'Fomento de la innovación',
      'Servicio a la comunidad'
    ],
    color: '#1565c0'
  }
];

export function PhilosophyPage() {
  const [selectedCard, setSelectedCard] = useState<PhilosophyCard | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-[#003087] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://i.ibb.co/4nTPWVLg/filosofia.jpg"
            alt="Filosofía UASD"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#003087]/70 to-[#003087]/90" />
        
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

        <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center">
          <div className="px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-6xl font-bold tracking-tighter text-white leading-none mb-6">
                Fundamentos
                <span className="block">Filosóficos</span>
              </h1>
              <p className="text-xl text-white">
                Los principios rectores que guían nuestra misión educativa y compromiso social
                en la formación de profesionales de excelencia.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Philosophy Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {philosophyCards.map((card, index) => (
            <motion.div
              key={card.id}
              custom={index}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setSelectedCard(card)}
            >
              <div 
                className="relative bg-white rounded-xl p-8 shadow-lg border-2 transition-all duration-300"
                style={{ 
                  borderColor: hoveredCard === card.id ? card.color : 'transparent',
                  transform: `perspective(1000px) rotateX(${hoveredCard === card.id ? '2deg' : '0'}) rotateY(${hoveredCard === card.id ? '2deg' : '0'})`
                }}
              >
                {/* Card Header */}
                <div className="flex items-center mb-6">
                  <div 
                    className="p-3 rounded-lg transition-colors duration-300"
                    style={{ backgroundColor: `${card.color}15` }}
                  >
                    {React.cloneElement(card.icon as React.ReactElement, {
                      className: `w-8 h-8 transition-colors duration-300`,
                      style: { color: card.color }
                    })}
                  </div>
                  <h3 className="text-xl font-bold ml-4 text-gray-900">{card.title}</h3>
                </div>

                {/* Card Content */}
                <p className="text-gray-600 mb-6">{card.description}</p>

                {/* Learn More Button */}
                <div className="flex items-center text-sm font-medium transition-colors duration-300"
                     style={{ color: card.color }}>
                  Ver más
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-2 h-2 rounded-full transition-colors duration-300"
                     style={{ backgroundColor: hoveredCard === card.id ? card.color : '#e5e7eb' }} />
                <div className="absolute top-0 right-0 w-2 h-2 rounded-full transition-colors duration-300"
                     style={{ backgroundColor: hoveredCard === card.id ? card.color : '#e5e7eb' }} />
                <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full transition-colors duration-300"
                     style={{ backgroundColor: hoveredCard === card.id ? card.color : '#e5e7eb' }} />
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full transition-colors duration-300"
                     style={{ backgroundColor: hoveredCard === card.id ? card.color : '#e5e7eb' }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal for detailed view */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-xl max-w-2xl w-full p-8"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>

              {/* Modal Content */}
              <div className="mb-6">
                <div 
                  className="inline-flex items-center justify-center p-3 rounded-lg mb-4"
                  style={{ backgroundColor: `${selectedCard.color}15` }}
                >
                  {React.cloneElement(selectedCard.icon as React.ReactElement, {
                    className: "w-8 h-8",
                    style: { color: selectedCard.color }
                  })}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedCard.title}</h3>
                <p className="text-gray-600">{selectedCard.description}</p>
              </div>

              {/* Details List */}
              <div className="space-y-4">
                {selectedCard.details.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div 
                      className="w-2 h-2 mt-2 rounded-full mr-3"
                      style={{ backgroundColor: selectedCard.color }}
                    />
                    <p className="text-gray-700">{detail}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}