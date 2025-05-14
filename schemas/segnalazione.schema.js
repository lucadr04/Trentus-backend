const mongoose = require('mongoose');
const schemaRisposta = require('./documents/risposta.schema');

const schemaSegnalazione = new mongoose.Schema({
  risposte: {
    type: [schemaRisposta.rpSingolaSchema],
    required: [true, "È necessario fornire un lista di opzioni"]
  },
  commento: {
    type: String,
    required: false,
    maxlength: [255, "Il contenuto può avere massimo 255 caratteri"]
  },
  utente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  servizio_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servizio',
    required: true
  }
}, {
  timestamps: true // Per aggiungere automaticamente campi createdAt e updatedAt
});

module.exports = schemaSegnalazione;