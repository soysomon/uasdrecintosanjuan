require('dotenv').config();

const express      = require('express');
const mongoose     = require('mongoose');
const cron         = require('node-cron');
const axios        = require('axios');
const cors         = require('cors');
const helmet       = require('helmet');
const cookieParser = require('cookie-parser');
const multer       = require('multer');
const fs           = require('fs-extra');
const path         = require('path');
const { doubleCsrf } = require('csrf-csrf');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl }               = require('@aws-sdk/s3-request-presigner');

const estadosFinancierosRoutes = require('./estados/estadofinanciero');
const IpAttempt                = require('./models/IpAttempt');
const authController           = require('./auth/authController');
const { authMiddleware }        = require('./auth/authMiddleware');
const { roleMiddleware }        = require('./auth/roleMiddleware');
const { loginLimiter, authLimiter, uploadLimiter, apiLimiter } = require('./middleware/rateLimits');
const { validateLogin, validateCreateUser, validateUpdateUser } = require('./middleware/inputValidation');

const IS_PROD = process.env.NODE_ENV === 'production';

// ── Environment guards ────────────────────────────────────────────────────────
if (!process.env.JWT_SECRET)   throw new Error('JWT_SECRET is not defined');
if (!process.env.MONGODB_URI)  throw new Error('MONGODB_URI is not defined');

// ── App ───────────────────────────────────────────────────────────────────────
const app = express();

// ── HTTPS redirect (production) ───────────────────────────────────────────────
if (IS_PROD) {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, 'https://' + req.headers.host + req.url);
    }
    next();
  });
}

// ── Security headers via Helmet ───────────────────────────────────────────────
app.use(helmet({
  // HSTS: browsers will only connect via HTTPS for 1 year (production only)
  hsts: IS_PROD
    ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
    : false,
  // Since this is a pure JSON API, CSP is applied minimally
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'none'"],
      connectSrc:  ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  // Remove X-Powered-By (hides Express)
  hidePoweredBy: true,
  // Prevent MIME sniffing
  noSniff: true,
  // Prevent clickjacking
  frameguard: { action: 'deny' },
  // Referrer policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// ── Body parsing (with size limit to prevent DoS) ─────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://uasdrecintosanjuan-fe-production.up.railway.app',
  'https://uasdrecintosanjuan.org',
  'https://www.uasdrecintosanjuan.org',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods:        ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  credentials:    true,
}));

// ── CSRF (Double Submit Cookie pattern via csrf-csrf) ─────────────────────────
const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret:   () => process.env.CSRF_SECRET || process.env.JWT_SECRET,
  cookieName:  '_csrf',
  cookieOptions: {
    httpOnly: false, // Frontend JS must read this value
    secure:   IS_PROD,
    sameSite: IS_PROD ? 'strict' : 'lax',
    path:     '/',
  },
  size: 64,
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
});

// CSRF token endpoint — called on app init before any mutation
app.get('/api/auth/csrf-token', (req, res) => {
  const token = generateToken(req, res);
  return res.json({ csrfToken: token });
});

// ── Rate limiting ──────────────────────────────────────────────────────────────
app.use('/api/', apiLimiter);
app.use('/api/auth/login',   loginLimiter);
app.use('/api/auth/',        authLimiter);
app.use('/api/upload-image', uploadLimiter);
app.use('/api/upload-pdf',   uploadLimiter);
app.use('/api/get-upload-url', uploadLimiter);

// ── External routes ───────────────────────────────────────────────────────────
app.use('/api/estados-financieros', estadosFinancierosRoutes);

// ── S3 Client ─────────────────────────────────────────────────────────────────
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName    = process.env.AWS_S3_BUCKET || 'uasd-recinto-sanjuan-media';
const getS3PublicUrl = (key) => `https://${bucketName}.s3.amazonaws.com/${key}`;

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    // Daily cleanup of old IP attempt records
    cron.schedule('0 0 * * *', async () => {
      try {
        const result = await IpAttempt.deleteMany({
          lastAttempt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });
        if (result.deletedCount > 0) {
          console.log(`[CRON] Removed ${result.deletedCount} stale IpAttempt records`);
        }
      } catch (error) {
        console.error('[CRON] IpAttempt cleanup error:', error.message);
      }
    });
  })
  .catch((err) => console.error('[DB] MongoDB connection error:', err.message));

// ── News Schema / Model ───────────────────────────────────────────────────────
const newsSchema = new mongoose.Schema({
  title: String,
  sections: [{
    images: [{
      url: String,
      publicId: String,
      displayOptions: {
        size:      { type: String, default: 'medium' },
        alignment: { type: String, default: 'center' },
        caption:   String,
        cropMode:  { type: String, default: 'cover' },
      },
    }],
    text:     String,
    videoUrl: { type: String, trim: true },
    pdf: {
      url:      { type: String, trim: true },
      publicId: { type: String, trim: true },
    },
  }],
  date:     Date,
  category: String,
});
const News = mongoose.model('News', newsSchema);

// ── Auth Routes ───────────────────────────────────────────────────────────────
app.post('/api/auth/login',   doubleCsrfProtection, validateLogin, authController.login);
app.post('/api/auth/refresh', doubleCsrfProtection, authController.refresh);
app.post('/api/auth/logout',  doubleCsrfProtection, authController.logout);
app.get( '/api/auth/me',      authMiddleware, authController.me);
app.get( '/api/auth/blocked-ips',
  authMiddleware, roleMiddleware(['superadmin']), authController.getBlockedIps);

// ── User Management (superadmin only) ─────────────────────────────────────────
app.get(   '/api/users',      authMiddleware, roleMiddleware(['superadmin']), authController.getUsers);
app.post(  '/api/users',      authMiddleware, roleMiddleware(['superadmin']), doubleCsrfProtection, validateCreateUser, authController.createUser);
app.put(   '/api/users/:id',  authMiddleware, roleMiddleware(['superadmin']), doubleCsrfProtection, validateUpdateUser, authController.updateUser);
app.delete('/api/users/:id',  authMiddleware, roleMiddleware(['superadmin']), doubleCsrfProtection, authController.deleteUser);

// ── News Routes ───────────────────────────────────────────────────────────────
app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Noticia no encontrada' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la noticia' });
  }
});

app.post('/api/news',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const { date, ...rest } = req.body;
      const news = new News({ ...rest, date: new Date(`${date}T00:00:00Z`) });
      await news.save();
      res.status(201).json(news);
    } catch (err) {
      res.status(400).json({ message: 'Error al crear la noticia' });
    }
  }
);

app.put('/api/news/:id',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const { date, ...rest } = req.body;
      const updateData = {
        ...rest,
        date: new Date(`${date}T00:00:00Z`),
        sections: req.body.sections.map(({ id, ...sectionRest }) => sectionRest),
      };
      const news = await News.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
      if (!news) return res.status(404).json({ message: 'Noticia no encontrada' });
      res.json(news);
    } catch (err) {
      res.status(400).json({ message: 'Error al actualizar la noticia' });
    }
  }
);

app.delete('/api/news/:id',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const news = await News.findByIdAndDelete(req.params.id);
      if (!news) return res.status(404).json({ message: 'Noticia no encontrada' });
      res.json({ message: 'Eliminado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar la noticia' });
    }
  }
);

// ── Multer storage (shared temp dir) ─────────────────────────────────────────
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, 'temp');
    try {
      fs.ensureDirSync(tempDir);
      cb(null, tempDir);
    } catch (error) {
      cb(new Error('Failed to create temporary directory'), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Separate multer instances per file type
const imageUpload = multer({
  storage: tempStorage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)'));
    }
    cb(null, true);
  },
});

const pdfUpload = multer({
  storage: tempStorage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se permiten archivos PDF'));
    }
    cb(null, true);
  },
});

// ── Image Upload (authenticated) ──────────────────────────────────────────────
app.post('/api/upload-image',
  authMiddleware, doubleCsrfProtection, imageUpload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se proporcionó ningún archivo' });
      }

      const fileContent = await fs.readFile(req.file.path);
      const fileKey = `news_images/${path.basename(req.file.originalname, path.extname(req.file.originalname)).replace(/\s+/g, '_')}_${Date.now()}${path.extname(req.file.originalname)}`;

      await s3Client.send(new PutObjectCommand({
        Bucket:       bucketName,
        Key:          fileKey,
        Body:         fileContent,
        ContentType:  req.file.mimetype,
        CacheControl: 'public, max-age=31536000, immutable',
        Metadata: {
          'original-filename': req.file.originalname,
          'upload-date':       new Date().toISOString(),
        },
      }));

      await fs.remove(req.file.path);

      const url = getS3PublicUrl(fileKey);

      // Verify upload (non-blocking)
      axios.head(url).catch(() => {});

      return res.json({
        success:      true,
        imageUrl:     url,
        public_id:    fileKey,
        format:       path.extname(req.file.originalname).substring(1),
        resourceType: 'image',
      });
    } catch (error) {
      if (req.file?.path) await fs.remove(req.file.path).catch(() => {});
      return res.status(500).json({ success: false, error: 'Error al subir la imagen' });
    }
  }
);

// ── PDF Upload (authenticated) ────────────────────────────────────────────────
app.post('/api/upload-pdf',
  authMiddleware, doubleCsrfProtection, pdfUpload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se proporcionó ningún archivo' });
      }

      const fileContent = await fs.readFile(req.file.path);
      const fileKey = `pdfs/${path.basename(req.file.originalname, path.extname(req.file.originalname)).replace(/\s+/g, '_')}_${Date.now()}${path.extname(req.file.originalname)}`;

      await s3Client.send(new PutObjectCommand({
        Bucket:       bucketName,
        Key:          fileKey,
        Body:         fileContent,
        ContentType:  req.file.mimetype,
        CacheControl: 'public, max-age=31536000, immutable',
      }));

      await fs.remove(req.file.path);

      return res.json({
        success:      true,
        pdfUrl:       getS3PublicUrl(fileKey),
        public_id:    fileKey,
        format:       'pdf',
        resourceType: 'pdf',
      });
    } catch (error) {
      if (req.file?.path) await fs.remove(req.file.path).catch(() => {});
      return res.status(500).json({ success: false, error: 'Error al subir el PDF' });
    }
  }
);

// ── Pre-signed S3 upload URL (authenticated) ──────────────────────────────────
app.get('/api/get-upload-url', authMiddleware, async (req, res) => {
  try {
    const fileName = req.query.fileName || 'default.pdf';
    const fileKey  = `pdfs/${path.basename(fileName, path.extname(fileName)).replace(/\s+/g, '_')}_${Date.now()}${path.extname(fileName)}`;

    const uploadUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({ Bucket: bucketName, Key: fileKey, ContentType: 'application/pdf' }),
      { expiresIn: 3600, signableHeaders: new Set(['content-type']) }
    );

    return res.json({ success: true, uploadUrl, fileKey, pdfUrl: getS3PublicUrl(fileKey) });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error al generar URL de subida' });
  }
});

// ── PDF redirect (public) ─────────────────────────────────────────────────────
app.get('/api/pdf/:s3Key(*)', (req, res) => {
  res.redirect(getS3PublicUrl(req.params.s3Key));
});

// NOTE: /api/debug-pdf has been removed — it was exposing internal URL structure

// ── Slides Schema / Routes ────────────────────────────────────────────────────
const slideSchema = new mongoose.Schema({
  title:       String,
  subtitle:    String,
  description: String,
  cta:         { text: String, link: String },
  image:       String,
  color:       String,
  order:       Number,
  displayMode: { type: String, enum: ['normal', 'hover'], default: 'normal' },
});
const Slide = mongoose.model('Slide', slideSchema);

app.get('/api/slides', async (req, res) => {
  try {
    const slides = await Slide.find().sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener slides' });
  }
});

app.post('/api/slides',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const slide = new Slide(req.body);
      await slide.save();
      res.json(slide);
    } catch (err) {
      res.status(400).json({ message: 'Error al crear slide' });
    }
  }
);

app.put('/api/slides/:id',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const slide = await Slide.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!slide) return res.status(404).json({ message: 'Slide no encontrado' });
      res.json(slide);
    } catch (err) {
      res.status(400).json({ message: 'Error al actualizar slide' });
    }
  }
);

app.delete('/api/slides/:id',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      await Slide.findByIdAndDelete(req.params.id);
      res.json({ message: 'Eliminado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar slide' });
    }
  }
);

// ── Memorias Schema / Routes ──────────────────────────────────────────────────
const memoriaSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  pdfUrl:      { type: String, trim: true },
  pdfPublicId: { type: String, trim: true },
  videoUrl:    { type: String, trim: true },
  order:       { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  contentSections: [{
    sectionType: {
      type: String,
      enum: ['text', 'stats', 'table', 'gallery', 'timeline', 'list', 'quote', 'contact'],
      required: true,
    },
    title:   { type: String, trim: true },
    content: { type: mongoose.Schema.Types.Mixed },
    order:   { type: Number, default: 0 },
  }],
}, { timestamps: true });
const Memoria = mongoose.model('Memoria', memoriaSchema);

app.get('/api/memorias', async (req, res) => {
  try {
    const memorias = await Memoria.find().sort({ order: 1 });
    res.json(memorias);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener memorias' });
  }
});

app.get('/api/memorias/:slug', async (req, res) => {
  try {
    const memoria = await Memoria.findOne({ slug: req.params.slug });
    if (!memoria) return res.status(404).json({ message: 'Memoria no encontrada' });
    res.json(memoria);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la memoria' });
  }
});

app.post('/api/memorias',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const memoria = new Memoria(req.body);
      await memoria.save();
      res.status(201).json(memoria);
    } catch (err) {
      res.status(400).json({ message: 'Error al crear la memoria' });
    }
  }
);

app.put('/api/memorias/:id',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const memoria = await Memoria.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!memoria) return res.status(404).json({ message: 'Memoria no encontrada' });
      res.json(memoria);
    } catch (err) {
      res.status(400).json({ message: 'Error al actualizar la memoria' });
    }
  }
);

app.delete('/api/memorias/:id',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const memoria = await Memoria.findByIdAndDelete(req.params.id);
      if (!memoria) return res.status(404).json({ message: 'Memoria no encontrada' });
      res.json({ message: 'Memoria eliminada correctamente' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar la memoria' });
    }
  }
);

// ── Docentes Schema / Routes ──────────────────────────────────────────────────
const docenteSchema = new mongoose.Schema({
  nombre:             { type: String, required: true, trim: true },
  apellidos:          { type: String, required: true, trim: true },
  slug:               { type: String, required: true, unique: true, trim: true },
  tipo:               { type: String, enum: ['residente', 'no_residente'], required: true },
  cargo:              { type: String, trim: true },
  especialidad:       { type: String, trim: true },
  departamento:       { type: String, trim: true },
  fotoPerfil:         { type: String, trim: true },
  fotoPublicId:       { type: String, trim: true },
  descripcionGeneral: { type: String, trim: true },
  videoUrl:           { type: String, trim: true },
  educacion:          [{ titulo: String, institucion: String, anio: String }],
  idiomas:            [String],
  experienciaProfesional: [{ cargo: String, institucion: String, periodo: String }],
  reconocimientos:    [{ titulo: String, otorgadoPor: String, anio: String }],
  participacionEventos: [{ nombre: String, lugar: String, anio: String }],
  order:              { type: Number, default: 0 },
  isPublished:        { type: Boolean, default: true },
}, { timestamps: true });
const Docente = mongoose.model('Docente', docenteSchema);

app.get('/api/docentes', async (req, res) => {
  try {
    const tipo   = req.query.tipo;
    const filter = tipo ? { tipo } : {};
    const docentes = await Docente.find(filter).sort({ apellidos: 1, nombre: 1 });
    res.json(docentes);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener docentes' });
  }
});

app.get('/api/docentes/:slug', async (req, res) => {
  try {
    const docente = await Docente.findOne({ slug: req.params.slug });
    if (!docente) return res.status(404).json({ message: 'Docente no encontrado' });
    res.json(docente);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el docente' });
  }
});

app.post('/api/docentes',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const docente = new Docente(req.body);
      await docente.save();
      res.status(201).json(docente);
    } catch (err) {
      res.status(400).json({ message: 'Error al crear el docente' });
    }
  }
);

app.put('/api/docentes/:id',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const docente = await Docente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!docente) return res.status(404).json({ message: 'Docente no encontrado' });
      res.json(docente);
    } catch (err) {
      res.status(400).json({ message: 'Error al actualizar el docente' });
    }
  }
);

app.delete('/api/docentes/:id',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const docente = await Docente.findByIdAndDelete(req.params.id);
      if (!docente) return res.status(404).json({ message: 'Docente no encontrado' });
      res.json({ message: 'Docente eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar el docente' });
    }
  }
);

// ── Publicaciones Docentes Schema / Routes ────────────────────────────────────
const publicacionDocenteSchema = new mongoose.Schema({
  titulo:          { type: String, required: true, trim: true },
  volumen:         { type: String, required: true, trim: true },
  descripcion:     { type: String, trim: true },
  anio:            { type: String, trim: true },
  pdfUrl:          { type: String, trim: true },
  pdfPublicId:     { type: String, trim: true },
  portadaUrl:      { type: String, trim: true },
  portadaPublicId: { type: String, trim: true },
  isPublished:     { type: Boolean, default: true },
  order:           { type: Number, default: 0 },
}, { timestamps: true });
const PublicacionDocente = mongoose.model('PublicacionDocente', publicacionDocenteSchema);

app.get('/api/publicaciones-docentes', async (req, res) => {
  try {
    const publicaciones = await PublicacionDocente.find().sort({ order: 1 });
    res.json(publicaciones);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener publicaciones de docentes' });
  }
});

app.get('/api/publicaciones-docentes/:id', async (req, res) => {
  try {
    const publicacion = await PublicacionDocente.findById(req.params.id);
    if (!publicacion) return res.status(404).json({ message: 'Publicación no encontrada' });
    res.json(publicacion);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la publicación' });
  }
});

app.post('/api/publicaciones-docentes',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const publicacion = new PublicacionDocente(req.body);
      await publicacion.save();
      res.status(201).json(publicacion);
    } catch (err) {
      res.status(400).json({ message: 'Error al crear la publicación' });
    }
  }
);

app.put('/api/publicaciones-docentes/:id',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const publicacion = await PublicacionDocente.findByIdAndUpdate(
        req.params.id, req.body, { new: true, runValidators: true }
      );
      if (!publicacion) return res.status(404).json({ message: 'Publicación no encontrada' });
      res.json(publicacion);
    } catch (err) {
      res.status(400).json({ message: 'Error al actualizar la publicación' });
    }
  }
);

app.delete('/api/publicaciones-docentes/:id',
  authMiddleware, roleMiddleware(['superadmin', 'admin']), doubleCsrfProtection,
  async (req, res) => {
    try {
      const publicacion = await PublicacionDocente.findByIdAndDelete(req.params.id);
      if (!publicacion) return res.status(404).json({ message: 'Publicación no encontrada' });
      res.json({ message: 'Publicación eliminada correctamente' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar la publicación' });
    }
  }
);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  // CSRF errors from doubleCsrfProtection
  if (err.code === 'EBADCSRFTOKEN' || err.message?.includes('csrf')) {
    return res.status(403).json({ message: 'Token CSRF inválido.' });
  }
  console.error('[SERVER] Unhandled error:', err.message);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
