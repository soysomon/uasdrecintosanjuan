const API_BASE_URL = 'http://localhost:5000/api';

const API_ROUTES = {
  // Rutas existentes
  NEWS: `${API_BASE_URL}/news`,
  NEWS_BY_ID: (id: string) => `${API_BASE_URL}/news/${id}`,

  SLIDES: `${API_BASE_URL}/slides`,
  SLIDES_BY_ID: (id: string) => `${API_BASE_URL}/slides/${id}`,

    // Rutas para estados financieros
    ESTADOS_FINANCIEROS: `${API_BASE_URL}/estados-financieros`,
    ESTADOS_FINANCIEROS_BY_ID: (id: string) => `${API_BASE_URL}/estados-financieros/${id}`,

  MEMORIAS: `${API_BASE_URL}/memorias`,
  MEMORIAS_BY_ID: (id: string) => `${API_BASE_URL}/memorias/${id}`,
  MEMORIAS_BY_SLUG: (slug: string) => `${API_BASE_URL}/memorias/${slug}`,

  // Nuevas rutas para docentes
  DOCENTES: `${API_BASE_URL}/docentes`,
  DOCENTES_BY_ID: (id: string) => `${API_BASE_URL}/docentes/${id}`,
  DOCENTES_BY_SLUG: (slug: string) => `${API_BASE_URL}/docentes/${slug}`,
  DOCENTES_BY_TYPE: (tipo: string) => `${API_BASE_URL}/docentes?tipo=${tipo}`,

  // Publicaciones "Conoce tu Docente"
  PUBLICACIONES_DOCENTES: `${API_BASE_URL}/publicaciones-docentes`,
  PUBLICACION_DOCENTE_BY_ID: (id: string) => `${API_BASE_URL}/publicaciones-docentes/${id}`,

  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_ME: `${API_BASE_URL}/auth/me`,

  // Usuarios (solo superadmin)
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,

  // Rutas para uploads
  UPLOAD_IMAGE: `${API_BASE_URL}/upload-image`,
  UPLOAD_PDF: `${API_BASE_URL}/upload-pdf`,

  
};

export default API_ROUTES;
