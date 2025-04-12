require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron'); // Import node-cron
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const estadosFinancierosRoutes = require('./estados/estadofinanciero');
const IpAttempt = require('./models/IpAttempt'); // Move IpAttempt import up

const app = express();
app.use(express.json());

// Updated CORS configuration with more options
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/api/estados-financieros', estadosFinancierosRoutes);

// Configuración del cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIA4U7RPRX7OECPX4N5',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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'
  }
});

// Nombre del bucket de S3
const bucketName = process.env.AWS_S3_BUCKET || 'uasd-recinto-sanjuan-media';

// Función auxiliar para generar URL pública de S3
const getS3PublicUrl = (key) => {
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
};

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');

    // Configurar tarea de limpieza con node-cron
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
        size: { type: String, default: 'medium' }, // small, medium, large, full
        alignment: { type: String, default: 'center' }, // left, center, right
        caption: String,
        cropMode: { type: String, default: 'cover' } // cover, contain, none
      }
    }],
    text: String
  }],
  date: String,
  category: String,
});
const News = mongoose.model('News', newsSchema);

const authController = require('./auth/authController');
const { authMiddleware } = require('./auth/authMiddleware');
const { roleMiddleware } = require('./auth/roleMiddleware');



// Ruta para cambiar la contraseña del usuario actual
app.post('/api/auth/change-password', authMiddleware, authController.changePassword);
// Rutas de autenticación
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, authController.getCurrentUser);

//asegura que solo los superadmins puedan acceder
app.get('/api/auth/blocked-ips', authMiddleware, roleMiddleware(['superadmin']), authController.getBlockedIps);
// Rutas de gestión de usuarios (solo superadmin)
app.get('/api/users', authMiddleware, roleMiddleware(['superadmin']), authController.getUsers);
app.post('/api/users', authMiddleware, roleMiddleware(['superadmin']), authController.createUser);
app.put('/api/users/:id', authMiddleware, roleMiddleware(['superadmin']), authController.updateUser);
app.delete('/api/users/:id', authMiddleware, roleMiddleware(['superadmin']), authController.deleteUser);

// Rutas para noticias
app.post('/api/news', async (req, res) => {
  const news = new News(req.body);
  await news.save();
  res.json(news);
});

app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find();

    // Transformar datos antiguos si es necesario
    const transformedNews = news.map(item => {
      const doc = item.toObject();

      // Verificar si necesita transformación (datos antiguos con imageUrl)
      if (doc.sections && doc.sections.some(section => 'imageUrl' in section)) {
        doc.sections = doc.sections.map(section => {
          if ('imageUrl' in section) {
            // Transformar formato antiguo a nuevo
            return {
              images: section.imageUrl
                ? [{
                    url: section.imageUrl,
                    displayOptions: {
                      size: 'medium',
                      alignment: 'center',
                      cropMode: 'cover'
                    }
                  }]
                : [],
              text: section.text
            };
          }
          return section;
        });
      }

      return doc;
    });

    res.json(transformedNews);
  } catch (err) {
    console.error('Error al obtener noticias:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Noticia no encontrada' });

    // Transformar datos antiguos si es necesario
    const doc = news.toObject();
    if (doc.sections && doc.sections.some(section => 'imageUrl' in section)) {
      doc.sections = doc.sections.map(section => {
        if ('imageUrl' in section) {
          return {
            images: section.imageUrl
              ? [{
                  url: section.imageUrl,
                  displayOptions: {
                    size: 'medium',
                    alignment: 'center',
                    cropMode: 'cover'
                  }
                }]
              : [],
            text: section.text
          };
        }
        return section;
      });
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la noticia' });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.json({ message: 'Eliminado' });
});

// Modelo de Slide - definido antes de crear las rutas
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

// Rutas para slides
app.post('/api/slides', async (req, res) => {
  console.log('Creando nuevo slide:', req.body);
  const slide = new Slide(req.body);
  await slide.save();
  res.json(slide);
});

app.get('/api/slides', async (req, res) => {
  const slides = await Slide.find().sort({ order: 1 });
 // console.log('Enviando slides:', slides.length);
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

// Modelo de Memorias
const memoriaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  pdfUrl: {
    type: String,
    trim: true
  },
  pdfPublicId: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  // Nuevo campo para secciones de contenido
  contentSections: [{
    sectionType: {
      type: String,
      enum: ['text', 'stats', 'table', 'gallery', 'timeline', 'list', 'quote', 'contact'],
      required: true
    },
    title: { type: String, trim: true },
    content: { type: mongoose.Schema.Types.Mixed }, // Contenido flexible según el tipo
    order: { type: Number, default: 0 }
  }]
}, { timestamps: true });

const Memoria = mongoose.model('Memoria', memoriaSchema);

// Rutas para Memorias
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

// Modelo de Docentes
const docenteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tipo: {
    type: String,
    enum: ['residente', 'no_residente'],
    required: true
  },
  cargo: {
    type: String,
    trim: true
  },
  especialidad: {
    type: String,
    trim: true
  },
  departamento: {
    type: String,
    trim: true
  },
  fotoPerfil: {
    type: String,
    trim: true
  },
  fotoPublicId: {
    type: String,
    trim: true
  },
  descripcionGeneral: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  educacion: [{
    titulo: String,
    institucion: String,
    anio: String
  }],
  idiomas: [String],
  experienciaProfesional: [{
    cargo: String,
    institucion: String,
    periodo: String
  }],
  reconocimientos: [{
    titulo: String,
    otorgadoPor: String,
    anio: String
  }],
  participacionEventos: [{
    nombre: String,
    lugar: String,
    anio: String
  }],
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Docente = mongoose.model('Docente', docenteSchema);

// Rutas para Docentes
app.get('/api/docentes', async (req, res) => {
  try {
    const tipo = req.query.tipo; // 'residente' o 'no_residente'
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

// Modelo de Publicaciones de Docentes (Conoce tu Docente)
const publicacionDocenteSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  volumen: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  anio: {
    type: String,
    trim: true
  },
  pdfUrl: {
    type: String,
    trim: true
  },
  pdfPublicId: {
    type: String,
    trim: true
  },
  portadaUrl: {
    type: String,
    trim: true
  },
  portadaPublicId: {
    type: String,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const PublicacionDocente = mongoose.model('PublicacionDocente', publicacionDocenteSchema);

// Rutas para Publicaciones de Docentes
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

// Configuración para almacenamiento temporal en disco para archivos
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, 'temp');
    fs.ensureDirSync(tempDir); // Asegura que el directorio exista
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: tempStorage });


// Ruta para subir imágenes a S3
app.post('/api/upload-image', upload.single('file'), async (req, res) => {
  try {
    console.log('Received image upload request');
    if (!req.file) {
      console.error('No file provided in request');
      return res.status(400).json({ success: false, error: 'No se proporcionó ningún archivo' });
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size);

    const fileKey = `news_images/${path.basename(req.file.originalname, path.extname(req.file.originalname)).replace(/\s+/g, '_')}_${Date.now()}${path.extname(req.file.originalname)}`;
    console.log('Generated S3 key:', fileKey);

    console.log('Reading file from:', req.file.path);
    const fileContent = await fs.readFile(req.file.path);
    console.log('File read successfully, length:', fileContent.length);

    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileContent,
      ContentType: req.file.mimetype
    };
    console.log('Uploading to S3 with params:', uploadParams);

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);
    console.log('Upload to S3 successful');

    const url = getS3PublicUrl(fileKey);
    console.log('Generated public URL:', url);

    console.log('Removing temporary file:', req.file.path);
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

//---------------------------------------------------------------------------------------------------------

// Ruta para subir PDFs a S3
app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {
  try {
    console.log('Received PDF upload request');
    if (!req.file) {
      console.error('No file provided in request');
      return res.status(400).json({ success: false, error: 'No se proporcionó ningún archivo' });
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size);

    // Validar que sea un PDF
    if (req.file.mimetype !== 'application/pdf') {
      await fs.remove(req.file.path);
      console.error('Invalid file type:', req.file.mimetype);
      return res.status(400).json({ success: false, error: 'Solo se permiten archivos PDF' });
    }

    // Generar una clave única para el PDF en S3 (prefijo diferente a imágenes)
    const fileKey = `pdfs/${path.basename(req.file.originalname, path.extname(req.file.originalname)).replace(/\s+/g, '_')}_${Date.now()}${path.extname(req.file.originalname)}`;
    console.log('Generated S3 key:', fileKey);

    console.log('Reading file from:', req.file.path);
    const fileContent = await fs.readFile(req.file.path);
    console.log('File read successfully, length:', fileContent.length);

    const uploadParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileContent,
      ContentType: req.file.mimetype
    };
    console.log('Uploading to S3 with params:', uploadParams);

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);
    console.log('Upload to S3 successful');

    const url = getS3PublicUrl(fileKey);
    console.log('Generated public URL:', url);

    console.log('Removing temporary file:', req.file.path);
    await fs.remove(req.file.path);
    console.log('Temporary file removed');

    res.json({
      success: true,
      pdfUrl: url, // Cambiado de imageUrl a pdfUrl para coincidir con el frontend
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

//------------------------------------------------------------------------------------------------------------


// Ruta que me genera una URL pre-firmada para la subida directa a S3
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
      expiresIn: 3600, // URL válida por 1 hora
      signableHeaders: new Set(['content-type']), // Solo firmar content-type
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
//------------------------------------------------------------------------------------------------------------------

// Ruta proxy para servir PDFs
app.get('/api/pdf/:s3Key(*)', (req, res) => {
  const s3Key = req.params.s3Key;
  console.log(`Solicitud de PDF con Key: ${s3Key}`);

  // Crear URL pública directa
  const pdfUrl = getS3PublicUrl(s3Key);

  console.log(`Redireccionando a: ${pdfUrl}`);

  // Simplemente redireccionar
  res.redirect(pdfUrl);
});

// Ruta para depurar URLs
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