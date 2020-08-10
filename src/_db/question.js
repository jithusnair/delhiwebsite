var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    qnNumber: Number,
    hindiVersion: {    // Indicates if hindi version of the question is present
        type: Boolean,
        default: false,
    },
    comprehension: Boolean,
    compImages: { // array with links to passage-images in S3
        type: [String],
        default: () => { return null; }
    }, 
    passageNumber: Number,
    passage: String, // should exist only if comprehension is true
    passageHindi: {
        type: String, 
        default: null
    },
    quesImages: {  // array with links to question-images in S3
        type: [String],
        default: () => { return null; }
    }, 
    question: String,
    questionHindi: {
        type: String, 
        default: null
    },
    optionsAreImages: Boolean, // indicates if options array contains image-links or text
    options: Array, // options parsed from html and saved as array
                    //or array with links to question-images in S3
    optionsHindi: {
        type: [String], 
        default: () => { return null; }
    },
    optionsHtml: String,
    optionsHindiHtml: {
        type: String, 
        default: null
    },
    correctAns: Number, // as the index of 'options'
    detailedAnsImages: { // array with links to question-images in S3
        type: [String],
        default: () => { return null; }
    },
    detailedAns: String,
    detailedAnsHindi: {
        type: String,
        default: null,
    }
});

module.exports = mongoose.model('Question', QuestionSchema);