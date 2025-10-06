const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para mostrar biblioteca.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'biblioteca.html'));
});

// Subir archivo a una carpeta específica de Google Drive
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // 1. Verificar que se recibió un archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
    }

    // 2. Definir los metadatos del archivo
    const fileMetadata = {
      name: req.file.originalname,
      parents: ['1fDC8JDGWD0nk8Z5rfUdeCGyq1RNd8psd'], // ID de la carpeta en la Unidad Compartida
    };

    // 3. Definir el contenido del archivo
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    console.log(`Subiendo archivo "${req.file.originalname}" a la Unidad Compartida...`);

    // 4. Llamar a la API para crear el archivo
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
      supportsAllDrives: true, 
    });

    // 5. Borrar el archivo temporal de la carpeta /tmp
    fs.unlinkSync(req.file.path);

    console.log(`Archivo subido con éxito. ID: ${response.data.id}`);
    res.status(200).json({ fileId: response.data.id });

  } catch (error) {
    console.error('Error detallado al subir archivo:', error);
    // Si el archivo temporal todavía existe, bórralo
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// Listar archivos de la carpeta 
app.get('/files', async (req, res) => {
  try {
    const response = await drive.files.list({
      q: `'1fDC8JDGWD0nk8Z5rfUdeCGyq1RNd8psd' in parents and trashed=false`,
      pageSize: 100,
      fields: 'files(id, name, mimeType)',
      // PARÁMETROS PARA UNIDADES COMPARTIDAS
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    res.status(200).json(response.data.files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Previsualizar archivo en el navegador (PDF/imagen)
app.get('/download/:id', async (req, res) => {
  const fileId = req.params.id;

  try {
    const fileMeta = await drive.files.get({
      fileId,
      fields: 'name, mimeType',
      supportsAllDrives: true, // PARÁMETRO PARA UNIDADES COMPARTIDAS
    });

    const mimeType = fileMeta.data.mimeType;

    const stream = await drive.files.get(
      { 
        fileId, 
        alt: 'media',
        supportsAllDrives: true, // PARÁMETRO PARA UNIDADES COMPARTIDAS
      },
      { responseType: 'stream' }
    );

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileMeta.data.name}"`);
    stream.data.pipe(res);
  } catch (error) {
    console.error('Error al previsualizar archivo:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Descargar archivo directamente al hacer clic
app.get('/force-download/:id', async (req, res) => {
  const fileId = req.params.id;

  try {
    const fileMeta = await drive.files.get({
      fileId,
      fields: 'name, mimeType',
      supportsAllDrives: true, // PARÁMETRO PARA UNIDADES COMPARTIDAS
    });

    const mimeType = fileMeta.data.mimeType;

    const stream = await drive.files.get(
      { 
        fileId, 
        alt: 'media',
        supportsAllDrives: true, // PARÁMETRO PARA UNIDADES COMPARTIDAS
      },
      { responseType: 'stream' }
    );

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileMeta.data.name}"`);
    stream.data.pipe(res);
  } catch (error) {
    console.error('Error al descargar archivo:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


