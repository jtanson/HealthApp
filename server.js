var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);

var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var flash    = require('connect-flash');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


http.listen(4040, function(){
  console.log('the magic happens on port *:4040');
});


//connect to mongo database
mongoose.connect('mongodb://localhost/combinedb', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});


//pass passport for configuration
require('./config/passport')(passport);


//schema = kind of data saved into mongodb application
//the function takes an object of the data that you have
var msgSchema = mongoose.Schema({
    msg: String,
    time: {type: Date, default: Date.now()} 
});


//assign schema to  model
var Chat = mongoose.model('Messages', msgSchema);
// var Patient = mongoose.model('Infos', patientSchema);
//patientSchema moved under models
//msgSchema for Chat to be moved in models folder

var Patient = require('./models/patientSchema2.js');
var Doctor = require('./models/doctorSchema.js');
var Visit = require('./models/visitSchema.js');


app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));


//to view as html
//app.set("view options", {layout: false});
//app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovejavascript' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());


//ROUTES
// load routes and pass in our app and fully configured passport
require('./routes/authentication.js')(app, passport); 


var actions = require('./routes/actions');
app.use('/actions', actions);
var actionsDoctor = require('./routes/actionsDoctor');
app.use('/actionsDoctor', actionsDoctor);
var actionsVisit = require('./routes/actionsVisit');
app.use('/actionsVisit', actionsVisit);
// var routes = require('./routes/index');
// app.use('/', routes);


//GET to view list
app.get('/list', function (req, res) {
    Patient.find(function (err, doc) {
        res.send(doc);
    })
});

app.get('/listDoctors', function (req, res) {
    Doctor.find(function (err, doc) {
        res.send(doc);
    })
});

app.get('/listVisits/:id', function(req, res, next) {
  // Visit.findById(req.params.id, function (err, post) {
  Visit.find({'id' : req.params.id}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


app.get('/listDoctorInfo/:id', function(req, res, next) {
  // Visit.findById(req.params.id, function (err, post) {
  Patient.find({'doctor' : req.params.id}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

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

// app.listen(4040);
app.use(express.static(__dirname+'/views'));
module.exports = app;
