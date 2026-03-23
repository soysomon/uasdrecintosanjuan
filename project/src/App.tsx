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

// Inicializa Google Analytics — registra las visitas al sitio automáticamente. NO MODIFICAR.
ReactGA.initialize('G-VH9JTLWD6Z');

// Componente interno que detecta cuando el usuario cambia de página y lo reporta a Analytics. NO MODIFICAR.
const TrackPageViews = () => {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
  return null;
};

function App() {
  return (
    // AuthProvider — maneja el sistema de login. Envuelve todo el sitio. NO MODIFICAR.
    <AuthProvider>
      <BrowserRouter>
        {/* ScrollToTop — hace que cada página nueva empiece desde arriba. NO MODIFICAR. */}
        <ScrollToTop />
        {/* TrackPageViews — registra las visitas en Google Analytics. NO MODIFICAR. */}
        <TrackPageViews />
        {/* CookieConsent — barra de cookies que aparece la primera vez. NO MODIFICAR. */}
        <CookieConsent />
        <Routes>

          {/* ─────────────────────────────────────────────────────────────
              PÁGINAS PÚBLICAS — las que cualquier visitante puede ver.
              Todas usan el encabezado y pie de página del sitio (MainLayout).
              Cada línea conecta una URL con su página correspondiente.
          ───────────────────────────────────────────────────────────── */}
          <Route element={<MainLayout />}>

            {/* Página principal — uasdrecintosanjuan.org/ */}
            <Route path="/" element={<HomePage />} />

            {/* Noticias — lista de todas las noticias */}
            <Route path="/noticias" element={<NewsPage />} />
            {/* Detalle de una noticia específica — el :id cambia según la noticia */}
            <Route path="/noticias/:id" element={<NewsDetailPage />} />

            {/* Sección "Inicio" — páginas institucionales */}
            <Route path="/inicio/historia" element={<HistoryPage />} />
            <Route path="/inicio/filosofia" element={<PhilosophyPage />} />
            <Route path="/inicio/mision-vision" element={<MisionVisionPage />} />
            <Route path="/inicio/proyectos" element={<ProjectsPage />} />
            <Route path="/inicio/elias-pina" element={<EliasPinaPage />} />
            <Route path="/inicio/consejo-directivo" element={<DirectivosPage />} />
            <Route path="/inicio/unidades" element={<UnidadesPage />} />

            {/* Carreras */}
            <Route path="/carreras/grado" element={<DegreesPage />} />
            <Route path="/carreras/postgrado" element={<PostgraduatePage />} />

            {/* Despacho del director */}
            <Route path="/director/despacho" element={<DirectorOfficePage />} />

            {/* Tour virtual del campus */}
            <Route path="/TourVirtual" element={<CampusTour />} />

            {/* Docentes */}
            <Route path="/docentes/no-residentes" element={<NonResidentFacultyPage />} />
            <Route path="/docentes/residentes" element={<ResidentFacultyPage />} />
            <Route path="/docentes/no-residentes" element={<ResidentFacultyPage />} />
            {/* El :slug es el nombre único de cada docente en la URL */}
            <Route path="/docentes/:slug" element={<DocenteDetailPage />} />
            <Route path="/docentes-page" element={<DocentesPage />} />

            {/* Memorias institucionales */}
            <Route path="/memorias" element={<MemoriasPage />} />
            <Route path="/memorias/:slug" element={<MemoriaContentPage />} />
            <Route path="/memorias/postgrado" element={<MemoriasPostgradoPage />} />

            {/* Transparencia */}
            <Route path="/transparencia/estados-financieros" element={<EstadosFinancierosPage />} />

            {/* Otras páginas */}
            <Route path="/innovaciones" element={<InnovacionesEducativas />} />
            <Route path="/preguntas-frecuentes" element={<Frequentquestions />} />
            <Route path="/contacto" element={<ContactosPage />} />
            <Route path="/meritorios" element={<MeritoriosPage />} />

            {/* Página 404 — se muestra cuando la URL no existe */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ─────────────────────────────────────────────────────────────
              PÁGINAS DE ADMINISTRACIÓN — solo accesibles con login.
              NO MODIFICAR — cualquier cambio aquí puede romper el acceso al panel.
          ───────────────────────────────────────────────────────────── */}

          {/* Página de login del panel administrativo */}
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