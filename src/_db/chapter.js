var mongoose = require('mongoose');

var ChapterSchema = new mongoose.Schema({
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    },
    chapterTitle: String,  
});

module.exports = mongoose.model('Chapter', ChapterSchema);
