// src/components/Events.tsx  (Director / Leadership section)
// Redesign v5 — Réplica del patrón "Office of the President": foto limpia sin
// overlay + panel gris claro con serif negro. Vista única, sin scroll-stack.
// Imagen a 1714×1234 (aspect-ratio real de Harvard OOP).
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const HEADING_ID = 'director-section-heading';

const PHOTO_ASPECT = '1714 / 1234';
const C_INK   = '#1a1a1a';
const C_MUTED = '#3a3a3a';
const C_PANEL = '#e7e6e3';

const Events: React.FC = () => {
  useEvents();

  return (
    <section aria-labelledby={HEADING_ID} style={{ backgroundColor: C_PANEL }}>
      <div className="flex flex-col lg:flex-row lg:items-stretch">

        {/* ── Foto — limpia, sin overlay ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: SPRING }}
          className="relative overflow-hidden w-full lg:w-1/2 flex-shrink-0"
          style={{ aspectRatio: PHOTO_ASPECT }}
        >
          <img
            src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png"
            alt="Directora, UASD Recinto San Juan"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'top center' }}
            draggable={false}
          />
        </motion.div>

        {/* ── Panel de texto — gris claro, serif negro, sin adornos ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: SPRING, delay: 0.1 }}
          className="flex-1 flex flex-col justify-center
                     px-8 sm:px-12 lg:px-16 xl:px-20 py-14 lg:py-0"
        >
          <h2
            id={HEADING_ID}
            className="mb-6"
            style={{
              fontFamily:    "'Fraunces', 'Libre Baskerville', Georgia, serif",
              fontWeight:    500,
              fontSize:      'clamp(1.9rem, 3.2vw, 2.9rem)',
              color:         C_INK,
              letterSpacing: '-0.01em',
              lineHeight:    '1.18',
            }}
          >
            Bienvenido al Despacho de la Directora
          </h2>

          <p
            className="mb-8"
            style={{
              color:      C_MUTED,
              fontSize:   'clamp(0.95rem, 1.05vw, 1.05rem)',
              lineHeight: '1.65',
              maxWidth:   '46ch',
            }}
          >
            "Comprometidos con la excelencia académica y el desarrollo integral
            de la región sur de la República Dominicana."
          </p>

          <Link to="/director/despacho" className="w-fit">
            <motion.div
              className="inline-flex items-center gap-3"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <motion.span
                className="flex-shrink-0 rounded-full flex items-center justify-center"
                style={{ width: 34, height: 34, backgroundColor: '#6b7280' }}
                variants={{ rest: { rotate: 0 }, hover: { rotate: 8 } }}
                transition={{ duration: 0.25, ease: SPRING }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.span>
              <span className="relative">
                <span
                  className="font-semibold"
                  style={{ fontSize: '0.95rem', color: C_INK }}
                >
                  Conocer más sobre la Directora
                </span>
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-0.5 h-px w-full"
                  style={{ backgroundColor: C_INK, transformOrigin: 'left' }}
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.35, ease: SPRING }}
                />
              </span>
            </motion.div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default Events;
