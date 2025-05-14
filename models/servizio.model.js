const mongoose = require('mongoose')
const schema = require('../schemas/servizio.schema');
module.exports = mongoose.model('service', schema);
