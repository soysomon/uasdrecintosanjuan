// src/components/StatsSection.tsx
// Redesign: banda horizontal compacta — eyebrow + año en fila, contadores left-aligned.
// GSAP count-up preservado íntegramente.
import React, { useEffect, useRef } from 'react';
import { institutionalStats } from '../data/staticData';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRefs  = useRef<(HTMLDivElement | null)[]>([]);

  statsRefs.current = [];

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el) statsRefs.current.push(el);
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      institutionalStats.forEach((stat, i) => {
        const el = statsRefs.current[i]?.querySelector('.stat-value');
        if (el) el.textContent = stat.figure;
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Entrance
      gsap.fromTo(
        statsRefs.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.70,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      // Count-up
      institutionalStats.forEach((stat, i) => {
        const statEl  = statsRefs.current[i];
        const valueEl = statEl?.querySelector('.stat-value');
        if (!valueEl) return;

        const numericPart = stat.figure.replace(/[^\d]/g, '');
        const endValue    = parseInt(numericPart, 10);
        const suffix      = stat.figure.replace(/[\d,]/g, '');

        valueEl.textContent = '0' + suffix;

        gsap.to(valueEl, {
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: statEl, start: 'top 84%', once: true },
          onUpdate: function () {
            const progress = this.progress();
            const eased    = 1 - Math.pow(1 - progress, 3);
            valueEl.textContent = Math.floor(endValue * eased).toLocaleString() + suffix;
          },
          onComplete: function () {
            valueEl.textContent = stat.figure;
          },
        });
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stats-heading"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop:       '1px solid var(--color-border-subtle)',
        borderBottom:    '1px solid var(--color-border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Fila eyebrow ── */}
        <div
          className="flex items-center justify-between"
          style={{
            padding:      '0.875rem 0',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <p
            id="stats-heading"
            style={{
              fontSize:      '0.5625rem',
              fontWeight:    700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         'var(--color-primary)',
              margin:        0,
            }}
          >
            UASD · San Juan en Cifras
          </p>
          <p style={{
            fontSize:      '0.5625rem',
            fontWeight:    600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         'var(--color-text-muted)',
            margin:        0,
          }}>
            Año académico 2025
          </p>
        </div>

        {/* ── Grid de contadores ── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ borderLeft: '1px solid var(--color-border-subtle)' }}
        >
          {institutionalStats.map((stat, index) => (
            <div
              key={index}
              ref={addToRefs}
              style={{
                borderRight: '1px solid var(--color-border-subtle)',
                padding:     'clamp(1.75rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 2.25rem)',
              }}
            >
              {/* Número */}
              <div
                className="stat-value tabular-nums leading-none"
                style={{
                  fontFamily:    '"Playfair Display", Georgia, serif',
                  fontStyle:     'italic',
                  fontSize:      'clamp(2.5rem, 5vw, 3.75rem)',
                  fontWeight:    700,
                  letterSpacing: '-0.03em',
                  color:         '#0A0A14',
                  marginBottom:  '0.625rem',
                  display:       'block',
                }}
              >
                {stat.figure}
              </div>

              {/* Label */}
              <p style={{
                fontSize:      '0.6875rem',
                fontWeight:    500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color:         'var(--color-text-muted)',
                margin:        0,
                lineHeight:    1.5,
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StatsSection;
