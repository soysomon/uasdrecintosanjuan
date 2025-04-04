import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { QuickNav } from './components/QuickNav';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './components/NewsDetailPage';
import { HistoryPage } from './components/HistoryPage';
import { PhilosophyPage } from './components/PhilosophyPage';
import { MisionVisionPage } from './components/MisionVisionPage';
import { ProjectsPage } from './components/ProjectsPage';
import { ReportsPage } from './components/ReportsPage';
import { EliasPinaPage } from './components/EliasPinaPage';
import { DirectivosPage } from './components/DirectivosPage';
import { UnidadesPage } from './components/UnidadesPage';
import { DegreesPage } from './components/DegreesPage';
import { PostgraduatePage } from './components/PostgraduatePage';
import { DirectorOfficePage } from './pages/DirectorOfficePage';
import { GalleryPage } from './pages/GalleryPage';
import { NonResidentFacultyPage } from './pages/NonResidentFacultyPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanelPage from './pages/AdminPanelPage'; 
import SlidesEditorPage from './pages/SlidesEditorPage';
import { MemoriasPostgradoPage } from './pages/memorias/MemoriasPostgradoPage';
import MemoriasEditorPage from './pages/memorias/MemoriasEditorPage';
import MemoriaContentPage from './pages/MemoriaContentPage'
import MemoriasPage from './pages/MemoriasPage';
import ResidentFacultyPage from './pages/docentes/ResidentFacultyPage';
import DocenteDetailPage from './pages/docentes/DocenteDetailPage';
import DocentesEditorPage from './pages/DocentesEditorPage';
import DocentesPage from './pages/docentes/DocentesPage';

// Importar componentes de autenticación
import { AuthProvider } from './auth/context/AuthContext';
import ProtectedRoute from './auth/components/ProtectedRoute';
import SuperAdminRoute from './auth/components/SuperAdminRoute';
import UserManagementPage from './pages/admin/UserManagementPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <QuickNav />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/noticias" element={<NewsPage />} />
            <Route path="/noticias/:id" element={<NewsDetailPage />} />
            <Route path="/inicio/historia" element={<HistoryPage />} />
            <Route path="/inicio/filosofia" element={<PhilosophyPage />} />
            <Route path="/inicio/mision-vision" element={<MisionVisionPage />} />
            <Route path="/inicio/proyectos" element={<ProjectsPage />} />
            <Route path="/inicio/informes" element={<ReportsPage />} />
            <Route path="/inicio/elias-pina" element={<EliasPinaPage />} />
            <Route path="/inicio/consejo-directivo" element={<DirectivosPage />} />
            <Route path="/inicio/unidades" element={<UnidadesPage />} />
            <Route path="/carreras/grado" element={<DegreesPage />} />
            <Route path="/carreras/postgrado" element={<PostgraduatePage />} />
            <Route path="/director/despacho" element={<DirectorOfficePage />} />
            <Route path="/galeria" element={<GalleryPage />} />
            <Route path="/docentes/no-residentes" element={<NonResidentFacultyPage />} />
            <Route path="/memorias" element={<MemoriasPage />} />
            <Route path="/memorias/:slug" element={<MemoriaContentPage />} />
            <Route path="/memorias/postgrado" element={<MemoriasPostgradoPage />} />
            <Route path="/docentes/residentes" element={<ResidentFacultyPage />} />
            <Route path="/docentes/no-residentes" element={<ResidentFacultyPage />} />
            <Route path="/docentes/:slug" element={<DocenteDetailPage />} />
            <Route path="/docentes-page" element={<DocentesPage />} /> 
            
            {/* Página de login */}
            <Route path="/admin-login" element={<AdminLoginPage />} />
            
            {/* Rutas protegidas para admin */}
            <Route 
              path="/admin-panel" 
              element={
                <ProtectedRoute>
                  <AdminPanelPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/slides-editor" 
              element={
                <ProtectedRoute>
                  <SlidesEditorPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/memorias-editor" 
              element={
                <ProtectedRoute>
                  <MemoriasEditorPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/docentes-editor" 
              element={
                <ProtectedRoute>
                  <DocentesEditorPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta protegida solo para superadmin */}
            <Route
              path="/admin/users" 
              element={
                <SuperAdminRoute>
                  <UserManagementPage />
                </SuperAdminRoute>
              }
            />
            
            {/* Ruta de acceso denegado */}
            <Route path="/unauthorized" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                  <p className="text-gray-700">No tienes permisos para acceder a esta página.</p>
                </div>
              </div>
            } />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;