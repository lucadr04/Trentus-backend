const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const {v4:uuidv4} = require('uuid');
// Define the directory for uploads
const uploadDir = path.join(__dirname, '../public/images');

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Set the destination directory
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);  // Generate a unique filename with the extension
    cb(null, uniqueName);  // Set the filename to be the unique one
  }
});

// Initialize multer with custom storage
exports.upload = multer({ storage: storage, limits: {fileSize: 5*1024*1024}});

// Middleware per ridimensionare e sovrascrivere l'immagine
exports.resizeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(); // Se non ci sono file, passa al prossimo middleware
    }

    // Percorso del file originale appena caricato
    const inputPath = path.join(__dirname, '../public/images', req.file.filename);
    
    // Percorso temporaneo per il file ridimensionato
    const tempPath = path.join(__dirname, '../public/images', `temp-${req.file.filename}`);

    // Ridimensiona l'immagine e salvala temporaneamente
    await sharp(inputPath)
      .resize(150)  // Modifica le dimensioni come desideri
      .toFormat('png')   // Converte in formato JPEG
      .toFile(tempPath);  // Salva il file ridimensionato temporaneamente

    // Sovrascrivi il file originale con l'immagine ridimensionata
    fs.renameSync(tempPath, inputPath);  // Sovrascrive il file originale con il ridimensionato

    // Aggiungi il percorso dell'immagine sovrascritta a req (per uso successivo, se necessario)
    req.resizedImagePath = inputPath;

    return next();  // Passa al prossimo middleware o alla route
  } catch (error) {
    return res.status(500).json({ message: 'Errore durante il ridimensionamento dell\'immagine', error: error.message });
  }
};

