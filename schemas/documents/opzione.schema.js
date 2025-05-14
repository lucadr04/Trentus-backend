const mongoose = require('mongoose');

const opSingolaSchema = new mongoose.Schema({
  opzione: {
    type: String,
    maxlength: [128, "L'opzione può avere al massimo 128 caratteri"],
    required: [true, "Il testo è obbligatorio"]
  }
}, { _id: false });

const opRaccoltaSchema = new mongoose.Schema({ //domanda con serie di potenziali risposte
  domanda: {
    type: String,
    maxlength: [255, "Il testo può avere massimo 255 caratteri"],
    required: [true, "Il testo è obbligatorio"]
  },
  opzioni: [{
    type: [opSingolaSchema],
    required: true
  }],
  tipo: {
    type: String,
    enum: ["radio", "checkbox"], // Specifica se è una scelta singola (radio) o multipla (checkbox).
    required: [true, "Il tipo di opzione è obbligatorio"]
  }
}, { _id: false });

const opApertaSchema = new mongoose.Schema({
  domanda: {
    type: String,
    required: [true, "La domanda è obbligatoria"],
    maxlength: [255, "La domanda può avere massimo 256 caratteri"]
  },
}, { _id: false });

const opBaseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['singola', 'raccolta', 'aperta'], 
  },
}, { discriminatorKey: 'type', _id: false }
);

// Collegare i discriminatori
opBaseSchema.discriminator('singola', opSingolaSchema);
opBaseSchema.discriminator('raccolta', opRaccoltaSchema);
opBaseSchema.discriminator('aperta', opApertaSchema);

module.exports = {
  opSingolaSchema,
  opBaseSchema
};