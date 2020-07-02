var mongoose = require('mongoose');

var SectorSchema = new mongoose.Schema({
    sectorTitle: String,  
});

module.exports = mongoose.model('Sector', SectorSchema);
