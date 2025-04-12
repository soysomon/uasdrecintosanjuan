// src/components/Header/Header.tsx
import React from 'react';
import Navigation from '../Navigation';
import HeroCarousel from './HeroCarousel';

const Header: React.FC = () => {
  return (
    <header className="relative pt-32">
      <Navigation />
      <HeroCarousel />
    </header>
  );
};

export default Header;

