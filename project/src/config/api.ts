const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const API_ROUTES = {
  // Autenticación
  AUTH_BLOCKED_IPS: `${API_BASE_URL}/auth/blocked-ips`,
  AUTH_CSRF:        `${API_BASE_URL}/auth/csrf-token`,
  AUTH_LOGIN:       `${API_BASE_URL}/auth/login`,
  AUTH_LOGOUT:      `${API_BASE_URL}/auth/logout`,
  AUTH_ME:          `${API_BASE_URL}/auth/me`,
  AUTH_REFRESH:     `${API_BASE_URL}/auth/refresh`,

  // Docentes
  DOCENTES:         `${API_BASE_URL}/docentes`,
  DOCENTES_BY_ID:   (id: string)   => `${API_BASE_URL}/docentes/${id}`,
  DOCENTES_BY_SLUG: (slug: string) => `${API_BASE_URL}/docentes/${slug}`,
  DOCENTES_BY_TYPE: (tipo: string) => `${API_BASE_URL}/docentes?tipo=${tipo}`,

  // Estados financieros
  ESTADOS_FINANCIEROS:       `${API_BASE_URL}/estados-financieros`,
  ESTADOS_FINANCIEROS_BY_ID: (id: string) => `${API_BASE_URL}/estados-financieros/${id}`,

  // Memorias
  MEMORIAS:         `${API_BASE_URL}/memorias`,
  MEMORIAS_BY_ID:   (id: string)   => `${API_BASE_URL}/memorias/${id}`,
  MEMORIAS_BY_SLUG: (slug: string) => `${API_BASE_URL}/memorias/${slug}`,

  // Noticias
  NEWS:       `${API_BASE_URL}/news`,
  NEWS_BY_ID: (id: string) => `${API_BASE_URL}/news/${id}`,

  // PDFs
  PDF_BY_KEY: (s3Key: string) => `${API_BASE_URL}/pdf/${s3Key}`,

  // Publicaciones de docentes
  PUBLICACION_DOCENTE_BY_ID: (id: string) => `${API_BASE_URL}/publicaciones-docentes/${id}`,
  PUBLICACIONES_DOCENTES:    `${API_BASE_URL}/publicaciones-docentes`,

  // Slides
  SLIDES:       `${API_BASE_URL}/slides`,
  SLIDES_BY_ID: (id: string) => `${API_BASE_URL}/slides/${id}`,

  // Subida de archivos (autenticado)
  GET_UPLOAD_URL: `${API_BASE_URL}/get-upload-url`,
  UPLOAD_IMAGE:   `${API_BASE_URL}/upload-image`,
  UPLOAD_PDF:     `${API_BASE_URL}/upload-pdf`,

  // Usuarios (solo superadmin)
  USER_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
  USERS:      `${API_BASE_URL}/users`,
};

export default API_ROUTES;
