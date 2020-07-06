var mongoose = require('mongoose');

var ExamSchema = new mongoose.Schema({
    sectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sector"
    },
    examTitle: String,
    heads: Array,
    details: Array,
});

module.exports = mongoose.model('Exam', ExamSchema);