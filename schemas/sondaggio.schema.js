const mongoose = require('mongoose');
const { opBaseSchema } = require('./documents/opzione.schema');

const schemaSondaggio = new mongoose.Schema({
  titolo: {
    type: String,
    required: [true, "Il titolo è obbligatorio"],
    maxlength: [64, "Il titolo può avere massimo 64 caratteri"]
  },
  corpo: { 
    type: [opBaseSchema],
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

module.exports = schemaSondaggio;