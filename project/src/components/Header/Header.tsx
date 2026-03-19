// src/components/Header/Header.tsx
// Navigation is rendered globally in MainLayout — no duplication here.
// This component kept for backward compatibility with any other page that imports it.

import React from 'react';
import HeroCarousel from './HeroCarousel';

const Header: React.FC = () => {
  return (
    <header>
      <HeroCarousel />
    </header>
  );
};

export default Header;
