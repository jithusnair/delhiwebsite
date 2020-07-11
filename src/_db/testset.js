var mongoose = require('mongoose');

var SectionSchema = new mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter"
    },
    testSetTitle: String,
    examDuration: Number, // in minutes
    totalMarks: Number,
    totalQuestions: Number,
    negativeMarks: Number,
});

module.exports = mongoose.model('TestSet', SectionSchema);
