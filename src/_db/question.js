var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    qnNumber: Number,
    comprehension: Boolean,
    compImages: {
        type: [String],
        default: () => { return null; }
    }, // array with links to passage-images in S3
    passageNumber: Number,
    passage: String, // should exist only if comprehension is true
    quesImages: {  // array with links to question-images in S3
        type: [String],
        default: () => { return null; }
    }, 
    question: String,
    optionsAreImages: Boolean, // indicates if options array contains image-links or text
    options: Array, // options parsed from html and saved as array
                    //or array with links to question-images in S3
    optionsHtml: String,
    correctAns: Number, // as the index of 'options'
    detailedAnsImages: { // array with links to question-images in S3
        type: [String],
        default: () => { return null; }
    },
    detailedAns: String,
});

module.exports = mongoose.model('Question', QuestionSchema);