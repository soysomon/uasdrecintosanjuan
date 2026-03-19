// src/components/Events.tsx  (Director / Leadership section)
// Redesign v2 — White / gray editorial, Harvard Office of the President style.
// Stacked-cards-on-scroll implementation preserved:
//   3 full-viewport sticky panels · scale 1→0.93 · transformOrigin: top-center.
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { GraduationCap, ArrowRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PANELS   = 3;
const HEADING_ID = 'director-section-heading';

const ACHIEVEMENTS = [
  'Director del Proyecto LIMA para la innovación académica',
  'Colaborador investigador en CERN, Ginebra',
  'Premio Nacional a la Excelencia Académica 2023',
];

const ACADEMIC_CREDENTIALS = [
  { degree: 'Doctorado en Matemáticas',    institution: 'Universidad Politécnica de Valencia' },
  { degree: 'Maestría en Física Aplicada', institution: 'Universidad de Barcelona' },
];

// Light editorial palette — white → warm off-white → light gray-beige
const PANEL_BG: [string, string, string] = ['#ffffff', '#f5f4f0', '#eceae5'];

const C_DARK    = 'var(--color-text-primary)';
const C_MUTED   = 'rgba(0,0,0,0.52)';
const C_DIVIDER = 'rgba(0,0,0,0.09)';
const C_PRIMARY = 'var(--color-primary)';

/* ── StackPanel ─────────────────────────────────────────────────────── */
function StackPanel({
  index,
  scrollYProgress,
  children,
}: {
  index: number;
  scrollYProgress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const isLast     = index === PANELS - 1;
  const scaleStart = isLast ? 0 : index / (PANELS - 1);
  const scaleEnd   = isLast ? 1 : (index + 1) / (PANELS - 1);
  const scale      = useTransform(scrollYProgress, [scaleStart, scaleEnd], [1, isLast ? 1 : 0.93]);

  return (
    <motion.div
      style={{
        position:        'sticky',
        top:             0,
        height:          '100vh',
        overflow:        'hidden',
        zIndex:          index + 1,
        scale,
        transformOrigin: '50% 0%',
        backgroundColor: PANEL_BG[index],
        borderRadius:    index > 0 ? '16px 16px 0 0' : 0,
        boxShadow:       index > 0 ? '0 -4px 32px rgba(0,0,0,0.07)' : 'none',
        willChange:      'transform',
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Component ──────────────────────────────────────────────────────── */
const Events: React.FC = () => {
  useEvents();

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target:  containerRef,
    offset:  ['start start', 'end end'],
  });

  return (
    <div
      ref={containerRef}
      style={{ height: `${PANELS * 100}vh` }}
      aria-labelledby={HEADING_ID}
    >

      {/* ══════════════════════════════════════════════════════════════
          PANEL 1 — Harvard split: foto izquierda / texto derecha
      ══════════════════════════════════════════════════════════════ */}
      <StackPanel index={0} scrollYProgress={scrollYProgress}>
        <div className="h-full flex flex-col lg:flex-row">

          {/* ── Foto ── */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: SPRING }}
            className="relative overflow-hidden h-[42vh] lg:h-full w-full lg:w-1/2 flex-shrink-0"
          >
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png"
              alt="Dr. Carlos Manuel Sánchez De Óleo, Director UASD Recinto San Juan"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'top center' }}
              draggable={false}
            />

          </motion.div>

          {/* ── Texto ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: SPRING, delay: 0.12 }}
            className="flex-1 flex flex-col justify-center
                       overflow-y-auto lg:overflow-hidden
                       px-7 sm:px-12 lg:px-14 xl:px-20 py-10 lg:py-0"
          >
            <p
              className="section-label mb-5"
              style={{ color: C_PRIMARY, letterSpacing: '0.13em' }}
            >
              Liderazgo Institucional
            </p>

            <h2
              id={HEADING_ID}
              className="font-extrabold mb-6"
              style={{
                fontSize:      'clamp(2rem, 4.2vw, 3.6rem)',
                color:         C_DARK,
                letterSpacing: '-0.033em',
                lineHeight:    '1.05',
              }}
            >
              Bienvenido al Despacho<br className="hidden lg:block" /> del Director
            </h2>

            <p
              className="italic"
              style={{
                color:      C_MUTED,
                fontSize:   'clamp(1rem, 1.3vw, 1.1rem)',
                lineHeight: '1.78',
                maxWidth:   '46ch',
              }}
            >
              "Comprometido con la excelencia académica y el desarrollo integral
              de la región sur de la República Dominicana."
            </p>

            {/* Atribución — nombre y cargo */}
            <div className="mt-4 mb-8" style={{ borderLeft: `2px solid ${C_PRIMARY}`, paddingLeft: '0.875rem' }}>
              <p className="font-bold text-sm leading-tight" style={{ color: C_DARK }}>
                Dr. Carlos Manuel Sánchez De Óleo
              </p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: C_MUTED }}>
                Director · UASD – Centro San Juan
              </p>
            </div>

            {/* CTA — círculo relleno oscuro + texto */}
            <Link
              to="/director/despacho"
              className="group inline-flex items-center gap-3 w-fit"
            >
              <span
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center
                           transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: C_DARK }}
              >
                <ArrowRight
                  size={15}
                  className="text-white transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
              <span
                className="text-sm font-semibold transition-opacity duration-200 group-hover:opacity-60"
                style={{ color: C_DARK }}
              >
                Conocer más sobre el Director
              </span>
            </Link>

            <p
              className="mt-10 uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.20em', color: 'rgba(0,0,0,0.25)' }}
            >
              ↓ Desplaza para conocer su trayectoria
            </p>
          </motion.div>

        </div>
      </StackPanel>

      {/* ══════════════════════════════════════════════════════════════
          PANEL 2 — Bio + Formación académica  (#f5f4f0)
      ══════════════════════════════════════════════════════════════ */}
      <StackPanel index={1} scrollYProgress={scrollYProgress}>
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: SPRING }}
              className="space-y-5"
            >
              <p className="section-label" style={{ color: C_PRIMARY, letterSpacing: '0.13em' }}>
                Trayectoria
              </p>
              <h3
                className="font-extrabold"
                style={{
                  fontSize:      'clamp(1.6rem, 3vw, 2.6rem)',
                  color:         C_DARK,
                  letterSpacing: '-0.026em',
                  lineHeight:    '1.1',
                }}
              >
                Dos décadas impulsando la educación superior dominicana
              </h3>
              <p style={{ color: C_MUTED, lineHeight: '1.85', fontSize: '1rem', maxWidth: '52ch' }}>
                Maestro de la Universidad Autónoma de Santo Domingo desde 2005, el Dr. Sánchez De Óleo
                ha dedicado su trayectoria a la transformación de la educación superior en la región.
                Su visión innovadora ha impulsado importantes avances en infraestructura, calidad
                educativa y vinculación comunitaria.
              </p>
            </motion.div>

            {/* Credentials — lista con flechas, sin tarjeta */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: SPRING, delay: 0.10 }}
            >
              <div className="flex items-center gap-2.5 mb-6">
                <GraduationCap
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: C_PRIMARY }}
                  aria-hidden="true"
                />
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ color: 'rgba(0,0,0,0.40)', letterSpacing: '0.14em' }}
                >
                  Formación Académica
                </p>
              </div>

              <div style={{ borderTop: `1px solid ${C_DIVIDER}`, borderBottom: `1px solid ${C_DIVIDER}` }}>
                {ACADEMIC_CREDENTIALS.map((cred, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-5 py-5"
                    style={i > 0 ? { borderTop: `1px solid ${C_DIVIDER}` } : {}}
                  >
                    <div>
                      <p className="font-semibold text-sm leading-snug" style={{ color: C_DARK }}>
                        {cred.degree}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: C_PRIMARY }}>
                        {cred.institution}
                      </p>
                    </div>
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ border: '1px solid rgba(0,0,0,0.18)' }}
                      aria-hidden="true"
                    >
                      <ArrowRight size={12} style={{ color: C_DARK }} />
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </StackPanel>

      {/* ══════════════════════════════════════════════════════════════
          PANEL 3 — Logros Harvard-style list  (#eceae5)
      ══════════════════════════════════════════════════════════════ */}
      <StackPanel index={2} scrollYProgress={scrollYProgress}>
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start lg:items-center">

            {/* Titular izquierda */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: SPRING }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <Award className="w-4 h-4 flex-shrink-0" style={{ color: C_PRIMARY }} aria-hidden="true" />
                <p className="section-label" style={{ color: C_PRIMARY, letterSpacing: '0.13em' }}>
                  Logros Destacados
                </p>
              </div>
              <h3
                className="font-extrabold"
                style={{
                  fontSize:      'clamp(1.6rem, 3vw, 2.6rem)',
                  color:         C_DARK,
                  letterSpacing: '-0.026em',
                  lineHeight:    '1.1',
                  maxWidth:      '20ch',
                }}
              >
                Reconocimientos que respaldan una visión transformadora
              </h3>
            </motion.div>

            {/* Lista estilo Harvard — divisores finos + flecha circular */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: SPRING, delay: 0.10 }}
              style={{
                borderTop:    `1px solid ${C_DIVIDER}`,
                borderBottom: `1px solid ${C_DIVIDER}`,
              }}
            >
              {ACHIEVEMENTS.map((item, i) => (
                <Link
                  key={i}
                  to="/director/despacho"
                  className="group flex items-center justify-between gap-5 py-5 transition-colors duration-150"
                  style={i > 0 ? { borderTop: `1px solid ${C_DIVIDER}` } : {}}
                >
                  <p
                    className="font-semibold text-sm leading-relaxed transition-colors duration-150 group-hover:underline"
                    style={{ color: C_DARK }}
                  >
                    {item}
                  </p>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                               transition-all duration-150 group-hover:bg-gray-900"
                    style={{ border: '1px solid rgba(0,0,0,0.18)' }}
                    aria-hidden="true"
                  >
                    <ArrowRight
                      size={12}
                      className="transition-colors duration-150 group-hover:text-white"
                      style={{ color: C_DARK }}
                    />
                  </span>
                </Link>
              ))}
            </motion.div>

          </div>
        </div>
      </StackPanel>

    </div>
  );
};

export default Events;
