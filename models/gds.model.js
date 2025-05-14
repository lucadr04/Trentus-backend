const mongoose = require('mongoose')
const schema = require('../schemas/gds.schema');
module.exports = mongoose.model('gds', schema);