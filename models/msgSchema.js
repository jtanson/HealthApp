var mongoose = require('mongoose');

var msgSchema = mongoose.Schema({
    msg: String,
    time: {type: Date, default: Date.now()} 
});

module.exports = mongoose.model('Messages', msgSchema);
