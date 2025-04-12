import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PhilosophyCard {
  id: string;
  title: string;
  description: string;
  details: string[];
  color: string;
}

const philosophyCards: PhilosophyCard[] = [
  {
    id: 'naturaleza',
    title: 'Naturaleza Institucional',
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
    description: 'Nuestro enfoque integral para la formación de profesionales.',
    details: [
      'Docencia de excelencia',
      'Investigación innovadora',
      'Extensión social',
      'Desarrollo del pensamiento crítico',
      'Fomento de la creatividad'
    ],
    color: '#003087'
  },
  {
    id: 'principios',
    title: 'Principios Fundamentales',
    description: 'Los valores que guían nuestras acciones y decisiones.',
    details: [
      'Autonomía académica y administrativa',
      'Democracia participativa',
      'Excelencia en todas las áreas',
      'Compromiso con la verdad',
      'Responsabilidad social'
    ],
    color: '#003087'
  },
  {
    id: 'compromiso',
    title: 'Compromiso Institucional',
    description: 'Nuestra responsabilidad con la sociedad y el desarrollo.',
    details: [
      'Formación integral de profesionales',
      'Contribución al desarrollo nacional',
      'Preservación de la identidad cultural',
      'Fomento de la innovación',
      'Servicio a la comunidad'
    ],
    color: '#003087'
  }
];

export function PhilosophyPage() {
  const [selectedCard, setSelectedCard] = useState<PhilosophyCard | null>(null);

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

  // Color principal: Azul constitucional
  const primaryColor = '#003087';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section con espaciador para el nav */}
      <div className="pt-24 md:pt-28">
        <div className="relative h-[60vh] bg-[#003087] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/Filosofia+(2).jpg"
              alt="Filosofía UASD"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#003087]/70 to-[#003087]/90" />
          
          {/* Animated geometric shapes - Mantenidas intactas como se solicitó */}
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
                  Fundamentos Filosóficos
                </h1>
                <div className="w-24 h-1 bg-white mb-6"></div>
                <p className="text-xl font-light text-white">
                  Los principios rectores que guían nuestra misión educativa y compromiso social
                  en la formación de profesionales de excelencia.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Philosophy Cards Grid - Con estilo Heidelberg */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                className="relative cursor-pointer"
                onClick={() => setSelectedCard(card)}
              >
                <div className="border-t-2 border-[#003087] pt-6 hover:bg-gray-50 transition-colors duration-200">
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 mb-6">{card.description}</p>
                  <div className="text-[#003087] font-medium">
                    Ver más →
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modal for detailed view - Simplificado al estilo Heidelberg */}
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
              className="relative bg-white max-w-2xl w-full p-8"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Content */}
              <div className="mb-8">
                <div className="w-16 h-1 bg-[#003087] mb-4"></div>
                <h3 className="text-2xl font-medium text-gray-900 mb-3">{selectedCard.title}</h3>
                <p className="text-gray-600">{selectedCard.description}</p>
              </div>

              {/* Details List */}
              <div className="space-y-4">
                {selectedCard.details.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="w-4 h-px bg-[#003087] mt-3 mr-3"></div>
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