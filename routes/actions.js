var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Patient = require('../models/patientSchema2.js');
// var patientSchema = mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     phoneNo: String,
//     lastVisitDate: String,
//     currentStatus: String
// });

// var Patient = mongoose.model('Details', patientSchema);


/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Patient.find(function (err, patients) {
    if (err) return next(err);
    res.json(patients);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Patient.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Patient.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Patient.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Patient.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
