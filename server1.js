var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);

http.listen(4040, function(){
  console.log('listening on *:4040');
});

//connect to database
mongoose.connect('mongodb://localhost/chat3', function(err) {
    if (err) throw err;
    else console.log('db is working');
});

//schema = kind of data saved into mongodb application
//the function takes an object of the data that you have
var msgSchema = mongoose.Schema({
    msg: String,
    time: {type: Date, default: Date.now()} 
});

//model Chat = to save any message that comes in
//link to Message schema
var Chat = mongoose.model('Messages', msgSchema);

io.sockets.on('connection', function(socket){
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
});

app.use(express.static(__dirname+'/public'));
