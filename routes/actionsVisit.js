var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Visit = require('../models/visitSchema.js');

//some methods may not be used

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Visit.find(function (err, patients) {
    if (err) return next(err);
    res.json(patients);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Visit.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Visit.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Visit.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Visit.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
