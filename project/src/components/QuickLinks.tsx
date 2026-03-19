// src/components/QuickLinks.tsx
// WHITE BG · Microinteracciones modernas:
//   • Top-line reveal   → scaleX 0→1 desde izquierda (gold accent)
//   • Shine sweep       → barrido diagonal translúcido onHover
//   • Icon lift         → y:-3 + scale 1→1.07 onHover
//   • CTA arrow nudge   → x:+5 onHover
//   • Active state      → whileTap scale 0.985 + shadow crush
//   • Entrance          → whileInView stagger (propósito: contexto, no decoración)
import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// ── Íconos institucionales ─────────────────────────────────────────
import iconGrado        from '../assets/icons/Grado.svg';
import iconAdmisiones   from '../assets/icons/Admiciones.svg';
import iconAutoservicio from '../assets/icons/autoservicio.svg';
import iconPostgrado    from '../assets/icons/Postgrado-y-educacion-permanente.svg';
import iconPago         from '../assets/icons/icon-pago-en-linea2.svg';
import iconCalendario   from '../assets/icons/icon_calendario_academico.svg';
import iconPreseleccion from '../assets/icons/preseleccion.svg';
import iconRevalida     from '../assets/icons/revalida-y-convalidaciones.svg';
import iconServicios    from '../assets/icons/servicios-enlinea-reg.svg';
import iconVirtual      from '../assets/icons/uasd_virtual-1.svg';

// ── Easing y spring ───────────────────────────────────────────────
const EASE_OUT: [number, number, number, number] = [0.4, 0, 0.2, 1];
const SPRING_ENTER: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Variantes — propagación automática al hijo via variant name ───
const V_TOP_LINE: Variants = {
  rest:  { scaleX: 0, opacity: 0, originX: '0%' },
  hover: { scaleX: 1, opacity: 1, transition: { duration: 0.28, ease: EASE_OUT } },
};

const V_SHINE: Variants = {
  rest:  { x: '-115%', skewX: '-18deg' },
  hover: { x: '160%',  skewX: '-18deg', transition: { duration: 0.52, ease: EASE_OUT } },
};

const V_ICON: Variants = {
  rest:  { y: 0,  scale: 1    },
  hover: { y: -3, scale: 1.07, transition: { duration: 0.25, ease: EASE_OUT } },
};

const V_ARROW: Variants = {
  rest:  { x: 0 },
  hover: { x: 5, transition: { duration: 0.20, ease: EASE_OUT } },
};

// Para servicios rápidos (shine + icon)
const V_ICON_SM: Variants = {
  rest:  { y: 0,  scale: 1    },
  hover: { y: -2, scale: 1.08, transition: { duration: 0.22, ease: EASE_OUT } },
};

const V_LABEL: Variants = {
  rest:  { color: 'rgba(30,42,74,0.60)'  },
  hover: { color: 'rgba(0,48,135,1)',     transition: { duration: 0.18 } },
};

// ── Datos ─────────────────────────────────────────────────────────
const PATHWAYS = [
  {
    number:  '01',
    icon:    iconGrado,
    iconAlt: 'Ícono Grado',
    tag:     'Grado · Postgrado',
    heading: 'Oferta Académica',
    body:    '71 programas de grado y maestría en ciencias, humanidades, tecnología, derecho y salud.',
    cta:     { label: 'Explorar programas', href: '/carreras/grado', external: false },
  },
  {
    number:  '02',
    icon:    iconAdmisiones,
    iconAlt: 'Ícono Admisiones',
    tag:     'Matrícula abierta',
    heading: 'Admisiones 2025–2026',
    body:    'Conoce los requisitos, fechas de inscripción y becas disponibles. Comienza tu solicitud hoy.',
    cta:     { label: 'Proceso de admisión', href: 'https://uasd.edu.do/admisiones/', external: true },
  },
  {
    number:  '03',
    icon:    iconAutoservicio,
    iconAlt: 'Ícono Autoservicio',
    tag:     'Estudiantes activos',
    heading: 'Portal Estudiantil',
    body:    'Accede a Autoservicio, Correo Institucional, historial académico y pago en línea.',
    cta:     {
      label: 'Acceder al portal',
      href:  'https://eis.uasd.edu.do/authenticationendpoint/login.do?Name=PreLoginRequestProcessor&commonAuthCallerPath=%252Fcas%252Flogin&forceAuth=true&passiveAuth=false&service=https%3A%2F%2Fssb.uasd.edu.do%3A443%2Fssomanager%2Fc%2FSSB&tenantDomain=carbon.super&sessionDataKey=3c1b2696-f36d-4544-80a0-8d8ba80ebb8b&relyingParty=SSO+Manager+PROD&type=cas&sp=SSO+Manager+PROD&isSaaSApp=false&authenticators=BasicAuthenticator:LOCAL',
      external: true,
    },
  },
] as const;

const SERVICES = [
  { icon: iconPostgrado,    alt: 'Postgrado',         label: 'Postgrado y Maestrías',       href: '/carreras/postgrado',                                               external: false },
  { icon: iconPago,         alt: 'Pago en línea',     label: 'Pago en Línea',               href: 'https://uasd.edu.do/servicios/pago-en-linea/',                       external: true  },
  { icon: iconCalendario,   alt: 'Calendario',         label: 'Calendario Académico',        href: 'https://uasd.edu.do/calendario-academico/',                         external: true  },
  { icon: iconPreseleccion, alt: 'Preselección',       label: 'Preselección de Asignaturas', href: 'https://uasd.edu.do/servicios/preseleccion-de-asignaturas/',        external: true  },
  { icon: iconRevalida,     alt: 'Reválidas',          label: 'Reválidas y Convalidaciones', href: 'https://uasd.edu.do/revalida/proceso-de-revalida/',                 external: true  },
  { icon: iconServicios,    alt: 'Servicios en Línea', label: 'Servicios en Línea',          href: 'https://app.uasd.edu.do/ServiciosEnLinea/',                         external: true  },
  { icon: iconVirtual,      alt: 'UASD Virtual',       label: 'UASD Virtual',                href: 'https://uasd.edu.do/uasd-virtual/',                                 external: true  },
] as const;

// ── Panel principal ────────────────────────────────────────────────
function PathwayPanel({
  pathway,
  index,
  isLast,
}: {
  pathway: (typeof PATHWAYS)[number];
  index:   number;
  isLast:  boolean;
}) {
  const inner = (
    // Entrada: whileInView stagger — propósito: aparece al scrollear, no al montar
    <motion.div
      initial="rest"
      whileInView={{ opacity: 1, y: 0 }}
      whileHover="hover"
      whileTap={{ scale: 0.985, transition: { duration: 0.12 } }}
      viewport={{ once: true }}
      variants={{
        rest: { opacity: 0, y: 20 },
      }}
      transition={{ duration: 0.55, ease: SPRING_ENTER, delay: index * 0.1 }}
      className="relative flex flex-col h-full px-8 lg:px-10 py-10 lg:py-12 cursor-pointer overflow-hidden"
      style={{
        borderRight:     isLast ? 'none' : '1px solid rgba(0,48,135,0.07)',
        backgroundColor: '#ffffff',
        transition:      'background-color 0.22s ease, box-shadow 0.22s ease',
      }}
      onHoverStart={e => {
        (e.target as HTMLElement).closest<HTMLElement>('[data-panel]')!.style.backgroundColor = 'rgba(0,48,135,0.025)';
        (e.target as HTMLElement).closest<HTMLElement>('[data-panel]')!.style.boxShadow       = 'inset 0 0 0 1px rgba(0,48,135,0.10)';
      }}
      onHoverEnd={e => {
        (e.target as HTMLElement).closest<HTMLElement>('[data-panel]')!.style.backgroundColor = '#ffffff';
        (e.target as HTMLElement).closest<HTMLElement>('[data-panel]')!.style.boxShadow       = 'none';
      }}
      data-panel=""
    >
      {/* ① Top-line reveal — gold, scaleX 0→1 */}
      <motion.div
        variants={V_TOP_LINE}
        className="absolute inset-x-0 top-0 h-[3px] pointer-events-none"
        style={{
          background:      'var(--color-accent)',
          transformOrigin: '0%',
        }}
        aria-hidden="true"
      />

      {/* ② Shine sweep — diagonal gloss */}
      <motion.div
        variants={V_SHINE}
        className="absolute inset-y-0 w-16 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%)',
          left:        0,
          zIndex:      10,
        }}
        aria-hidden="true"
      />

      {/* ③ Ícono institucional — lift onHover */}
      <motion.div
        variants={V_ICON}
        className="mb-6 flex-shrink-0 inline-flex items-center justify-center rounded-xl"
        style={{
          backgroundColor: 'rgba(0,48,135,0.06)',
          width:   '64px',
          height:  '64px',
          padding: '12px',
          border:  '1px solid rgba(0,48,135,0.10)',
        }}
      >
        <img
          src={pathway.icon}
          alt={pathway.iconAlt}
          style={{ width: '38px', height: '38px', objectFit: 'contain' }}
          loading="eager"
        />
      </motion.div>

      {/* Tag */}
      <p
        className="text-[10px] font-semibold uppercase tracking-widest mb-4"
        style={{ color: 'var(--color-primary)', letterSpacing: '0.14em', opacity: 0.75 }}
      >
        {pathway.tag}
      </p>

      {/* Heading */}
      <h3
        className="font-extrabold mb-4 leading-tight"
        style={{
          fontSize:      'clamp(1.375rem, 2vw, 1.875rem)',
          letterSpacing: '-0.025em',
          color:         'var(--color-text-primary)',
        }}
      >
        {pathway.heading}
      </h3>

      {/* Body */}
      <p
        className="text-sm leading-relaxed mb-8 flex-1"
        style={{ color: 'var(--color-text-muted)', lineHeight: '1.75' }}
      >
        {pathway.body}
      </p>

      {/* ④ CTA — arrow nudge onHover */}
      <div
        className="flex items-center gap-2 text-sm font-semibold"
        style={{ color: 'var(--color-primary)' }}
      >
        {pathway.cta.label}
        <motion.span variants={V_ARROW} className="flex-shrink-0 inline-flex" aria-hidden="true">
          <ArrowRight size={14} />
        </motion.span>
      </div>
    </motion.div>
  );

  return pathway.cta.external ? (
    <a href={pathway.cta.href} target="_blank" rel="noopener noreferrer" className="block" aria-label={pathway.heading}>
      {inner}
    </a>
  ) : (
    <a href={pathway.cta.href} className="block" aria-label={pathway.heading}>
      {inner}
    </a>
  );
}

// ── Sección ────────────────────────────────────────────────────────
const QuickLinks: React.FC = () => {
  return (
    <section
      aria-label="Rutas de acceso principal"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Top hairline — separación visual del hero */}
      <div
        className="h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,48,135,0.12) 30%, rgba(0,48,135,0.12) 70%, transparent)' }}
        aria-hidden="true"
      />

      {/* ── Desktop: 3 columnas ── */}
      <div
        className="max-w-7xl mx-auto hidden lg:grid lg:grid-cols-3"
        style={{ borderBottom: '1px solid rgba(0,48,135,0.07)' }}
      >
        {PATHWAYS.map((p, i) => (
          <PathwayPanel key={p.number} pathway={p} index={i} isLast={i === PATHWAYS.length - 1} />
        ))}
      </div>

      {/* ── Mobile: apilado ── */}
      <div
        className="max-w-7xl mx-auto lg:hidden"
        style={{ borderBottom: '1px solid rgba(0,48,135,0.07)' }}
      >
        {PATHWAYS.map((p, i) => {
          const cardContent = (
            <motion.div
              key={p.number}
              initial="rest"
              whileInView={{ opacity: 1, y: 0 }}
              whileHover="hover"
              whileTap={{ scale: 0.97, transition: { duration: 0.10 } }}
              viewport={{ once: true }}
              variants={{ rest: { opacity: 0, y: 14 } }}
              transition={{ duration: 0.5, ease: SPRING_ENTER, delay: i * 0.08 }}
              className="relative flex items-start gap-4 px-5 py-6 overflow-hidden cursor-pointer"
              style={{
                borderBottom:    i < PATHWAYS.length - 1 ? '1px solid rgba(0,48,135,0.06)' : 'none',
                backgroundColor: '#ffffff',
              }}
            >
              {/* Shine móvil */}
              <motion.div
                variants={V_SHINE}
                className="absolute inset-y-0 w-12 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.6) 50%, transparent 80%)',
                  left: 0, zIndex: 10,
                }}
                aria-hidden="true"
              />

              {/* Ícono móvil */}
              <motion.div
                variants={V_ICON_SM}
                className="flex-shrink-0 inline-flex items-center justify-center rounded-xl"
                style={{
                  backgroundColor: 'rgba(0,48,135,0.06)',
                  width:  '52px', height: '52px', padding: '9px',
                  border: '1px solid rgba(0,48,135,0.10)',
                }}
              >
                <img src={p.icon} alt={p.iconAlt} style={{ width: '30px', height: '30px', objectFit: 'contain' }} loading="eager" />
              </motion.div>

              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
                   style={{ color: 'var(--color-primary)', letterSpacing: '0.14em', opacity: 0.75 }}>
                  {p.tag}
                </p>
                <h3 className="font-bold mb-1.5 leading-tight"
                    style={{ fontSize: '1.0625rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
                  {p.heading}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)', lineHeight: '1.65' }}>
                  {p.body}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {p.cta.label}
                  <ArrowRight size={12} aria-hidden="true" />
                </p>
              </div>
            </motion.div>
          );

          return p.cta.external ? (
            <a key={p.number} href={p.cta.href} target="_blank" rel="noopener noreferrer" className="block">{cardContent}</a>
          ) : (
            <a key={p.number} href={p.cta.href} className="block">{cardContent}</a>
          );
        })}
      </div>

      {/* ── Servicios rápidos ── */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{ backgroundColor: 'var(--color-surface-alt, #f7f8fa)' }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-5 text-center"
          style={{ color: 'rgba(0,48,135,0.38)', letterSpacing: '0.16em' }}
        >
          Servicios institucionales
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {SERVICES.map((svc, i) => {
            const card = (
              <motion.div
                initial="rest"
                whileInView={{ opacity: 1, y: 0 }}
                whileHover="hover"
                whileTap={{ scale: 0.94, transition: { duration: 0.10 } }}
                viewport={{ once: true }}
                variants={{ rest: { opacity: 0, y: 12 } }}
                transition={{ duration: 0.45, ease: SPRING_ENTER, delay: 0.05 + i * 0.05 }}
                className="relative flex flex-col items-center gap-2.5 py-5 px-2 rounded-xl
                           cursor-pointer text-center overflow-hidden"
                style={{
                  border:          '1px solid rgba(0,48,135,0.08)',
                  backgroundColor: '#ffffff',
                  transition:      'border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease',
                }}
                onHoverStart={e => {
                  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-svc]')!;
                  el.style.borderColor     = 'rgba(0,48,135,0.20)';
                  el.style.backgroundColor = 'rgba(0,48,135,0.03)';
                  el.style.boxShadow       = '0 4px 16px rgba(0,48,135,0.08)';
                }}
                onHoverEnd={e => {
                  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-svc]')!;
                  el.style.borderColor     = 'rgba(0,48,135,0.08)';
                  el.style.backgroundColor = '#ffffff';
                  el.style.boxShadow       = 'none';
                }}
                data-svc=""
              >
                {/* Shine servicio */}
                <motion.div
                  variants={V_SHINE}
                  className="absolute inset-y-0 w-10 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.7) 50%, transparent 80%)',
                    left: 0, zIndex: 10,
                  }}
                  aria-hidden="true"
                />

                {/* Top-line servicio */}
                <motion.div
                  variants={V_TOP_LINE}
                  className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl pointer-events-none"
                  style={{ background: 'var(--color-accent)', transformOrigin: '0%' }}
                  aria-hidden="true"
                />

                {/* Ícono */}
                <motion.div
                  variants={V_ICON_SM}
                  className="inline-flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(0,48,135,0.06)',
                    width:  '50px', height: '50px', padding: '8px',
                    border: '1px solid rgba(0,48,135,0.09)',
                  }}
                >
                  <img src={svc.icon} alt={svc.alt} style={{ width: '32px', height: '32px', objectFit: 'contain' }} loading="lazy" />
                </motion.div>

                {/* Label */}
                <motion.span
                  variants={V_LABEL}
                  className="text-xs font-medium leading-snug"
                >
                  {svc.label}
                </motion.span>
              </motion.div>
            );

            return svc.external ? (
              <a key={i} href={svc.href} target="_blank" rel="noopener noreferrer" aria-label={svc.label}>{card}</a>
            ) : (
              <a key={i} href={svc.href} aria-label={svc.label}>{card}</a>
            );
          })}
        </div>
      </div>

      {/* Bottom hairline */}
      <div
        className="h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,48,135,0.10) 30%, rgba(0,48,135,0.10) 70%, transparent)' }}
        aria-hidden="true"
      />
    </section>
  );
};

export default QuickLinks;
