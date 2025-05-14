const mongoose = require('mongoose');
const { rpBaseSchema } = require('./documents/risposta.schema');

const schemaFeedback = new mongoose.Schema({
  risposte: { 
    type: [rpBaseSchema],
    required: true
  },
  utente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utente',
    required: true
  },
  sondaggio_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sondaggio',
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

module.exports = schemaFeedback;