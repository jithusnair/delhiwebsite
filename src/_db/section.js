var mongoose = require('mongoose');

var SectionSchema = new mongoose.Schema({
    testPackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TestPack"
    },
    sectionTitle: String,  
});

module.exports = mongoose.model('Section', SectionSchema);
