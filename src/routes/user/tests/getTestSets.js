import Section from '../../../_db/section';
import Chapter from '../../../_db/chapter';
import TestPack from '../../../_db/testpack';
import Order from '../../../_db/order';

export async function get(req, res, next) {
    let message;
    if(!req.user || req.user.isAdmin) {
        message = {success:false, serverErr: 'You are not a registerd user'}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return
    }

    let { testpack } = req.query;

    let sections = [];
    let testPack;
    let purchased;

    Order.find({
        userId: req.user._id, 
        courseId: testpack, 
        status: 'captured',
        validTill: { $gte: new Date()}
    }).exec()
    .then((orders)=>{
        // Check validity - Ideally there should only be one valid course.
        if(orders && orders.length != 0) {
            purchased = true;
        } else {
            purchased = false;
        }
        return TestPack.findOne({_id:testpack, published: true }).select({examId: 0}).exec()
    })
    .then((doc) => {
        if(!doc) {
            let e = new Error('No testpack found with the given testPackId');
            e.name = 'TestPackAbsentError';
            throw e;
        }
        testPack = doc;
        return Section.find({ testPackId: testpack }).select('_id sectionTitle').exec()
    })
    .then((docs) => {
        let sectionIds = [];
        docs.forEach(doc => {
            sectionIds.push(doc._id);
        });
        sections = docs;
        return Chapter.aggregate(
            [
                { $match : { sectionId : { $in : sectionIds }} },
                { $unset : [ "__v" ] } 
            ])
            .lookup({
                from: "testsets",
                localField: "_id",
                foreignField: "chapter",
                as: "testSets"
            })
    })
    .then((docs)=> {
        message = {
            success: true, 
            testPack: testPack, 
            sections: sections, 
            chaptersandtestsets: docs,
            purchased: purchased,
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        if(error.name = 'TestPackAbsentError') {
            message = {success: false, err: 'Not Found'};
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
            return
        }
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