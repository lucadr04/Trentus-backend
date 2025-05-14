const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schemaUtente = new mongoose.Schema({
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
  preferiti:{
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servizio'
    }],
    required: false,
    default: [],
  },
  checkSuperAdmin:{
    type: Boolean,
    required: false
  }
}, {
  timestamps: true // Per aggiungere automaticamente campi createdAt e updatedAt
});


//metodo per confrontare le password
schemaUtente.methods.comparePassword = async function(passwordCandidata){
  console.log(`${passwordCandidata}: ${this.passwordHash}`)
  return bcrypt.compare(passwordCandidata, this.passwordHash);
}

module.exports = schemaUtente;