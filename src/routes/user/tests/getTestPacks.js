import Sectors from '../../../_db/sector';
import Exams from '../../../_db/exam';
import TestPacks from '../../../_db/testpack';
import Order from '../../../_db/order';

export async function get(req, res, next) {
    let message;

    if(!req.user || req.user.isAdmin) {
        message = {success:false, serverErr: 'You are not a registerd user'}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return
    }

    let sectors;
    let exams;

    let testPacks;
    
    Sectors.find({}).exec()
    .then((docs)=> {
        sectors = docs;
        return Exams.find({}).select('_id examShortTitle sectorId').exec();
    })
    .then((docs)=> {
        exams = docs;
        return TestPacks.find({}).exec();
    })
    .then((docs)=> { 
        testPacks = [...docs];
        return Order.find({
            courseCollection: "TestPack",
            userId: req.user._id, 
            status: 'captured',
            validTill: { $gte: new Date()}
        })
        .exec()
    })
    .then((orders) => {
        if(orders && orders.length != 0) {
            testPacks = testPacks.map((testPack)=>{
                let copiedTestPack = JSON.parse(JSON.stringify(testPack));
                for (let i = 0; i < orders.length; i++) {
                    if(copiedTestPack._id == orders[i].courseId) {
                        copiedTestPack['paid'] = true;
                        break;
                    }
                    else {
                        copiedTestPack['paid'] = false;
                    }
                }
                return copiedTestPack;
            })
        }
        return testPacks;
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