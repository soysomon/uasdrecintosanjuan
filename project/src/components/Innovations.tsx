// src/components/InnovacionesEducativas.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, Laptop, Award, Activity, Heart, Building, Accessibility } from 'lucide-react';

interface Innovation {
  id: number;
  title: string;
  description: string;
  year: string;
  image: string;
  icon: React.ReactNode;
  category: string;
}

const CATEGORIES = [
  { id: 'all',       name: 'Todas' },
  { id: 'tech',      name: 'Inclusión Tecnológica' },
  { id: 'infra',     name: 'Infraestructura Educativa' },
  { id: 'community', name: 'Compromiso Comunitario' },
  { id: 'inclusion', name: 'Inclusividad' },
  { id: 'services',  name: 'Servicios Estudiantiles' },
  { id: 'extra',     name: 'Actividades Extracurriculares' },
  { id: 'pandemic',  name: 'Adaptaciones COVID-19' },
];

const INNOVATIONS: Innovation[] = [
  {
    id: 1,
    category: 'tech',
    title: 'Tablets para Estudiantes de Nuevo Ingreso',
    description:
      'Entrega de 528 tablets a estudiantes de nuevo ingreso para el semestre 2025-10, fortaleciendo la inclusión tecnológica y facilitando el acceso equitativo a recursos digitales. Incluye un nuevo sistema de conectividad gratuita para todos los estudiantes.',
    year: '2025',
    image:
      'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Tablets+para+Estudiantes+de+Nuevo+Ingreso.jpeg',
    icon: <Laptop />,
  },
  {
    id: 2,
    category: 'infra',
    title: 'Laboratorios Especializados',
    description:
      'Adquisición de equipos para laboratorios especializados, como incubadoras BIO-GENES, neveras y otros instrumentos para el laboratorio de biología, y pipetas automáticas y centrífugas para el laboratorio de serología.',
    year: '2022-2024',
    image:
      'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Laboratorios-Especializados.jpg',
    icon: <BookOpen />,
  },
  {
    id: 3,
    category: 'community',
    title: 'UASD San Juan visita tu escuela',
    description:
      'Programa de conversatorios con estudiantes de bachillerato en escuelas locales para informar sobre la historia de la UASD, sus carreras y el proceso de admisión, aumentando la matriculación y fortaleciendo los lazos con la comunidad.',
    year: '2022-2025',
    image:
      'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/visita-tu-escuela.jpg',
    icon: <Users />,
  },
  {
    id: 4,
    category: 'inclusion',
    title: 'Campus Accesible',
    description:
      'Colaboración con la Fundación Nacional de Ciegos (FUDCI) y la Asociación de Personas con Discapacidad de San Juan (APEDISAN) para abrir una unidad especializada que brinda servicios a estudiantes y personas con discapacidad.',
    year: '2022',
    image:
      'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/colaboracion-discapacidad.jpg',
    icon: <Accessibility />,
  },
  {
    id: 5,
    category: 'services',
    title: 'Unidad de Consultoría Jurídica',
    description:
      'Inauguración de una unidad de consultoría jurídica en el recinto para ofrecer asesoramiento legal a estudiantes y la comunidad, contribuyendo a su bienestar general.',
    year: '2020',
    image:
      'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/inauguracion-Unidad-de-Consultor%C3%ADa-Jur%C3%ADdica.jpg',
    icon: <Award />,
  },
  {
    id: 6,
    category: 'extra',
    title: 'Relanzamiento del Deporte Universitario',
    description:
      'Encuentro con entrenadores deportivos para relanzar el deporte universitario tras la pandemia, comprometiendo recursos para entrenamientos y participación en juegos como los Tony Barreiro.',
    year: '2022',
    image:
      'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/Deporte-universitario-tras-la-pandemia.jpeg',
    icon: <Activity />,
  },
  {
    id: 7,
    category: 'pandemic',
    title: 'Aprendizaje Virtual durante COVID-19',
    description:
      'Transición a plataformas de aprendizaje virtual durante la pandemia, asegurando la continuidad educativa mediante procesos de evaluación en línea y apoyo a docentes.',
    year: '2020-2023',
    image:
      'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-innovaciones/evaluaci%C3%B3n+de+tesis.jpg',
    icon: <Heart />,
  },
  {
    id: 8,
    category: 'infra',
    title: 'Mejoras en Infraestructura',
    description:
      'Renovación continua de las instalaciones del campus para proporcionar un entorno de aprendizaje óptimo, con especial atención a las necesidades de los diversos programas académicos.',
    year: '2018-2025',
    image:
      'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-53.jpg',
    icon: <Building />,
  },
];

const TIMELINE = [
  { year: '2018', event: 'Dr. Carlos Manuel Sánchez de Oleo asume como director del Recinto San Juan.' },
  { year: '2020', event: 'Inauguración de la Unidad de Consultoría Jurídica y adaptación a la educación virtual durante la pandemia.' },
  { year: '2022', event: 'Relanzamiento del deporte universitario y apertura de unidades para personas con discapacidad.' },
  { year: '2024', event: 'Equipamiento de laboratorios especializados con tecnología de vanguardia.' },
  { year: '2025', event: 'Programa de inclusión digital con entrega de tablets y conectividad gratuita para estudiantes.' },
];

// Variantes para AnimatePresence de los items de innovación
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

const InnovacionesEducativas: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const headerRef = useRef<HTMLDivElement>(null);

  const filteredInnovations = activeCategory === 'all'
    ? INNOVATIONS
    : INNOVATIONS.filter((inn) => inn.category === activeCategory);

  // IntersectionObserver para animate-on-scroll del header
  useEffect(() => {
    if (!headerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    headerRef.current.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="innovaciones-educativas"
      style={{
        paddingTop: 'var(--section-pad-lg)',
        paddingBottom: 'var(--section-pad-lg)',
        backgroundColor: 'var(--color-surface)',
      }}
      aria-label="Innovaciones Educativas"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={headerRef}>

        {/* ── HEADER ── */}
        <div className="mb-16 md:mb-20">
          <div className="animate-on-scroll">
            <span className="section-label mb-3 block">Desarrollo institucional</span>
            <h1
              className="font-extrabold tracking-tighter mb-6"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: '1.08',
              }}
            >
              Innovaciones Educativas
            </h1>
            <div className="divider-accent mb-8" />
            <p
              className="section-subtitle"
              style={{ maxWidth: '60ch' }}
            >
              Iniciativas transformadoras que han redefinido la experiencia académica en el Recinto San Juan, desde 2018 hasta hoy.
            </p>
          </div>

          {/* ── FILTER TABS ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="mt-12 relative"
          >
            {/* Accent corners — tokenizados */}
            <div
              className="absolute -top-3 -left-3 w-12 h-12 pointer-events-none"
              style={{
                borderLeft: '3px solid var(--color-primary)',
                borderTop: '3px solid var(--color-primary)',
                borderRadius: '2px 0 0 0',
              }}
            />
            <div
              className="absolute -bottom-3 -right-3 w-12 h-12 pointer-events-none"
              style={{
                borderRight: '3px solid var(--color-primary)',
                borderBottom: '3px solid var(--color-primary)',
                borderRadius: '0 0 2px 0',
              }}
            />
            <div
              className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full pointer-events-none"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />

            <div
              className="rounded-lg px-4 py-8 md:px-8 md:py-10"
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-0">
                {CATEGORIES.map((cat, index) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className="group flex flex-col items-center text-center py-5 px-3 rounded-lg transition-all duration-250 focus-visible:outline-2 focus-visible:outline-offset-2 relative"
                      style={{
                        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                        borderRight:
                          index % 4 !== 3 ? '1px solid var(--color-border-subtle)' : 'none',
                      }}
                      aria-pressed={isActive}
                    >
                      <span
                        className="text-sm font-semibold leading-snug transition-colors duration-200"
                        style={{
                          color: isActive
                            ? '#ffffff'
                            : 'var(--color-text-secondary)',
                        }}
                      >
                        {cat.name}
                      </span>
                      <span
                        className="mt-3 text-xl transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--color-primary)' }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── INNOVATION CARDS — alternating layout con AnimatePresence ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="space-y-20 md:space-y-24"
          >
            {filteredInnovations.map((innovation, index) => (
              <motion.div
                key={innovation.id}
                variants={itemVariants}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-10 md:gap-14`}
              >
                {/* Text content */}
                <div className="w-full md:w-1/2 px-2 md:px-4">
                  <div className="mb-5">
                    {/* Year badge */}
                    <span
                      className="inline-block text-sm font-semibold px-4 py-1 mb-4 rounded-sm"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: '#ffffff',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {innovation.year}
                    </span>

                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <span
                        className="flex-shrink-0 mt-1"
                        style={{ color: 'var(--color-primary)' }}
                        aria-hidden="true"
                      >
                        {innovation.icon}
                      </span>
                      <h2
                        className="font-bold leading-tight"
                        style={{
                          fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)',
                          color: 'var(--color-text-primary)',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {innovation.title}
                      </h2>
                    </div>
                  </div>

                  {/* Description with accent left-border */}
                  <div
                    className="pl-4"
                    style={{ borderLeft: '3px solid var(--color-accent)' }}
                  >
                    <p
                      style={{
                        color: 'var(--color-text-secondary)',
                        lineHeight: '1.75',
                        fontSize: '1rem',
                      }}
                    >
                      {innovation.description}
                    </p>
                  </div>

                  {/* Más información link */}
                  <div className="mt-7">
                    <span
                      className="link-arrow group cursor-default"
                      aria-label={`Más sobre ${innovation.title}`}
                    >
                      <span>Más información</span>
                      <span
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="w-full md:w-1/2 overflow-hidden rounded-lg" style={{ boxShadow: 'var(--shadow-medium)' }}>
                  <motion.img
                    src={innovation.image}
                    alt={innovation.title}
                    className="w-full object-cover object-center"
                    style={{ aspectRatio: '4/3' }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── TIMELINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="mt-24 md:mt-32 relative"
        >
          <div className="text-center mb-14">
            <span className="section-label mb-3 block">Trayectoria de transformación</span>
            <h2 className="section-title">Cronología de Innovaciones</h2>
            <div className="divider-accent mx-auto mt-4" />
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
              style={{ backgroundColor: 'var(--color-border)' }}
            />

            <div className="space-y-16">
              {TIMELINE.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  className="relative flex justify-between items-start gap-8"
                >
                  {/* Left */}
                  <div className="w-5/12 text-right">
                    {index % 2 === 0 ? (
                      <>
                        <span
                          className="inline-block font-extrabold text-2xl mb-2"
                          style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}
                        >
                          {item.year}
                        </span>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: '0.9375rem' }}>
                          {item.event}
                        </p>
                      </>
                    ) : null}
                  </div>

                  {/* Center dot */}
                  <div
                    className="absolute left-1/2 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)',
                      boxShadow: '0 0 0 4px var(--color-primary-subtle)',
                    }}
                  />

                  {/* Right */}
                  <div className="w-5/12 text-left">
                    {index % 2 !== 0 ? (
                      <>
                        <span
                          className="inline-block font-extrabold text-2xl mb-2"
                          style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}
                        >
                          {item.year}
                        </span>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: '0.9375rem' }}>
                          {item.event}
                        </p>
                      </>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── DIRECTOR PROFILE ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="mt-24 md:mt-32 rounded-lg overflow-hidden relative"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-medium)',
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))' }}
          />

          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Photo */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div
                className="overflow-hidden rounded-lg"
                style={{ boxShadow: 'var(--shadow-medium)' }}
              >
                <img
                  src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/Carlos+Manuel+Sa%CC%81nchez+De+O%CC%81leo.png"
                  alt="Dr. Carlos Manuel Sánchez de Oleo"
                  className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  style={{ aspectRatio: '4/5' }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/3">
              <span className="section-label mb-3 block">Director del Recinto</span>
              <h2
                className="font-bold mb-2"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Dr. Carlos Manuel Sánchez de Oleo
              </h2>
              <div
                className="h-0.5 w-10 mb-6"
                style={{ backgroundColor: 'var(--color-accent)', borderRadius: '2px' }}
              />
              <p
                className="mb-4"
                style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75' }}
              >
                Nacido en El Cercado, República Dominicana, el Dr. Sánchez de Oleo cuenta con doctorados y maestrías de la Universidad Politécnica de Valencia, España. Ha sido profesor de la UASD desde 2005 y director del Recinto San Juan de la Maguana desde 2018.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75' }}>
                Su sólido background en matemáticas y experiencia en investigación, incluyendo una pasantía en el Laboratorio de Física de Partículas CERN en Suiza, han contribuido a su visión innovadora para el desarrollo educativo del recinto.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default InnovacionesEducativas;
