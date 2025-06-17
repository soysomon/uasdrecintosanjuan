require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const estadosFinancierosRoutes = require('./estados/estadofinanciero');
const reservationRoutes = require('./routes/reservationRoutes'); // Added reservation routes
const IpAttempt = require('./models/IpAttempt');

const app = express();
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://uasdrecintosanjuan-fe-production.up.railway.app',
  'https://uasdrecintosanjuan.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/api/estados-financieros', estadosFinancierosRoutes);
app.use('/api/reservations', reservationRoutes); // Added reservation routes

// S3 Client Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const bucketName = process.env.AWS_S3_BUCKET || 'uasd-recinto-sanjuan-media';

const getS3PublicUrl = (key) => {
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
};

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    cron.schedule('0 0 * * *', async () => {
      try {
        const result = await IpAttempt.deleteMany({
          lastAttempt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });
        console.log(`Eliminados ${result.deletedCount} registros antiguos de IpAttempt`);
      } catch (error) {
        console.error('Error al eliminar registros de IpAttempt:', error);
      }
    });
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));

  const newsSchema = new mongoose.Schema({
    title: String,
    sections: [{
      images: [{
        url: String,
        publicId: String,
        displayOptions: {
          size: { type: String, default: 'medium' },
          alignment: { type: String, default: 'center' },
          caption: String,
          cropMode: { type: String, default: 'cover' }
        }
      }],
      text: String,
      videoUrl: { type: String, trim: true },
      pdf: {
        url: { type: String, trim: true },
        publicId: { type: String, trim: true }
      }
    }],
    date: Date,
    category: String,
  });
  const News = mongoose.model('News', newsSchema);
  
  const authController = require('./auth/authController');
  const { authMiddleware } = require('./auth/authMiddleware');
  const { roleMiddleware } = require('./auth/roleMiddleware');
  
  app.post('/api/auth/change-password', authMiddleware, authController.changePassword);
  app.post('/api/auth/login', authController.login);
  app.get('/api/auth/me', authMiddleware, authController.getCurrentUser);
  app.get('/api/auth/blocked-ips', authMiddleware, roleMiddleware(['superadmin']), authController.getBlockedIps);
  app.get('/api/users', authMiddleware, roleMiddleware(['superadmin']), authController.getUsers);
  app.post('/api/users', authMiddleware, roleMiddleware(['superadmin']), authController.createUser);
  app.put('/api/users/:id', authMiddleware, roleMiddleware(['superadmin']), authController.updateUser);
  app.delete('/api/users/:id', authMiddleware, roleMiddleware(['superadmin']), authController.deleteUser);
  
  // News Routes
  app.post('/api/news', authMiddleware, roleMiddleware(['superadmin', 'admin']), async (req, res) => {

    try {
      const { date, ...rest } = req.body;
      const newsData = {
        ...rest,
        date: new Date(`${date}T00:00:00Z`), // Forzar UTC
      };
      const news = new News(newsData);
      await news.save();
      res.status(201).json(news);
    } catch (err) {
      console.error('Error al crear noticia:', err);
      res.status(400).json({ message: 'Error al crear la noticia', error: err.message });
    }
  });
  
  app.get('/api/news', async (req, res) => {
    try {
      const news = await News.find();
      res.json(news);
    } catch (err) {
      console.error('Error al obtener noticias:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
  
  app.get('/api/news/:id', async (req, res) => {
    try {
      const news = await News.findById(req.params.id);
      if (!news) return res.status(404).json({ message: 'Noticia no encontrada' });
      res.json(news);
    } catch (err) {
      console.error('Error al obtener noticia:', err);
      res.status(500).json({ message: 'Error al obtener la noticia' });
    }
  });
  
  app.put('/api/news/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), async (req, res) => {

    try {
      const { date, ...rest } = req.body;
      const updateData = {
        ...rest,
        date: new Date(`${date}T00:00:00Z`), // Forzar UTC
        sections: req.body.sections.map(section => {
          const { id, ...sectionRest } = section; // Elimina el campo "id"
          return sectionRest;
        })
      };
      const news = await News.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!news) {
        return res.status(404).json({ message: 'Noticia no encontrada' });
      }
      res.json(news);
    } catch (err) {
      console.error('Error al actualizar noticia:', err);
      res.status(400).json({ message: 'Error al actualizar la noticia', error: err.message });
    }
  });
  
  app.delete('/api/news/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), async (req, res) => {

    try {
      const news = await News.findByIdAndDelete(req.params.id);
      if (!news) {
        return res.status(404).json({ message: 'Noticia no encontrada' });
      }
      res.json({ message: 'Eliminado' });
    } catch (err) {
      console.error('Error al eliminar noticia:', err);
      res.status(500).json({ message: 'Error al eliminar la noticia' });
    }
  });

// Multer Configuration
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, 'temp');
    try {
      fs.ensureDirSync(tempDir);
      cb(null, tempDir);
    } catch (error) {
      console.error('Error creating temp directory:', error);
      cb(new Error('Failed to create temporary directory'), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: tempStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)'));
    }
    cb(null, true);
  }
});

// Image Upload Route with Quality Preservation
app.post('/api/upload-image', upload.single('file'), async (req, res) => {
  try {
    console.log('Received image upload request');
    if (!req.file) {
      console.error('No file provided in request');
      return res.status(400).json({ success: false, error: 'No se proporcionó ningún archivo' });
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size, 'MIME Type:', req.file.mimetype);

    // Read file into memory
    const fileContent = await fs.readFile(req.file.path);
    console.log('File read successfully, size:', fileContent.length);

    const fileKey = `news_images/${path.basename(req.file.originalname, path.extname(req.file.originalname)).replace(/\s+/g, '_')}_${Date.now()}${path.extname(req.file.originalname)}`;
    console.log('Generated S3 key:', fileKey);

    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileContent,
      ContentType: req.file.mimetype, // Ensure correct MIME type is set
      Metadata: {
        'original-filename': req.file.originalname,
        'content-type': req.file.mimetype,
        'upload-date': new Date().toISOString(),
      },
    };
    console.log('Uploading to S3 with params:', uploadParams);

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);
    console.log('Upload to S3 successful');

    const url = getS3PublicUrl(fileKey);
    console.log('Generated public URL:', url);

    // Verify file size after upload by fetching metadata from S3
    const headResponse = await axios.head(url);
    const uploadedSize = parseInt(headResponse.headers['content-length'], 10);
    console.log('Uploaded file size:', uploadedSize);
    if (uploadedSize !== fileContent.length) {
      console.error('File size mismatch after upload. Original:', fileContent.length, 'Uploaded:', uploadedSize);
    }

    await fs.remove(req.file.path);
    console.log('Temporary file removed');

    res.json({
      success: true,
      imageUrl: url,
      public_id: fileKey,
      format: path.extname(req.file.originalname).substring(1),
      resourceType: 'image'
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    if (req.file && req.file.path) {
      try {
        await fs.remove(req.file.path);
        console.log('Temporary file cleaned up');
      } catch (cleanupError) {
        console.error('Error al limpiar archivo temporal:', cleanupError);
      }
    }
    res.status(500).json({
      success: false,
      error: 'Error al subir la imagen',
      details: error.message
    });
  }
});

// Other Routes (Slides, Memorias, Docentes, Publicaciones)
const slideSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  cta: {
    text: String,
    link: String
  },
  image: String,
  color: String,
  order: Number,
  displayMode: { type: String, enum: ['normal', 'hover'], default: 'normal' }
});
const Slide = mongoose.model('Slide', slideSchema);

app.post('/api/slides', async (req, res) => {
  console.log('Creando nuevo slide:', req.body);
  const slide = new Slide(req.body);
  await slide.save();
  res.json(slide);
});

app.get('/api/slides', async (req, res) => {
  const slides = await Slide.find().sort({ order: 1 });
  res.json(slides);
});

app.put('/api/slides/:id', async (req, res) => {
  console.log('Actualizando slide:', req.params.id, req.body);
  const slide = await Slide.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(slide);
});

app.delete('/api/slides/:id', async (req, res) => {
  await Slide.findByIdAndDelete(req.params.id);
  res.json({ message: 'Eliminado' });
});

const memoriaSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  pdfUrl: { type: String, trim: true },
  pdfPublicId: { type: String, trim: true },
  videoUrl: { type: String, trim: true },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  contentSections: [{
    sectionType: {
      type: String,
      enum: ['text', 'stats', 'table', 'gallery', 'timeline', 'list', 'quote', 'contact'],
      required: true
    },
    title: { type: String, trim: true },
    content: { type: mongoose.Schema.Types.Mixed },
    order: { type: Number, default: 0 }
  }]
}, { timestamps: true });

const Memoria = mongoose.model('Memoria', memoriaSchema);

app.get('/api/memorias', async (req, res) => {
  try {
    const memorias = await Memoria.find().sort({ order: 1 });
    res.json(memorias);
  } catch (err) {
    console.error('Error obteniendo memorias:', err);
    res.status(500).json({ message: 'Error al obtener memorias' });
  }
});

app.get('/api/memorias/:slug', async (req, res) => {
  try {
    const memoria = await Memoria.findOne({ slug: req.params.slug });
    if (!memoria) {
      return res.status(404).json({ message: 'Memoria no encontrada' });
    }
    res.json(memoria);
  } catch (err) {
    console.error('Error obteniendo memoria:', err);
    res.status(500).json({ message: 'Error al obtener la memoria' });
  }
});

app.post('/api/memorias', async (req, res) => {
  try {
    const memoria = new Memoria(req.body);
    await memoria.save();
    res.status(201).json(memoria);
  } catch (err) {
    console.error('Error creando memoria:', err);
    res.status(400).json({ message: 'Error al crear la memoria', error: err.message });
  }
});

app.put('/api/memorias/:id', async (req, res) => {
  try {
    const memoria = await Memoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!memoria) {
      return res.status(404).json({ message: 'Memoria no encontrada' });
    }
    res.json(memoria);
  } catch (err) {
    console.error('Error actualizando memoria:', err);
    res.status(400).json({ message: 'Error al actualizar la memoria', error: err.message });
  }
});

app.delete('/api/memorias/:id', async (req, res) => {
  try {
    const memoria = await Memoria.findByIdAndDelete(req.params.id);
    if (!memoria) {
      return res.status(404).json({ message: 'Memoria no encontrada' });
    }
    res.json({ message: 'Memoria eliminada correctamente' });
  } catch (err) {
    console.error('Error eliminando memoria:', err);
    res.status(500).json({ message: 'Error al eliminar la memoria' });
  }
});

const docenteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellidos: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  tipo: { type: String, enum: ['residente', 'no_residente'], required: true },
  cargo: { type: String, trim: true },
  especialidad: { type: String, trim: true },
  departamento: { type: String, trim: true },
  fotoPerfil: { type: String, trim: true },
  fotoPublicId: { type: String, trim: true },
  descripcionGeneral: { type: String, trim: true },
  videoUrl: { type: String, trim: true },
  educacion: [{ titulo: String, institucion: String, anio: String }],
  idiomas: [String],
  experienciaProfesional: [{ cargo: String, institucion: String, periodo: String }],
  reconocimientos: [{ titulo: String, otorgadoPor: String, anio: String }],
  participacionEventos: [{ nombre: String, lugar: String, anio: String }],
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const Docente = mongoose.model('Docente', docenteSchema);

app.get('/api/docentes', async (req, res) => {
  try {
    const tipo = req.query.tipo;
    const filter = tipo ? { tipo } : {};
    const docentes = await Docente.find(filter).sort({ apellidos: 1, nombre: 1 });
    res.json(docentes);
  } catch (err) {
    console.error('Error obteniendo docentes:', err);
    res.status(500).json({ message: 'Error al obtener docentes' });
  }
});

app.get('/api/docentes/:slug', async (req, res) => {
  try {
    const docente = await Docente.findOne({ slug: req.params.slug });
    if (!docente) {
      return res.status(404).json({ message: 'Docente no encontrado' });
    }
    res.json(docente);
  } catch (err) {
    console.error('Error obteniendo docente:', err);
    res.status(500).json({ message: 'Error al obtener el docente' });
  }
});

app.post('/api/docentes', async (req, res) => {
  try {
    const docente = new Docente(req.body);
    await docente.save();
    res.status(201).json(docente);
  } catch (err) {
    console.error('Error creando docente:', err);
    res.status(400).json({ message: 'Error al crear el docente', error: err.message });
  }
});

app.put('/api/docentes/:id', async (req, res) => {
  try {
    const docente = await Docente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!docente) {
      return res.status(404).json({ message: 'Docente no encontrado' });
    }
    res.json(docente);
  } catch (err) {
    console.error('Error actualizando docente:', err);
    res.status(400).json({ message: 'Error al actualizar el docente', error: err.message });
  }
});

app.delete('/api/docentes/:id', async (req, res) => {
  try {
    const docente = await Docente.findByIdAndDelete(req.params.id);
    if (!docente) {
      return res.status(404).json({ message: 'Docente no encontrado' });
    }
    res.json({ message: 'Docente eliminado correctamente' });
  } catch (err) {
    console.error('Error eliminando docente:', err);
    res.status(500).json({ message: 'Error al eliminar el docente' });
  }
});

const publicacionDocenteSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  volumen: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  anio: { type: String, trim: true },
  pdfUrl: { type: String, trim: true },
  pdfPublicId: { type: String, trim: true },
  portadaUrl: { type: String, trim: true },
  portadaPublicId: { type: String, trim: true },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const PublicacionDocente = mongoose.model('PublicacionDocente', publicacionDocenteSchema);

app.get('/api/publicaciones-docentes', async (req, res) => {
  try {
    const publicaciones = await PublicacionDocente.find().sort({ order: 1 });
    res.json(publicaciones);
  } catch (err) {
    console.error('Error obteniendo publicaciones:', err);
    res.status(500).json({ message: 'Error al obtener publicaciones de docentes' });
  }
});

app.get('/api/publicaciones-docentes/:id', async (req, res) => {
  try {
    const publicacion = await PublicacionDocente.findById(req.params.id);
    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    res.json(publicacion);
  } catch (err) {
    console.error('Error obteniendo publicación:', err);
    res.status(500).json({ message: 'Error al obtener la publicación' });
  }
});

app.post('/api/publicaciones-docentes', async (req, res) => {
  try {
    const publicacion = new PublicacionDocente(req.body);
    await publicacion.save();
    res.status(201).json(publicacion);
  } catch (err) {
    console.error('Error creando publicación:', err);
    res.status(400).json({ message: 'Error al crear la publicación', error: err.message });
  }
});

app.put('/api/publicaciones-docentes/:id', async (req, res) => {
  try {
    const publicacion = await PublicacionDocente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    res.json(publicacion);
  } catch (err) {
    console.error('Error actualizando publicación:', err);
    res.status(400).json({ message: 'Error al actualizar la publicación', error: err.message });
  }
});

app.delete('/api/publicaciones-docentes/:id', async (req, res) => {
  try {
    const publicacion = await PublicacionDocente.findByIdAndDelete(req.params.id);
    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    res.json({ message: 'Publicación eliminada correctamente' });
  } catch (err) {
    console.error('Error eliminando publicación:', err);
    res.status(500).json({ message: 'Error al eliminar la publicación' });
  }
});

// PDF Upload Route
app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {
  try {
    console.log('Received PDF upload request');
    if (!req.file) {
      console.error('No file provided in request');
      return res.status(400).json({ success: false, error: 'No se proporcionó ningún archivo' });
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size);

    if (req.file.mimetype !== 'application/pdf') {
      await fs.remove(req.file.path);
      console.error('Invalid file type:', req.file.mimetype);
      return res.status(400).json({ success: false, error: 'Solo se permiten archivos PDF' });
    }

    const fileKey = `pdfs/${path.basename(req.file.originalname, path.extname(req.file.originalname)).replace(/\s+/g, '_')}_${Date.now()}${path.extname(req.file.originalname)}`;
    console.log('Generated S3 key:', fileKey);

    const fileContent = await fs.readFile(req.file.path);
    console.log('File read successfully, size:', fileContent.length);

    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileContent,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };
    console.log('Uploading to S3 with params:', uploadParams);

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);
    console.log('Upload to S3 successful');

    const url = getS3PublicUrl(fileKey);
    console.log('Generated public URL:', url);

    await fs.remove(req.file.path);
    console.log('Temporary file removed');

    res.json({
      success: true,
      pdfUrl: url,
      public_id: fileKey,
      format: path.extname(req.file.originalname).substring(1),
      resourceType: 'pdf'
    });
  } catch (error) {
    console.error('Error al subir PDF:', error);
    if (req.file && req.file.path) {
      try {
        await fs.remove(req.file.path);
        console.log('Temporary file cleaned up');
      } catch (cleanupError) {
        console.error('Error al limpiar archivo temporal:', cleanupError);
      }
    }
    res.status(500).json({
      success: false,
      error: 'Error al subir el PDF',
      details: error.message
    });
  }
});

app.get('/api/get-upload-url', async (req, res) => {
  try {
    const fileName = req.query.fileName || 'default.pdf';
    const fileKey = `pdfs/${path.basename(fileName, path.extname(fileName)).replace(/\s+/g, '_')}_${Date.now()}${path.extname(fileName)}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      ContentType: 'application/pdf',
    };

    const command = new PutObjectCommand(uploadParams);
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
      signableHeaders: new Set(['content-type']),
    });

    const pdfUrl = getS3PublicUrl(fileKey);
    console.log('Generated pre-signed URL for:', fileKey);

    res.json({
      success: true,
      uploadUrl,
      fileKey,
      pdfUrl,
    });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    res.status(500).json({
      success: false,
      error: 'Error al generar URL de subida',
      details: error.message,
    });
  }
});

app.get('/api/pdf/:s3Key(*)', (req, res) => {
  const s3Key = req.params.s3Key;
  console.log(`Solicitud de PDF con Key: ${s3Key}`);
  const pdfUrl = getS3PublicUrl(s3Key);
  console.log(`Redireccionando a: ${pdfUrl}`);
  res.redirect(pdfUrl);
});

app.get('/api/debug-pdf/:url(*)', (req, res) => {
  const encodedUrl = req.params.url;
  const decodedUrl = decodeURIComponent(encodedUrl);
  console.log('URL recibida para depuración:', decodedUrl);
  res.json({
    original: decodedUrl,
    s3Info: {
      isS3: decodedUrl.includes('s3.amazonaws.com'),
      parts: decodedUrl.split('/'),
      host: new URL(decodedUrl).host,
      pathname: new URL(decodedUrl).pathname,
      bucket: decodedUrl.includes('s3.amazonaws.com') ?
              new URL(decodedUrl).host.split('.')[0] :
              'No es una URL de S3'
    }
  });
});

app.listen(5000, () => console.log('Servidor en 5000'));