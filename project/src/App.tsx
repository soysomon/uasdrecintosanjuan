import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4'; // Importa react-ga4
import MainLayout from './components/MainLayout';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import { AuthProvider } from './auth/context/AuthContext';
import ProtectedRoute from './auth/components/ProtectedRoute';
import SuperAdminRoute from './auth/components/SuperAdminRoute';
import MaintenancePage from './pages/MaintenancePage';
import { prefetchInBackground } from './utils/prefetchQueue';

// Code-splitting por ruta: cada página se descarga solo cuando se visita,
// en vez de venir toda junta (incluido el panel admin) en el bundle inicial
// que descarga cualquier visitante público.
const HomePage                = lazy(() => import('./pages/HomePage'));
const NewsPage                 = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage           = lazy(() => import('./components/NewsDetailPage'));
const HistoryPage              = lazy(() => import('./components/HistoryPage').then(m => ({ default: m.HistoryPage })));
const PhilosophyPage           = lazy(() => import('./components/PhilosophyPage').then(m => ({ default: m.PhilosophyPage })));
const MisionVisionPage         = lazy(() => import('./components/MisionVisionPage').then(m => ({ default: m.MisionVisionPage })));
// Reservado para futura reactivacion de investigaciones y proyectos institucionales.
// const ProjectsPage             = lazy(() => import('./components/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const EliasPinaPage            = lazy(() => import('./components/EliasPinaPage').then(m => ({ default: m.EliasPinaPage })));
const DirectivosPage           = lazy(() => import('./components/DirectivosPage').then(m => ({ default: m.DirectivosPage })));
const UnidadesPage             = lazy(() => import('./components/UnidadesPage').then(m => ({ default: m.UnidadesPage })));
const DegreesPage              = lazy(() => import('./components/DegreesPage'));
const PostgraduatePage         = lazy(() => import('./components/PostgraduatePage').then(m => ({ default: m.PostgraduatePage })));
const DirectorOfficePage       = lazy(() => import('./pages/DirectorOfficePage').then(m => ({ default: m.DirectorOfficePage })));
const CampusTour                = lazy(() => import('./pages/CampusTour'));
const NonResidentFacultyPage   = lazy(() => import('./pages/NonResidentFacultyPage').then(m => ({ default: m.NonResidentFacultyPage })));
const AdminLoginPage           = lazy(() => import('./pages/AdminLoginPage'));
const AdminPanelPage           = lazy(() => import('./pages/AdminPanelPage'));
const SlidesEditorPage         = lazy(() => import('./pages/SlidesEditorPage'));
const MemoriasEditorPage       = lazy(() => import('./pages/memorias/MemoriasEditorPage'));
const MemoriaContentPage       = lazy(() => import('./pages/MemoriaContentPage'));
const EstadosFinancierosPage   = lazy(() => import('./pages/EstadosFinancierosPage'));
const MemoriasPage             = lazy(() => import('./pages/MemoriasPage'));
const EstadosFinancierosManager = lazy(() => import('./components/EstadosFinancierosManager'));
const ResidentFacultyPage      = lazy(() => import('./pages/docentes/ResidentFacultyPage'));
const DocenteDetailPage        = lazy(() => import('./pages/docentes/DocenteDetailPage'));
const DocentesEditorPage       = lazy(() => import('./pages/DocentesEditorPage'));
const DocentesPage             = lazy(() => import('./pages/docentes/DocentesPage'));
const NotFoundPage             = lazy(() => import('./pages/NotFoundPage'));
const InnovacionesEducativas   = lazy(() => import('./components/Innovations'));
const Frequentquestions        = lazy(() => import('./components/frequentquestions'));
const ContactosPage            = lazy(() => import('./components/Contact').then(m => ({ default: m.ContactosPage })));
const MeritoriosPage           = lazy(() => import('./meritorios/MeritoriosPage'));
const UserManagementPage       = lazy(() => import('./pages/admin/UserManagementPage'));
const PruebasPage              = lazy(() => import('./components/PruebasPage').then(m => ({ default: m.PruebasPage })));

// Modo mantenimiento: controlado por la variable de entorno VITE_MAINTENANCE_MODE en Railway.
// Con VITE_MAINTENANCE_MODE=true se muestra solo MaintenancePage en todas las rutas.
const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === 'true';


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

// Cola de precarga en segundo plano — por prioridad de probabilidad de clic.
// Se dispara una sola vez, después del "load" de la página, para no competir
// con el bundle crítico (index + vendor-react + vendor-motion + HomePage).
const PrefetchQueue = () => {
  useEffect(() => {
    const start = () => {
      prefetchInBackground([
        // 1) Lo más probable desde el Home: entrar a una noticia
        () => import('./components/NewsDetailPage'),
        () => import('./pages/NewsPage'),

        // 2) Secciones de alto tráfico enlazadas directo desde el Home
        () => import('./pages/DirectorOfficePage'),
        () => import('./components/DegreesPage'),
        () => import('./components/PostgraduatePage'),
        () => import('./pages/MemoriasPage'),
        () => import('./components/Contact'),

        // 3) Resto de páginas institucionales públicas
        () => import('./components/HistoryPage'),
        () => import('./components/PhilosophyPage'),
        () => import('./components/MisionVisionPage'),
        // Reservado para futura reactivacion de investigaciones y proyectos institucionales.
        // () => import('./components/ProjectsPage'),
        () => import('./components/DirectivosPage'),
        () => import('./components/UnidadesPage'),
        () => import('./components/EliasPinaPage'),
        () => import('./pages/docentes/DocentesPage'),
        () => import('./pages/docentes/ResidentFacultyPage'),
        () => import('./pages/NonResidentFacultyPage'),
        () => import('./pages/docentes/DocenteDetailPage'),
        () => import('./pages/CampusTour'),
        () => import('./components/Innovations'),
        () => import('./components/frequentquestions'),
        () => import('./meritorios/MeritoriosPage'),
        () => import('./pages/EstadosFinancierosPage'),
        () => import('./pages/MemoriaContentPage'),

        // 4) Panel administrativo — prioridad más baja, casi nadie lo visita
        () => import('./pages/AdminLoginPage'),
        () => import('./pages/AdminPanelPage'),
        () => import('./pages/SlidesEditorPage'),
        () => import('./pages/memorias/MemoriasEditorPage'),
        () => import('./pages/DocentesEditorPage'),
        () => import('./components/EstadosFinancierosManager'),
        () => import('./pages/admin/UserManagementPage'),
      ]);
    };

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
      return () => window.removeEventListener('load', start);
    }
  }, []);
  return null;
};

// Fallback de carga entre rutas — discreto, con la identidad de marca.
const RouteFallback = () => (
  <div
    className="min-h-screen w-full flex items-center justify-center"
    style={{ backgroundColor: '#ffffff' }}
  >
    <div
      className="w-8 h-8 rounded-full animate-spin"
      style={{ border: '3px solid #e2e8f0', borderTopColor: '#003087' }}
      aria-label="Cargando"
    />
  </div>
);

function App() {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    // AuthProvider — maneja el sistema de login. Envuelve todo el sitio. NO MODIFICAR.
    <AuthProvider>
      <BrowserRouter>
        {/* ScrollToTop — hace que cada página nueva empiece desde arriba. NO MODIFICAR. */}
        <ScrollToTop />
        {/* TrackPageViews — registra las visitas en Google Analytics. NO MODIFICAR. */}
        <TrackPageViews />
        {/* Precarga en segundo plano de las siguientes rutas más probables — no bloquea nada. */}
        <PrefetchQueue />
        {/* CookieConsent — barra de cookies que aparece la primera vez. NO MODIFICAR. */}
        <CookieConsent />
        <Suspense fallback={<RouteFallback />}>
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
              {/* Reservado para futura reactivacion de investigaciones y proyectos institucionales. */}
              {/* <Route path="/inicio/proyectos" element={<ProjectsPage />} /> */}
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



              <Route path="/pruebas" element={<PruebasPage />} />





              {/* Memorias institucionales */}
              <Route path="/memorias" element={<MemoriasPage />} />
              <Route path="/memorias/:slug" element={<MemoriaContentPage />} />

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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
