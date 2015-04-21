var mongoose = require('mongoose');

var visitSchema = mongoose.Schema({
    id: String,
    complaint: String,
    amount: String
});

module.exports = mongoose.model('VisitDetails', visitSchema);