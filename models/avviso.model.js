const mongoose = require('mongoose')
const schema = require('../schemas/avviso.schema');
module.exports = mongoose.model('alert', schema);