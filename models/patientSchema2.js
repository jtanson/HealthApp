var mongoose = require('mongoose');

// var patientSchema = mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     phoneNo: String,
//     lastVisitDate: String,
//     currentStatus: String
// });

var patientSchema2 = mongoose.Schema({
    firstName: String,
    lastName: String,
    //visits
    age: String, 		//to be changed to int
    doctor: String,
    createdAt: String,
    lastMod: String
});

module.exports = mongoose.model('Details2', patientSchema2);

// var Patient = mongoose.model('PatientInfos', patientSchema);
// module.exports = Patient;