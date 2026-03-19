import React from 'react';
import { ArrowRight } from 'lucide-react';

const innovationLinks = [
  { label: 'Inclusión Tecnológica y Digitalización',           href: '/innovaciones' },
  { label: 'Mejoras en Infraestructura y Recursos Educativos', href: '/innovaciones' },
  { label: 'Servicios y Bienestar Estudiantil',                href: '/innovaciones' },
];

const Sustainability: React.FC = () => {
  return (
    <section
      className="research-institutions flex flex-col md:flex-row"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* ── Imagen izquierda ── */}
      <div className="w-full md:w-1/2">
        <div className="relative overflow-hidden" style={{ minHeight: '380px', height: '100%' }}>
          <img
            src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/recinto-11.jpg"
            alt="Edificio de Investigación UASD"
            className="w-full h-full object-cover object-center"
            style={{ aspectRatio: '16/13' }}
          />
        </div>
      </div>

      {/* ── Contenido derecho ── */}
      <div
        className="w-full md:w-1/2 px-8 md:px-12 lg:px-16 py-14 md:py-16 flex flex-col justify-center"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Label */}
        <p className="section-label mb-4">Gestión y visión</p>

        {/* Título */}
        <h2
          className="text-3xl md:text-4xl font-bold mb-5 pl-5"
          style={{
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.025em',
            borderLeft: '4px solid var(--color-primary)',
          }}
        >
          INNOVACIONES
        </h2>

        <p
          className="text-base leading-relaxed mb-10"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Bajo el liderazgo del Dr. Carlos Manuel Sánchez de Oleo, el Recinto San Juan de la UASD
          impulsa la inclusión tecnológica, el desarrollo local y la modernización de infraestructuras
          para formar profesionales preparados para los retos del futuro.
        </p>

        {/* Links de navegación */}
        <div className="flex flex-col gap-1 mb-8">
          {innovationLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="group flex items-center justify-between px-4 py-3.5 rounded-lg transition-all duration-200"
              style={{ borderLeft: '3px solid var(--color-primary)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-subtle)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {link.label}
              </span>
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0 ml-3"
                style={{ color: 'var(--color-primary)' }}
              />
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="/innovaciones"
          className="group inline-flex items-center justify-between px-6 py-4 font-semibold
                     rounded-lg transition-all duration-200 text-sm"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            boxShadow: 'var(--shadow-primary)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-dark)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          <span>Descubrir Innovaciones</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </a>
      </div>
    </section>
  );
};

export default Sustainability;