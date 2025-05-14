const mongoose = require('mongoose')
const schema = require('../schemas/feedback.schema');
module.exports = mongoose.model('feedback', schema);
