// src/components/Events.tsx  (Director / Leadership section)
// Redesign v3 — Ivy League editorial: serif display type, gold-on-navy seal,
// numbered credentials, dramatic dark-navy closing panel.
// Stacked-cards-on-scroll mechanism preserved:
//   3 full-viewport sticky panels · scale 1→0.93 · transformOrigin: top-center.
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
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

// Editorial palette — ivory → warm parchment → deep navy close.
const PANEL_BG: [string, string, string] = ['#fffefb', '#faf6ee', '#0a1730'];

const C_INK     = '#0a1730';
const C_MUTED   = 'rgba(10,23,48,0.56)';
const C_DIVIDER = 'rgba(10,23,48,0.12)';
const C_PRIMARY = 'var(--color-primary)';
const C_GOLD    = 'var(--color-accent)';
const C_GOLD_DK = 'var(--color-accent-dark)';

const SERIF = "'Fraunces', 'Libre Baskerville', Georgia, serif";

/* ── Roman numerals for panel markers ──────────────────────────────── */
const ROMAN = ['I', 'II', 'III'];

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
        borderRadius:    index > 0 ? '20px 20px 0 0' : 0,
        boxShadow:       index > 0 ? '0 -8px 40px rgba(10,23,48,0.16)' : 'none',
        willChange:      'transform',
      }}
    >
      {/* Roman numeral watermark — top-right, present on every panel */}
      <span
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:            'clamp(20px, 3.5vw, 40px)',
          right:          'clamp(20px, 3.5vw, 48px)',
          fontFamily:     SERIF,
          fontStyle:      'italic',
          fontWeight:     400,
          fontSize:       'clamp(1rem, 1.6vw, 1.15rem)',
          letterSpacing:  '0.04em',
          color:          index === 2 ? 'rgba(255,255,255,0.38)' : 'rgba(10,23,48,0.28)',
          zIndex:         5,
        }}
      >
        {ROMAN[index]} / III
      </span>
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
          PANEL 1 — Retrato editorial: foto con marco dorado / texto serif
      ══════════════════════════════════════════════════════════════ */}
      <StackPanel index={0} scrollYProgress={scrollYProgress}>
        <div className="h-full flex flex-col lg:flex-row">

          {/* ── Foto con velo navy + marco dorado ── */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: SPRING }}
            className="relative overflow-hidden h-[46vh] lg:h-full w-full lg:w-[46%] flex-shrink-0"
          >
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png"
              alt="Dr. Carlos Manuel Sánchez De Óleo, Director UASD Recinto San Juan"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'top center' }}
              draggable={false}
            />
            {/* Velo de contraste inferior para la placa de atribución */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(10,23,48,0) 58%, rgba(10,23,48,0.68) 100%)',
              }}
              aria-hidden="true"
            />
            {/* Marco dorado interior — insignia de distinción */}
            <div
              className="absolute pointer-events-none"
              style={{ inset: '14px', border: `1px solid ${C_GOLD}`, opacity: 0.55 }}
              aria-hidden="true"
            />

            {/* Placa de nombre sobre la foto */}
            <div className="absolute left-0 right-0 bottom-0 px-6 sm:px-10 pb-7">
              <p
                style={{
                  fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 'clamp(1.15rem, 1.9vw, 1.5rem)', color: '#ffffff', lineHeight: 1.25,
                }}
              >
                Dr. Carlos Manuel Sánchez De Óleo
              </p>
              <p
                className="uppercase mt-1.5"
                style={{ fontSize: '11px', letterSpacing: '0.2em', color: C_GOLD, fontWeight: 600 }}
              >
                Director · UASD Recinto San Juan
              </p>
            </div>
          </motion.div>

          {/* ── Texto editorial ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: SPRING, delay: 0.12 }}
            className="relative flex-1 flex flex-col justify-center
                       overflow-y-auto lg:overflow-hidden
                       px-7 sm:px-12 lg:px-16 xl:px-24 py-12 lg:py-0"
          >
            <div className="flex items-center gap-3 mb-7">
              <span style={{ width: 30, height: 1, background: C_GOLD }} aria-hidden="true" />
              <p
                className="uppercase"
                style={{ fontSize: '11px', letterSpacing: '0.24em', color: C_GOLD_DK, fontWeight: 700 }}
              >
                Liderazgo Institucional
              </p>
            </div>

            <h2
              id={HEADING_ID}
              className="mb-7"
              style={{
                fontFamily:    SERIF,
                fontWeight:    500,
                fontSize:      'clamp(2.1rem, 4.4vw, 3.9rem)',
                color:         C_INK,
                letterSpacing: '-0.015em',
                lineHeight:    '1.06',
              }}
            >
              Bienvenido al<br className="hidden lg:block" /> Despacho del Director
            </h2>

            <div className="relative pl-6 mb-9" style={{ borderLeft: `1px solid ${C_DIVIDER}`, maxWidth: '46ch' }}>
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute', left: '-0.32em', top: '-0.5rem',
                  fontFamily: SERIF, fontSize: '2.6rem', fontStyle: 'italic',
                  color: C_GOLD, lineHeight: 1, opacity: 0.85,
                }}
              >
                "
              </span>
              <p
                style={{
                  fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                  color: C_MUTED, fontSize: 'clamp(1.02rem, 1.3vw, 1.15rem)', lineHeight: '1.7',
                }}
              >
                Comprometido con la excelencia académica y el desarrollo integral
                de la región sur de la República Dominicana.
              </p>
            </div>

            {/* CTA — botón premium de contorno navy, versalitas */}
            <Link
              to="/director/despacho"
              className="group inline-flex items-center gap-3 w-fit pb-1"
              style={{ borderBottom: `1px solid ${C_INK}` }}
            >
              <span
                className="uppercase font-semibold"
                style={{ fontSize: '12px', letterSpacing: '0.16em', color: C_INK }}
              >
                Conocer más sobre el Director
              </span>
              <ArrowUpRight
                size={15}
                style={{ color: C_INK }}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <p
              className="mt-12 uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.22em', color: 'rgba(10,23,48,0.32)' }}
            >
              ↓ Desplaza para conocer su trayectoria
            </p>
          </motion.div>

        </div>
      </StackPanel>

      {/* ══════════════════════════════════════════════════════════════
          PANEL 2 — Bio con letra capitular + Formación académica numerada
      ══════════════════════════════════════════════════════════════ */}
      <StackPanel index={1} scrollYProgress={scrollYProgress}>
        <div className="h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12
                        flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-24 items-center">

            {/* Bio con letra capitular editorial */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: SPRING }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span style={{ width: 30, height: 1, background: C_GOLD }} aria-hidden="true" />
                <p className="uppercase" style={{ fontSize: '11px', letterSpacing: '0.24em', color: C_GOLD_DK, fontWeight: 700 }}>
                  Trayectoria
                </p>
              </div>
              <h3
                style={{
                  fontFamily:    SERIF,
                  fontWeight:    500,
                  fontSize:      'clamp(1.7rem, 3.1vw, 2.75rem)',
                  color:         C_INK,
                  letterSpacing: '-0.012em',
                  lineHeight:    '1.14',
                }}
              >
                Dos décadas impulsando la educación superior dominicana
              </h3>
              <p style={{ color: C_MUTED, lineHeight: '1.9', fontSize: '1.02rem', maxWidth: '54ch' }}>
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: SERIF, fontWeight: 500, fontSize: '3.4rem', float: 'left',
                    lineHeight: '0.78', marginRight: '0.12em', marginTop: '0.1em', color: C_PRIMARY,
                  }}
                >
                  M
                </span>
                aestro de la Universidad Autónoma de Santo Domingo desde 2005, el Dr. Sánchez De Óleo
                ha dedicado su trayectoria a la transformación de la educación superior en la región.
                Su visión innovadora ha impulsado importantes avances en infraestructura, calidad
                educativa y vinculación comunitaria.
              </p>
            </motion.div>

            {/* Credentials — numeración romana, tipografía serif */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: SPRING, delay: 0.10 }}
            >
              <p
                className="uppercase mb-5"
                style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(10,23,48,0.42)', fontWeight: 700 }}
              >
                Formación Académica
              </p>

              <div style={{ borderTop: `1px solid ${C_DIVIDER}` }}>
                {ACADEMIC_CREDENTIALS.map((cred, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-5 py-6"
                    style={{ borderBottom: `1px solid ${C_DIVIDER}` }}
                  >
                    <span
                      style={{
                        fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500,
                        fontSize: '1.1rem', color: C_GOLD_DK, flexShrink: 0, width: '1.6rem',
                      }}
                      aria-hidden="true"
                    >
                      {ROMAN[i] ?? i + 1}
                    </span>
                    <div>
                      <p style={{ fontFamily: SERIF, fontWeight: 500, fontSize: '1.05rem', color: C_INK, lineHeight: 1.35 }}>
                        {cred.degree}
                      </p>
                      <p className="text-sm mt-1" style={{ color: C_PRIMARY }}>
                        {cred.institution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </StackPanel>

      {/* ══════════════════════════════════════════════════════════════
          PANEL 3 — Cierre navy con logros numerados, dorado sobre oscuro
      ══════════════════════════════════════════════════════════════ */}
      <StackPanel index={2} scrollYProgress={scrollYProgress}>
        {/* Textura sutil de fondo — líneas doradas muy tenues */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 85% 12%, rgba(253,185,19,0.10), transparent 45%)`,
          }}
        />
        <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12
                        flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24 items-start lg:items-center">

            {/* Titular izquierda */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: SPRING }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span style={{ width: 30, height: 1, background: C_GOLD }} aria-hidden="true" />
                <p className="uppercase" style={{ fontSize: '11px', letterSpacing: '0.24em', color: C_GOLD, fontWeight: 700 }}>
                  Logros Destacados
                </p>
              </div>
              <h3
                style={{
                  fontFamily:    SERIF,
                  fontWeight:    500,
                  fontSize:      'clamp(1.7rem, 3.1vw, 2.75rem)',
                  color:         '#ffffff',
                  letterSpacing: '-0.012em',
                  lineHeight:    '1.14',
                  maxWidth:      '20ch',
                }}
              >
                Reconocimientos que respaldan una visión transformadora
              </h3>

              <p
                className="mt-8 uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.38)' }}
              >
                Universidad Autónoma de Santo Domingo — Recinto San Juan
              </p>
            </motion.div>

            {/* Lista numerada — dorado sobre navy */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: SPRING, delay: 0.10 }}
              style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}
            >
              {ACHIEVEMENTS.map((item, i) => (
                <Link
                  key={i}
                  to="/director/despacho"
                  className="group flex items-center gap-6 py-6 transition-colors duration-150"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.14)' }}
                >
                  <span
                    style={{
                      fontFamily: SERIF, fontWeight: 400, fontSize: '1.4rem',
                      color: C_GOLD, flexShrink: 0, width: '2.2rem', opacity: 0.9,
                    }}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <p
                    className="flex-1 font-medium text-sm leading-relaxed transition-colors duration-150 group-hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.82)' }}
                  >
                    {item}
                  </p>
                  <ArrowRight
                    size={15}
                    className="flex-shrink-0 transition-all duration-200 group-hover:translate-x-1"
                    style={{ color: C_GOLD }}
                  />
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
