var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);

http.listen(4040, function(){
  console.log('listening on *:4040');
});

//connect to database
mongoose.connect('mongodb://localhost/patient1', function(err) {
    if (err) throw err;
    else console.log('db is working');
});

//schema = kind of data saved into mongodb application
//the function takes an object of the data that you have
var patientSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNo: String,
    lastVisitDate: String,
    currentStatus: String
});

//assign schema to Patient model
var PatientInfo = mongoose.model('PatientInfo', patientSchema);

io.sockets.on('connection', function(socket){
    socket.on('add patient', function(first, last, phone, visit, stat){

        //store patient information to db as msg (described in schema)
        var newPatient = new PatientInfo ({
            firstName: first,
            lastName: last,
            phoneNo: phone,
            lastVisitDate: visit,
            currentStatus: stat
        });

        newPatient.save();
    });
});

app.use(express.static(__dirname+'/public'));
