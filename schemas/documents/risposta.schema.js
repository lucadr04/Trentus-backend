const mongoose = require('mongoose');

const rpSingolaSchema = new mongoose.Schema({ 
  risposta: {
    type: String,
    maxlength: [128, "L'opzione può avere al massimo 128 caratteri"],
    required: [true, "Il testo è obbligatorio"]
  }
}, { _id: false });

const rpRaccoltaSchema = new mongoose.Schema({ //domanda con serie di potenziali risposte
  domanda: {
    type: String,
    maxlength: [255, "Il testo può avere massimo 255 caratteri"],
    required: [true, "Il testo è obbligatorio"]
  },
  risposte: [{
    type: [rpSingolaSchema],
    required: true
  }],
}, { _id: false });

const rpApertaSchema = new mongoose.Schema({
  domanda: {
    type: String,
    required: [true, "La domanda è obbligatoria"],
    maxlength: [255, "La domanda può avere massimo 256 caratteri"]
  },
  risposta: {
    type: String,
    maxlength: [128, "L'opzione può avere al massimo 128 caratteri"],
    required: [true, "Il testo è obbligatorio"]
  }
}, { _id: false });

const rpBaseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['singola', 'raccolta', 'aperta'], 
  },
}, { discriminatorKey: 'type', _id: false }
);

// Collegare i discriminatori
rpBaseSchema.discriminator('singola', rpSingolaSchema);
rpBaseSchema.discriminator('raccolta', rpRaccoltaSchema);
rpBaseSchema.discriminator('aperta', rpApertaSchema);

module.exports = {
  rpSingolaSchema,
  rpBaseSchema
};