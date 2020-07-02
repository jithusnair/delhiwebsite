var mongoose = require('mongoose');

var ExamSchema = new mongoose.Schema({
    sectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sector"
    },
    examTitle: String,
    abouts: Array,
    details: Object,
});

module.exports = mongoose.model('Exam', SectorSchema);