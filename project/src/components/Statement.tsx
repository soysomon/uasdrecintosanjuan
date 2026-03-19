// src/components/Statement.tsx
// Redesign: banda horizontal compacta — headline izquierda, texto+CTAs derecha.
// Minimalismo institucional: regla dorada superior, sin texturas decorativas.
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] } },
};

const Statement: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-primary)' }}
      aria-labelledby="statement-heading"
    >
      {/* Regla dorada superior */}
      <div
        aria-hidden="true"
        style={{
          position:        'absolute',
          top:             0,
          left:            0,
          right:           0,
          height:          '2px',
          backgroundColor: '#C9940A',
        }}
      />

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          paddingTop:    'clamp(3rem, 6vw, 4.75rem)',
          paddingBottom: 'clamp(3rem, 6vw, 4.75rem)',
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col lg:flex-row lg:items-center"
          style={{ gap: 'clamp(2.5rem, 6vw, 6rem)' }}
        >

          {/* ── Izquierda: eyebrow + headline ── */}
          <div style={{ flex: '0 0 auto', maxWidth: '520px' }}>
            <motion.p
              variants={itemVariants}
              style={{
                fontSize:      '0.625rem',
                fontWeight:    700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         'rgba(201,148,10,0.80)',
                margin:        '0 0 1.25rem 0',
              }}
            >
              UASD · Recinto San Juan · #VamosPorMás
            </motion.p>

            <motion.h2
              id="statement-heading"
              variants={itemVariants}
              className="text-white"
              style={{
                fontFamily:    '"Playfair Display", Georgia, serif',
                fontStyle:     'italic',
                fontSize:      'clamp(2rem, 3.8vw, 3.25rem)',
                fontWeight:    700,
                letterSpacing: '-0.03em',
                lineHeight:    1.06,
                margin:        0,
              }}
            >
              Transformando el Futuro<br />de la Región Sur
            </motion.h2>
          </div>

          {/* Divisor vertical — solo desktop */}
          <motion.div
            variants={itemVariants}
            aria-hidden="true"
            className="hidden lg:block flex-shrink-0"
            style={{
              width:           '1px',
              alignSelf:       'stretch',
              backgroundColor: 'rgba(255,255,255,0.14)',
            }}
          />

          {/* ── Derecha: cuerpo + CTAs ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <motion.p
              variants={itemVariants}
              style={{
                fontSize:   '0.9375rem',
                lineHeight: 1.78,
                color:      'rgba(255,255,255,0.58)',
                margin:     '0 0 2rem 0',
                maxWidth:   '52ch',
              }}
            >
              Construye tu camino académico con la primera universidad del Nuevo Mundo.
              Programas de grado, posgrado y educación continua diseñados para el
              profesional que la región necesita.
            </motion.p>

            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}
            >
              <Link
                to="/carreras/grado"
                style={{
                  display:         'inline-flex',
                  alignItems:      'center',
                  gap:             '0.5rem',
                  backgroundColor: '#C9940A',
                  color:           '#001f5a',
                  padding:         '0.8125rem 1.875rem',
                  fontSize:        '0.8125rem',
                  fontWeight:      700,
                  textDecoration:  'none',
                  letterSpacing:   '0.01em',
                  transition:      'background-color 0.18s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#B8830A')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#C9940A')}
              >
                Oferta Académica
                <ArrowRight style={{ width: 14, height: 14 }} aria-hidden="true" />
              </Link>

              <Link
                to="/academico/admisiones"
                style={{
                  fontSize:       '0.8125rem',
                  fontWeight:     600,
                  color:          'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  transition:     'color 0.18s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                Proceso de Matrícula →
              </Link>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Statement;
