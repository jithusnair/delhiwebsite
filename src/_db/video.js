var mongoose = require('mongoose');

var OnlineClassSchema = new mongoose.Schema({
    courseTitle: String,
	features: [String]
});

module.exports = mongoose.model('VideoCourseDetail', OnlineClassSchema);
