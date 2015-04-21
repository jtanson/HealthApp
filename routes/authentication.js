

var Doctor = require('../models/doctorSchema');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        //res.render('signup.ejs'); // load the index.ejs file
        res.render('secure.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/success', function(req, res) {
        // res.render('index.ejs'); // load the index.ejs file
        res.render('index.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });    

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/error', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('secure.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/success', // redirect to the secure profile section
        failureRedirect : '/error', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/continue', function(req, res) {

        // render the page and pass in any flash data if it exists
        // res.render('signup.ejs', { message: req.flash('signupMessage') });
        res.render('signup.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        // successRedirect : '/success#/DocInfo', // redirect to the secure profile section
        successRedirect : '/continue', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
