const mongoose = require('mongoose')
const schema = require('../schemas/segnalazione.schema');
module.exports = mongoose.model('report', schema);
