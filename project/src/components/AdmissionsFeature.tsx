// src/components/AdmissionsFeature.tsx
// Redesign: full-bleed split — panel izquierdo claro (#FAFAF8) + carrusel de campus derecho.
// Tipografía editorial: Playfair Display italic, etiqueta azul, acento dorado, filas de stats limpias.
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import iconGrado      from '../assets/icons/Grado.svg';
import iconAdmisiones from '../assets/icons/Admiciones.svg';
import iconPostgrado  from '../assets/icons/Postgrado-y-educacion-permanente.svg';

const S3 = 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto';

const BG_IMAGES = [
  `${S3}/Entrada+Principal_Recinto_Sanjuan.jpg`,
  `${S3}/recinto-60.jpg`,
  `${S3}/recinto-21.jpg`,
  `${S3}/recinto-45.jpg`,
  `${S3}/recinto-15.jpg`,
  `${S3}/recinto-24.jpg`,
  `${S3}/recinto-42.jpg`,
  `${S3}/recinto-11.jpg`,
];

const SLIDE_DURATION = 6000;

const FACTS: { icon: string; label: string; detail: string }[] = [
  { icon: iconGrado,      label: '71 programas',      detail: 'Grado y postgrado disponibles' },
  { icon: iconAdmisiones, label: 'Matrícula abierta', detail: 'Período 2025–2026' },
  { icon: iconPostgrado,  label: 'Becas disponibles', detail: 'Consulta requisitos de aplicación' },
];

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.70, ease: [0.16, 1, 0.3, 1] } },
};

const AdmissionsFeature: React.FC = () => {
  const [current, setCurrent]   = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const TICK = 50;
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const next = prev + (TICK / SLIDE_DURATION) * 100;
        return next > 100 ? 100 : next;
      });
    }, TICK);
    const slideTimer = setTimeout(() => {
      setCurrent(prev => (prev + 1) % BG_IMAGES.length);
    }, SLIDE_DURATION);
    return () => {
      clearInterval(progressTimer);
      clearTimeout(slideTimer);
    };
  }, [current]);

  return (
    <section
      aria-labelledby="admissions-heading"
      style={{
        display:   'flex',
        width:     '100%',
        minHeight: '540px',
        overflow:  'hidden',
      }}
    >
      {/* ── Panel izquierdo — carrusel de campus ── */}
      <div
        style={{
          flex:     '0 0 50%',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {BG_IMAGES.map((src, idx) => (
          <motion.div
            key={idx}
            style={{ position: 'absolute', inset: 0 }}
            animate={{
              opacity: idx === current ? 1    : 0,
              scale:   idx === current ? 1.06 : 1.0,
            }}
            transition={{
              opacity: { duration: 1.4, ease: [0.4, 0, 0.2, 1] },
              scale:   { duration: 8,   ease: 'linear'           },
            }}
          >
            <img
              src={src}
              alt=""
              style={{
                position:       'absolute',
                inset:          0,
                width:          '100%',
                height:         '100%',
                objectFit:      'cover',
                objectPosition: 'center',
              }}
              loading={idx === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </motion.div>
        ))}

        {/* Vignette derecha — transición suave al panel claro */}
        <div
          style={{
            position:      'absolute',
            inset:         0,
            background:    'linear-gradient(to left, rgba(250,250,248,0.20) 0%, transparent 22%)',
            pointerEvents: 'none',
          }}
        />

        {/* Indicadores del carrusel — esquina inferior izquierda */}
        <div
          style={{
            position: 'absolute',
            bottom:   '1.5rem',
            left:     '1.5rem',
            display:  'flex',
            alignItems: 'center',
            gap:      '0.5rem',
            zIndex:   10,
          }}
        >
          {BG_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Foto ${idx + 1}`}
              style={{
                width:           idx === current ? '28px' : '7px',
                height:          '7px',
                borderRadius:    '999px',
                backgroundColor: idx === current
                  ? 'rgba(255,255,255,0.90)'
                  : 'rgba(255,255,255,0.38)',
                border:          'none',
                cursor:          'pointer',
                padding:         0,
                flexShrink:      0,
                position:        'relative',
                overflow:        'hidden',
                transition:      'width 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {idx === current && (
                <motion.div
                  style={{
                    position:        'absolute',
                    inset:           '0 auto 0 0',
                    borderRadius:    '999px',
                    backgroundColor: '#C9940A',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.05, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Panel derecho — claro ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        style={{
          flex:            '0 0 50%',
          backgroundColor: '#FAFAF8',
          padding:         'clamp(3.5rem, 7vw, 5.5rem) clamp(2.5rem, 5vw, 5.5rem)',
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'center',
        }}
      >
        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize:      '0.625rem',
            fontWeight:    700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         '#003087',
            margin:        '0 0 1.25rem 0',
          }}
        >
          Admisiones · UASD Recinto San Juan
        </motion.p>

        {/* Heading */}
        <motion.h2
          id="admissions-heading"
          variants={itemVariants}
          style={{
            fontFamily:    '"Playfair Display", Georgia, serif',
            fontStyle:     'italic',
            fontSize:      'clamp(2.125rem, 3.8vw, 3.25rem)',
            fontWeight:    700,
            letterSpacing: '-0.03em',
            lineHeight:    1.07,
            color:         '#0A0A14',
            margin:        '0 0 1.25rem 0',
          }}
        >
          Tu futuro empieza<br />aquí. Empieza hoy.
        </motion.h2>

        {/* Gold accent line */}
        <motion.div
          variants={itemVariants}
          aria-hidden="true"
          style={{
            width:           '48px',
            height:          '3px',
            backgroundColor: '#C9940A',
            margin:          '0 0 1.875rem 0',
            flexShrink:      0,
          }}
        />

        {/* Body */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize:   '0.9375rem',
            lineHeight: 1.78,
            color:      'rgba(10,10,20,0.60)',
            margin:     '0 0 2rem 0',
            maxWidth:   '50ch',
          }}
        >
          La Universidad Autónoma de Santo Domingo — Recinto San Juan forma
          profesionales comprometidos con el desarrollo de la región. Ingresa
          a la primera universidad del Nuevo Mundo.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:         '1.25rem',
            flexWrap:    'wrap',
            marginBottom:'2.5rem',
          }}
        >
          <a
            href="https://uasd.edu.do/admisiones/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:         'inline-flex',
              alignItems:      'center',
              gap:             '0.5rem',
              backgroundColor: '#003087',
              color:           '#FFFFFF',
              padding:         '0.8125rem 1.875rem',
              fontSize:        '0.8125rem',
              fontWeight:      700,
              textDecoration:  'none',
              letterSpacing:   '0.01em',
              transition:      'background-color 0.18s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#001f5a')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#003087')}
          >
            Iniciar mi solicitud
            <ArrowRight style={{ width: 14, height: 14 }} aria-hidden="true" />
          </a>

          <a
            href="/carreras/grado"
            style={{
              fontSize:       '0.8125rem',
              fontWeight:     600,
              color:          'rgba(10,10,20,0.45)',
              textDecoration: 'none',
              transition:     'color 0.18s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#003087')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,20,0.45)')}
          >
            Ver oferta académica →
          </a>
        </motion.div>

        {/* Fact rows */}
        <motion.div
          variants={itemVariants}
          style={{ borderTop: '1px solid rgba(10,10,20,0.09)' }}
        >
          {FACTS.map((fact, i) => (
            <div
              key={i}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '1rem',
                padding:      '0.875rem 0',
                borderBottom: '1px solid rgba(10,10,20,0.07)',
              }}
            >
              <div
                style={{
                  width:           '40px',
                  height:          '40px',
                  flexShrink:      0,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  backgroundColor: 'rgba(0,48,135,0.07)',
                }}
              >
                <img
                  src={fact.icon}
                  alt=""
                  aria-hidden="true"
                  style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                />
              </div>
              <div>
                <p style={{
                  fontSize:      '0.875rem',
                  fontWeight:    700,
                  color:         '#0A0A14',
                  margin:        '0 0 0.125rem 0',
                  letterSpacing: '-0.01em',
                }}>
                  {fact.label}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(10,10,20,0.46)', margin: 0 }}>
                  {fact.detail}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

      </motion.div>


    </section>
  );
};

export default AdmissionsFeature;
