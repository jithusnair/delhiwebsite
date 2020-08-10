import Sectors from '../../../_db/sector';
import Exams from '../../../_db/exam';
import TestPacks from '../../../_db/testpack';

export async function get(req, res, next) {
    let message;

    let sectors;
    let exams;
    
    Sectors.find({}).exec()
    .then((docs)=> {
        sectors = docs;
        return Exams.find({}).select('_id examShortTitle sectorId').exec();
    })
    .then((docs)=> {
        exams = docs;
        return TestPacks.find({published:true}).exec();
    })
    .then((docs)=> {        
        message = {success: true, sectors: sectors, exams: exams, testPacks: docs};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't get videos from database! 
            Please try again later.`
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}