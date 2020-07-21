var mongoose = require('mongoose');

var SubjectSchema = new mongoose.Schema({
    testSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TestSet"
    },
    subjectTitle: String,
});

module.exports = mongoose.model('Subject', SubjectSchema);