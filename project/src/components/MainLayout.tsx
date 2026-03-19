// MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navigation from './Navigation';
import { QuickNav } from './QuickNav';
import { Footer } from './Footer';
import ChatBot from './ChatBot';

const MainLayout: React.FC = () => {
  return (
    /*
     * MotionConfig reducedMotion="user" → respeta prefers-reduced-motion del SO
     * en TODOS los componentes Framer Motion del árbol sin modificar cada uno.
     * WCAG 2.1 SC 2.3.3 — Animation from Interactions.
     */
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>

        {/* ── Skip Navigation ── WCAG 2.1 SC 2.4.1 — Bypass Blocks */}
        <a href="#main-content" className="skip-nav">
          Ir al contenido principal
        </a>

        <Navigation />
        <QuickNav />

        <main
          id="main-content"
          className="min-h-[calc(100vh-200px)]"
          tabIndex={-1}
          aria-label="Contenido principal"
        >
          <Outlet />
        </main>

        <Footer />
        <ChatBot />
      </div>
    </MotionConfig>
  );
};

export default MainLayout;
