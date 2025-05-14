const mongoose = require('mongoose')
const schema = require('../schemas/sondaggio.schema');
module.exports = mongoose.model('survey', schema);
