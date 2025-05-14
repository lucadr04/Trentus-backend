const mongoose = require('mongoose');

const schemaRichiestaGdS = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email è obbligatoria'], // Campo obbligatorio con messaggio di errore
    unique: true, // Garantisce l'unicità dell'email
    match: [/.+\@.+\..+/, 'Inserire un indirizzo email valido'] // Valida il formato dell'email
  },
  passwordHash: {
    type: String,
    required: true
  },
  titolo: {
    type: String,
    required: [true, "Il titolo è obbligatorio"],
    maxlength: [64, "Il titolo può avere massimo 64 caratteri"]
  },
  azienda: {
    type: String,
    required: [true, "Il nome dell'azienda è obbligatorio"],
    maxlength: [64, "Il nome dell'azienda può avere massimo 64 caratteri"]
  },
  url: {
    type: String,
    required: false,
    maxlength: [255, "Il contenuto può avere massimo 255 caratteri"]
  },
  foto: {
    type: String,
    required: true
  },
  descrizione: {
    type: String,
    required: false,
    maxlength: [255, "Il contenuto può avere massimo 255 caratteri"]
  },
  confermata: {
    type: Boolean,
    required: false,
    default: false
  }
}, {
  timestamps: true // Per aggiungere automaticamente campi createdAt e updatedAt
});

module.exports = schemaRichiestaGdS;