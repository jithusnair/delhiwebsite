var mongoose = require('mongoose');

var OnlineClassSchema = new mongoose.Schema({
    courseTitle: String,
    price: Number,
	features: [String]
});

module.exports = mongoose.model('VideoCourseDetail', OnlineClassSchema);
