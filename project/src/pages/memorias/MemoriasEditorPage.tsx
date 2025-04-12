import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import MemoriasManager from '../../components/MemoriasManager';
import logoUASD from '../../img/logouasd.png';

const MemoriasEditorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-32">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img src={logoUASD} alt="UASD Logo" className="h-16 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                Editor de Memorias
              </h1>
              <p className="text-gray-600">
                Administra las secciones de Memorias del sitio web
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/admin-panel"
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Volver al Panel de Administración
        </Link>

        <MemoriasManager />
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#FFF',
            padding: '16px',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFF',
            },
          },
        }}
      />
    </div>
  );
};

export default MemoriasEditorPage;