var mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: String,
    courseCollection: {type: String, required: true},
    amount: Number,
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'VideoCourseDetail'
    },
    courseValidity: Number, //days the course will be valid from the date of purchase
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'User' 
    },
    status: { 
        type: String, //created, failed, authorised, captured
        required: true 
    }, 
    // invoice number would be available only when the status is captured
    // the number should be unique for every financial year -
    // meaning if the date is April 1, the invoice number should reset.
    invoice: String, 
    lastUpdated: {type: Date, required: true}
});

module.exports = mongoose.model('Order', orderSchema);