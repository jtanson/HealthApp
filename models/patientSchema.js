var mongoose = require('mongoose');

var patientSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNo: String,
    lastVisitDate: String,
    currentStatus: String
});

module.exports = mongoose.model('Details', patientSchema);

// var Patient = mongoose.model('PatientInfos', patientSchema);
// module.exports = Patient;