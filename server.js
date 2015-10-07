var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);

http.listen(4040, function(){
  console.log('listening on *:4040');
});

//connect to database
mongoose.connect('mongodb://localhost/combinedb', function(err) {
    if (err) throw err;
    else console.log('db is working');
});

//schema = kind of data saved into mongodb application
//the function takes an object of the data that you have
var msgSchema = mongoose.Schema({
    msg: String,
    time: {type: Date, default: Date.now()} 
});
var patientSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNo: String,
    lastVisitDate: String,
    currentStatus: String
});

//assign schema to  model
var Chat = mongoose.model('Messages', msgSchema);
var PatientInfo = mongoose.model('PatientInfos', patientSchema);

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

    socket.on('send msg', function(patient, data, dateString){

        //store data to db as msg (described in schema)
        var newMsg = new Chat ({msg: data});

        //then send message to everyone (using emit)
        newMsg.save(function (err) {
            if (err) throw err;
            else
                io.sockets.emit('get msg', patient, data, dateString);
        });
    });    

    socket.on('get patient', function() {
        // return PatientInfo.find();
        PatientInfo.find({}, 
            { _id: false, firstName: true, lastName: true, phoneNo: true, lastVisitDate: true, currentStatus: true }, 
            function (err, dbPatients) {
            io.sockets.emit('list patient', dbPatients);
        });
    });
});

app.use(express.static(__dirname+'/public'));
