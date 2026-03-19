const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const API_ROUTES = {
  // Autenticación
  AUTH_BLOCKED_IPS: `${API_BASE_URL}/auth/blocked-ips`, // Obtiene la lista de IPs bloqueadas para seguridad
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`, // Inicia sesión de un usuario
  AUTH_ME: `${API_BASE_URL}/auth/me`, // Obtiene los datos del usuario autenticado

  // Docentes
  DOCENTES: `${API_BASE_URL}/docentes`, // Lista todos los docentes
  DOCENTES_BY_ID: (id: string) => `${API_BASE_URL}/docentes/${id}`, // Obtiene un docente por su ID
  DOCENTES_BY_SLUG: (slug: string) => `${API_BASE_URL}/docentes/${slug}`, // Obtiene un docente por su slug
  DOCENTES_BY_TYPE: (tipo: string) => `${API_BASE_URL}/docentes?tipo=${tipo}`, // Filtra docentes por tipo

  // Estados financieros
  ESTADOS_FINANCIEROS: `${API_BASE_URL}/estados-financieros`, // Lista todos los estados financieros
  ESTADOS_FINANCIEROS_BY_ID: (id: string) => `${API_BASE_URL}/estados-financieros/${id}`, // Obtiene un estado financiero por su ID

  // Eventos

  // Memorias
  MEMORIAS: `${API_BASE_URL}/memorias`, // Lista todas las memorias
  MEMORIAS_BY_ID: (id: string) => `${API_BASE_URL}/memorias/${id}`, // Obtiene una memoria por su ID
  MEMORIAS_BY_SLUG: (slug: string) => `${API_BASE_URL}/memorias/${slug}`, // Obtiene una memoria por su slug

  // Noticias
  NEWS: `${API_BASE_URL}/news`, // Lista todas las noticias
  NEWS_BY_ID: (id: string) => `${API_BASE_URL}/news/${id}`, // Obtiene una noticia por su ID

  // PDFs
  PDF_BY_KEY: (s3Key: string) => `${API_BASE_URL}/pdf/${s3Key}`, // Obtiene un PDF por su clave S3

  // Publicaciones de docentes
  PUBLICACION_DOCENTE_BY_ID: (id: string) => `${API_BASE_URL}/publicaciones-docentes/${id}`, // Obtiene una publicación de docente por su ID
  PUBLICACIONES_DOCENTES: `${API_BASE_URL}/publicaciones-docentes`, // Lista todas las publicaciones de docentes

  // Slides
  SLIDES: `${API_BASE_URL}/slides`, // Lista todos los slides
  SLIDES_BY_ID: (id: string) => `${API_BASE_URL}/slides/${id}`, // Obtiene un slide por su ID

  // Subida de archivos
  GET_UPLOAD_URL: `${API_BASE_URL}/get-upload-url`, // Obtiene una URL pre-firmada para subir archivos a S3
  UPLOAD_IMAGE: `${API_BASE_URL}/upload-image`, // Sube una imagen al servidor
  UPLOAD_PDF: `${API_BASE_URL}/upload-pdf`, // Sube un PDF al servidor

  // Usuarios
  USER_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`, // Obtiene un usuario por su ID
  USERS: `${API_BASE_URL}/users`, // Lista todos los usuarios (solo superadmin)
};

export default API_ROUTES;