// MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { QuickNav } from './QuickNav';
import { Footer } from './Footer';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <QuickNav />
      <main>
        <Outlet /> {/* Render the child routes here */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;