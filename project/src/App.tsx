import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4'; // Importa react-ga4
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
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
import DegreesPage from './components/DegreesPage';
import { PostgraduatePage } from './components/PostgraduatePage';
import { DirectorOfficePage } from './pages/DirectorOfficePage';
import CampusTour from './pages/CampusTour';
import { NonResidentFacultyPage } from './pages/NonResidentFacultyPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanelPage from './pages/AdminPanelPage';
import SlidesEditorPage from './pages/SlidesEditorPage';
import { MemoriasPostgradoPage } from './pages/memorias/MemoriasPostgradoPage';
import MemoriasEditorPage from './pages/memorias/MemoriasEditorPage';
import MemoriaContentPage from './pages/MemoriaContentPage';
import EstadosFinancierosPage from './pages/EstadosFinancierosPage';
import MemoriasPage from './pages/MemoriasPage';
import EstadosFinancierosManager from './components/EstadosFinancierosManager';
import ResidentFacultyPage from './pages/docentes/ResidentFacultyPage';
import DocenteDetailPage from './pages/docentes/DocenteDetailPage';
import DocentesEditorPage from './pages/DocentesEditorPage';
import DocentesPage from './pages/docentes/DocentesPage';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import NotFoundPage from './pages/NotFoundPage';
import InnovacionesEducativas from './components/Innovations';
import Frequentquestions from './components/frequentquestions';
import { ContactosPage } from './components/Contact';
import MeritoriosPage from './meritorios/MeritoriosPage';
import { AuthProvider } from './auth/context/AuthContext';
import ProtectedRoute from './auth/components/ProtectedRoute';
import SuperAdminRoute from './auth/components/SuperAdminRoute';
import UserManagementPage from './pages/admin/UserManagementPage';

// Inicializa Google Analytics con el ID de medición
ReactGA.initialize('G-VH9JTLWD6Z');

// Componente para rastrear cambios de página
const TrackPageViews = () => {
  const location = useLocation();
  useEffect(() => {
    // Rastrear la vista de página con la ruta actual
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <TrackPageViews /> {/* Agrega el componente de rastreo */}
        <CookieConsent />
        <Routes>
          {/* ── Public routes (with site nav) ── */}
          <Route element={<MainLayout />}>
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
            <Route path="/TourVirtual" element={<CampusTour />} />
            <Route path="/docentes/no-residentes" element={<NonResidentFacultyPage />} />
            <Route path="/memorias" element={<MemoriasPage />} />
            <Route path="/transparencia/estados-financieros" element={<EstadosFinancierosPage />} />
            <Route path="/memorias/:slug" element={<MemoriaContentPage />} />
            <Route path="/memorias/postgrado" element={<MemoriasPostgradoPage />} />
            <Route path="/docentes/residentes" element={<ResidentFacultyPage />} />
            <Route path="/docentes/no-residentes" element={<ResidentFacultyPage />} />
            <Route path="/docentes/:slug" element={<DocenteDetailPage />} />
            <Route path="/docentes-page" element={<DocentesPage />} />
            <Route path="/innovaciones" element={<InnovacionesEducativas />} />
            <Route path="/preguntas-frecuentes" element={<Frequentquestions />} />
            <Route path="/contacto" element={<ContactosPage />} />
            <Route path="/meritorios" element={<MeritoriosPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ── Admin routes (own full-viewport shell, no site nav) ── */}
          <Route path="/admin-login" element={<AdminLoginPage />} />
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
          <Route
            path="/estados-financieros"
            element={
              <ProtectedRoute>
                <EstadosFinancierosManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <SuperAdminRoute>
                <UserManagementPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                  <p className="text-gray-700">No tienes permisos para acceder a esta página.</p>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;