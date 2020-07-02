var mongoose = require('mongoose');

var PetitionerSchema = new mongoose.Schema({
    fullname: String,
    mobile: Number,
    profession: String,
    email: String,
    dob: Date,
    address: String,
    created: {type: Date, default: Date.now},
});


module.exports = mongoose.model('Petitioner', PetitionerSchema);