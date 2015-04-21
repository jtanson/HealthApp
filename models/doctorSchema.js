var mongoose = require('mongoose');

var doctorSchema = mongoose.Schema({
	email: String, 
    firstName: String,
    lastName: String
});

module.exports = mongoose.model('DoctorInfo', doctorSchema);