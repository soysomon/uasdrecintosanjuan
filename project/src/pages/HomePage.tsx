// src/pages/HomePage.tsx
// Orden narrativo canónico — editorial redesign 2026:
//
//   HeroCarousel       → full-bleed slider, below fixed nav      (DARK hero)
//   QuickLinks         → blanco, microinteracciones              (WHITE — sin elevation)
//   StatsSection       → white horizontal band, GSAP counters    (WHITE — no elevation)
//   RecentNews         → asymmetric: featured 7-col + stack 5-col(WHITE)
//   Events (Director)  → dark navy leadership editorial           (DEEP NAVY)     ← section-elevated
//   AdmissionsFeature  → dark primary-dark conversion block       (#001f5a)        ← section-elevated
//   UniversityInfo     → text-left / image-right split            (WHITE)
//   Statement          → full-bleed brand CTA block               (BRAND #003087) ← section-elevated
//   SocialMediaSection → social feed                              (SURFACE)

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroCarousel       from '../components/Header/HeroCarousel';
import QuickLinks         from '../components/QuickLinks';
import RecentNews         from '../components/RecentNews';
import AdmissionsFeature  from '../components/AdmissionsFeature';
import UniversityInfo     from '../components/UniversityInfo';
import Statement          from '../components/Statement';
import Events             from '../components/Events';
import { SocialMediaSection } from '../components/SocialMediaSection';

const HomePage: React.FC = () => {
  // Efecto de salida inmersivo del Hero: al hacer scroll fuera del hero,
  // la imagen/carrusel se amplía, se difumina y se desvanece (estilo Apple).
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroExitProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale   = useTransform(heroExitProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroExitProgress, [0, 1], [1, 0]);
  const heroBlur    = useTransform(heroExitProgress, [0, 1], [0, 16]);
  const heroFilter  = useTransform(heroBlur, (v) => `blur(${v}px)`);

  return (
    <div style={{ backgroundColor: 'var(--color-surface)' }}>

      {/*
       * Nav offset: Navigation is position:fixed, ~108 px tall.
       * This padding pushes the hero below the nav bar.
       * heroRef mide el recorrido de scroll para animar la salida del hero.
       */}
      <div ref={heroRef} style={{ paddingTop: '108px', overflow: 'hidden' }}>
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity, filter: heroFilter, willChange: 'transform, filter, opacity' }}
        >
          <HeroCarousel />
        </motion.div>
      </div>

      {/*
       * QuickLinks — blanco con microinteracciones.
       * Sin section-elevated: sombras oscuras son para bloques dark.
       * La separación la proveen los hairlines internos del componente.
       */}
      <QuickLinks />

      {/* Editorial asymmetric news layout */}
      <RecentNews />

      {/*
       * Events / Director — editorial light theme (white → warm-gray panels).
       * No section-elevated: section is light, flows naturally after RecentNews.
       */}
      <Events />

      {/*
       * AdmissionsFeature — conversion block con carrusel de campus.
       * section-elevated crea contraste con el Events (navy) arriba
       * y UniversityInfo (white) abajo.
       */}
      <div className="section-elevated">
        <AdmissionsFeature />
      </div>

      {/* About split — text left, image right */}
      <UniversityInfo />

      {/*
       * Statement — deep primary blue CTA block.
       */}
      <div className="section-elevated">
        <Statement />
      </div>

      {/* Social media feed */}
      <SocialMediaSection />

    </div>
  );
};

export default HomePage;
