var mongoose = require('mongoose');

var TestPackSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam"
    },
    testPackTitle: String,
    price: Number,
    courseValidity: Number, // Days the course will be valid from the date of purchase
    features: [String],
    image: {
            filename: String,
            url: String
    },
    sections: Array,
    chapters: Object,
    demoVideo: String,
    launchDate: Date,
    published: {type:Boolean, default: false} // Whether course is to be published  
});

module.exports = mongoose.model('TestPack', TestPackSchema);
