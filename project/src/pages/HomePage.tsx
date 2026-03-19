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

import React from 'react';
import HeroCarousel       from '../components/Header/HeroCarousel';
import QuickLinks         from '../components/QuickLinks';
import StatsSection       from '../components/StatsSection';
import RecentNews         from '../components/RecentNews';
import AdmissionsFeature  from '../components/AdmissionsFeature';
import UniversityInfo     from '../components/UniversityInfo';
import Statement          from '../components/Statement';
import Events             from '../components/Events';
import { SocialMediaSection } from '../components/SocialMediaSection';

const HomePage: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-surface)' }}>

      {/*
       * Nav offset: Navigation is position:fixed, ~108 px tall.
       * This padding pushes the hero below the nav bar.
       */}
      <div style={{ paddingTop: '108px' }}>
        <HeroCarousel />
      </div>

      {/*
       * QuickLinks — blanco con microinteracciones.
       * Sin section-elevated: sombras oscuras son para bloques dark.
       * La separación la proveen los hairlines internos del componente.
       */}
      <QuickLinks />

      {/*
       * StatsSection — now white/surface bg, thin bordered band.
       * No section-elevated wrapper needed (light section, borders provide separation).
       */}
      <StatsSection />

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
