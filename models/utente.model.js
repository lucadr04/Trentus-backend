const mongoose = require('mongoose')
const schema = require('../schemas/utente.schema');
module.exports = mongoose.model('user', schema);
