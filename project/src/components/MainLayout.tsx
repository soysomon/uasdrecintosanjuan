// MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { QuickNav } from './QuickNav';
import { Footer } from './Footer';
import ChatBot from './ChatBot'; // Importar ChatBot

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <QuickNav />
      <main className="min-h-[calc(100vh-200px)]"> {/* Ajustar altura mínima */}
        <Outlet /> {/* Render the child routes here */}
      </main>
      <Footer />
      <ChatBot /> {/* Añadir ChatBot */}
    </div>
  );
};

export default MainLayout;