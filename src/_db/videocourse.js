var mongoose = require('mongoose');

var OnlineClassSchema = new mongoose.Schema({
    courseTitle: String,
    price: Number,
    courseValidity: Number, // Days the course will be valid from the date of purchase
    features: [String],
    image: 
        {
            filename: String,
            url: String
        },
    demoVideo: String,
    launchDate: Date,
    published: {type:Boolean, default: false} // Whether course is to be published  
});

module.exports = mongoose.model('VideoCourseDetail', OnlineClassSchema);
