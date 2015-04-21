var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Doctor = require('../models/doctorSchema.js');

/* POST /todos */
router.post('/', function(req, res, next) {
  Doctor.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


// /* GET /todos listing. */
// router.get('/', function(req, res, next) {
//   Doctor.find(function (err, patients) {
//     if (err) return next(err);
//     res.json(patients);
//   });
// });

// /* GET /todos/id */
// router.get('/:id', function(req, res, next) {
//   Doctor.findById(req.params.id, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

// /* PUT /todos/:id */
// router.put('/:id', function(req, res, next) {
//   Doctor.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

// /* DELETE /todos/:id */
// router.delete('/:id', function(req, res, next) {
//   Doctor.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

module.exports = router;
