const mongoose = require('mongoose')
const schema = require('../schemas/richiestaGdS.schema');
module.exports = mongoose.model('gds_request', schema);
