const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { google } = require('googleapis');
const cors = require('cors');

// =================================================================
// 1. CONFIGURACIÓN INICIAL
// =================================================================

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configurar Multer para la subida de archivos temporales
const upload = multer({ dest: './tmp/' });


// =================================================================
// 2. AUTENTICACIÓN CON GOOGLE DRIVE
// =================================================================

// Autenticación con cuenta de servicio
const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// Crear un cliente de Google Drive
const drive = google.drive({ version: 'v3', auth });

// Prueba de conexión inicial al arrancar el servidor
drive.files.list({
  pageSize: 1,
  supportsAllDrives: true,
  includeItemsFromAllDrives: true,
}, (err, res) => {
  if (err) {
    console.error("❌ Error de autenticación con Google Drive:", err.message);
  } else {
    console.log("✅ Conexión con Google Drive exitosa.");
  }
});


// =================================================================
// 3. RUTAS DE LA APLICACIÓN (ENDPOINTS)
// =================================================================

// Ruta principal para mostrar la página de la biblioteca
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'biblioteca.html'));
});

// Ruta para subir un archivo
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('📥 Upload request received', {
      originalname: req.file && req.file.originalname,
      mimetype: req.file && req.file.mimetype,
      size: req.file && req.file.size,
      time: new Date().toISOString()
    });
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
    }
    const fileMetadata = {
      name: req.file.originalname,
      parents: ['1fDC8JDGWD0nk8Z5rfUdeCGyq1RNd8psd'],
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
      supportsAllDrives: true,
    });

    fs.unlinkSync(req.file.path);
    res.status(200).json({ fileId: response.data.id });
  } catch (error) {
    console.error('Error al subir archivo:', error.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// Ruta para listar todos los archivos de la carpeta
app.get('/files', async (req, res) => {
  try {
    const response = await drive.files.list({
      q: `'1fDC8JDGWD0nk8Z5rfUdeCGyq1RNd8psd' in parents and trashed=false`,
      pageSize: 100,
      fields: 'files(id, name, mimeType)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    res.status(200).json(response.data.files);
  } catch (error) {
    console.error('Error al listar archivos:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para previsualizar un archivo
app.get('/download/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileMeta = await drive.files.get({
      fileId,
      fields: 'name, mimeType',
      supportsAllDrives: true,
    });

    const stream = await drive.files.get(
      { fileId, alt: 'media', supportsAllDrives: true },
      { responseType: 'stream' }
    );

    res.setHeader('Content-Type', fileMeta.data.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileMeta.data.name}"`);
    stream.data.pipe(res);
  } catch (error) {
    console.error('Error al previsualizar archivo:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para forzar la descarga de un archivo
app.get('/force-download/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileMeta = await drive.files.get({
      fileId,
      fields: 'name, mimeType',
      supportsAllDrives: true,
    });

    const stream = await drive.files.get(
      { fileId, alt: 'media', supportsAllDrives: true },
      { responseType: 'stream' }
    );

    res.setHeader('Content-Type', fileMeta.data.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileMeta.data.name}"`);
    stream.data.pipe(res);
  } catch (error) {
    console.error('Error al descargar archivo:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// =================================================================
// 4. INICIAR EL SERVIDOR
// =================================================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});