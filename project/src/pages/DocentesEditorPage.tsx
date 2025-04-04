import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ChevronLeft, Book, FileText, User } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import DocentesManager from '../components/DocentesManager';
import PublicacionesDocentesManager from '../components/PublicacionesDocentesManager';

const DocentesEditorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docentes' | 'publicaciones'>('docentes');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pt-40 pb-16">
      <Toaster position="top-center" />

      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/admin-panel"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Volver al Panel de Administración
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Users className="mr-3 text-blue-600" size={28} />
              Gestión de Recursos de Docentes
            </h1>

            <div className="flex space-x-2">
              <Link
                to="/docentes-page"
                target="_blank"
                className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Ver Página de Docentes
              </Link>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Este panel te permite gestionar la información de los docentes y las publicaciones relacionadas que se muestran en el sitio web.
          </p>

          {/* Tabs de navegación */}
          <div className="border-b border-gray-200 mb-6">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('docentes')}
                  className={`inline-flex items-center px-4 py-2 border-b-2 rounded-t-lg ${
                    activeTab === 'docentes'
                      ? 'text-blue-600 border-blue-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <User className="w-5 h-5 mr-2" />
                  Perfiles de Docentes
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('publicaciones')}
                  className={`inline-flex items-center px-4 py-2 border-b-2 rounded-t-lg ${
                    activeTab === 'publicaciones'
                      ? 'text-blue-600 border-blue-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Book className="w-5 h-5 mr-2" />
                  Publicaciones "Conoce tu Docente"
                </button>
              </li>
            </ul>
          </div>

          {/* Contenido según la pestaña seleccionada */}
          {activeTab === 'docentes' ? (
            <DocentesManager />
          ) : (
            <PublicacionesDocentesManager />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocentesEditorPage;
