var mongoose = require('mongoose');

var videoSchema = new mongoose.Schema({
    courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VideoCourseDetail"
    },
    title: String,
    description: String,
    link: String
});

module.exports = mongoose.model('Video', videoSchema);