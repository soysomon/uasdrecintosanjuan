// src/components/UniversityInfo.tsx
// Redesign: full-bleed split — panel izquierdo oscuro (#001A50) + imagen derecha full-height.
// Estilo institucional: Playfair Display italic, etiqueta dorada, texto blanco, nav rows oscuros.
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const HEADING_ID = 'university-section-heading';

const NAV_LINKS = [
  { label: 'Historia de la Universidad', href: '/inicio/historia' },
  { label: 'Tour Virtual',               href: '/TourVirtual' },
  { label: 'Consejo Directivo',          href: '/inicio/consejo-directivo' },
];

const containerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.10, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] } },
};

const UniversidadSection: React.FC = () => {
  return (
    <section
      aria-labelledby={HEADING_ID}
      style={{
        display:   'flex',
        width:     '100%',
        minHeight: '420px',
        overflow:  'hidden',
      }}
    >
      {/* ── Panel izquierdo — oscuro ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        style={{
          flex:            '0 0 50%',
          backgroundColor: '#001A50',
          padding:         'clamp(3rem, 6vw, 4.5rem) clamp(2.5rem, 5vw, 5rem)',
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'center',
          gap:             '1.5rem',
        }}
      >
        {/* Eyebrow label */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize:      '0.625rem',
            fontWeight:    700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         '#C9940A',
            margin:        0,
          }}
        >
          Sobre el Recinto
        </motion.p>

        {/* Heading */}
        <motion.h2
          id={HEADING_ID}
          variants={itemVariants}
          style={{
            fontFamily:    '"Playfair Display", Georgia, serif',
            fontStyle:     'italic',
            fontSize:      'clamp(2rem, 3.5vw, 3rem)',
            fontWeight:    700,
            letterSpacing: '-0.03em',
            lineHeight:    1.08,
            color:         '#FFFFFF',
            margin:        0,
          }}
        >
          Nuestra Historia,<br />Nuestra Misión
        </motion.h2>

        {/* Body */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize:   '0.9375rem',
            fontWeight: 400,
            lineHeight: 1.72,
            color:      'rgba(255,255,255,0.68)',
            margin:     0,
            maxWidth:   '52ch',
          }}
        >
          Fundado en 1995, el Recinto UASD San Juan de la Maguana es pilar del desarrollo
          académico y profesional de la región sur. Más de 8,400 estudiantes construyen
          su futuro en nuestras aulas cada año.
        </motion.p>

        {/* Nav links */}
        <motion.nav
          variants={itemVariants}
          aria-label="Navegación de sección Universidad"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.12)',
            margin:    0,
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              to={link.href}
              className="group relative flex items-center justify-between overflow-hidden"
              style={{
                borderBottom:   '1px solid rgba(255,255,255,0.10)',
                padding:        '0.875rem 0',
                fontSize:       '0.875rem',
                fontWeight:     500,
                color:          'rgba(255,255,255,0.80)',
                textDecoration: 'none',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Hover fill */}
              <span
                aria-hidden="true"
                style={{
                  position:        'absolute',
                  inset:           0,
                  transform:       'translateX(-101%)',
                  backgroundColor: 'rgba(201,148,10,0.10)',
                  transition:      'transform 0.30s cubic-bezier(0.16,1,0.3,1)',
                }}
                className="group-hover:[transform:translateX(0)]"
              />

              <span
                className="relative z-10 flex items-center"
                style={{ gap: '0.75rem' }}
              >
                <span
                  style={{
                    fontSize:      '0.55rem',
                    fontWeight:    800,
                    letterSpacing: '0.12em',
                    color:         '#C9940A',
                    minWidth:      '1.5rem',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {link.label}
              </span>

              <ArrowRight
                className="relative z-10 flex-shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
                style={{ width: 14, height: 14, color: '#C9940A' }}
                aria-hidden="true"
              />
            </Link>
          ))}
        </motion.nav>

        {/* CTA row */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}
        >
          <Link
            to="/inicio/proyectos"
            style={{
              display:         'inline-flex',
              alignItems:      'center',
              gap:             '0.5rem',
              backgroundColor: '#C9940A',
              color:           '#FFFFFF',
              padding:         '0.75rem 1.75rem',
              fontSize:        '0.8125rem',
              fontWeight:      700,
              textDecoration:  'none',
              letterSpacing:   '0.02em',
              transition:      'background-color 0.18s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#B8830A')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#C9940A')}
          >
            Proyectos y Resoluciones
            <ArrowRight style={{ width: 14, height: 14 }} aria-hidden="true" />
          </Link>

          <Link
            to="/inicio/historia"
            style={{
              fontSize:       '0.8125rem',
              fontWeight:     600,
              color:          'rgba(255,255,255,0.60)',
              textDecoration: 'none',
              transition:     'color 0.18s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}
          >
            Conocer más →
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Panel derecho — imagen full-height ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.1, ease: SPRING, delay: 0.08 }}
        style={{
          flex:     '0 0 50%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/2.jpg"
          alt="Campus UASD Recinto San Juan de la Maguana"
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            objectPosition: 'center',
            display:    'block',
          }}
          loading="lazy"
        />

        {/* Subtle dark vignette left edge — transición suave al panel oscuro */}
        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(to right, rgba(0,26,80,0.28) 0%, transparent 30%)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </section>
  );
};

export default UniversidadSection;
