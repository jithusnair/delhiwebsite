import TestSet from '../../../../_db/testset';
import Section from '../../../../_db/section';

export async function get(req, res, next) {
    let message;
    let sections = [];
    let {testpack} = req.params;

    Section.find({testPackId: testpack}).select('_id').exec()
    .then((docs)=> {
        docs.forEach(doc => {
            sections.push(doc._id)
        });
        return TestSet.aggregate([
            {
                $match : { "section" : {$in : sections }}
            },
            {
                $group :
                    {
                      _id : "$chapter",
                      testSets: { $push: "$$ROOT"}
                    }
            }
        ]).exec()
    })
    .then((docs) => {
        message = {
            success: true, 
            chaptersandtestsets: docs,
        };
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
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

export async function post(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to create new test sets'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    let testset = new TestSet({
        section: req.body.sectionId,
        chapter: req.body.chapterId,
        testSetTitle: req.body.testSetTitle,
        examDuration: req.body.examDuration, // in minutes
        totalMarks: req.body.totalMarks,
        totalQuestions: req.body.totalQuestions,
        negativeMarks: req.body.negativeMarks,
    })

    testset.save()
    .then(()=>{
        message = {success: true,};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't save the sections to database.
            Please try again later.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

export async function put(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to edit'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    let updatedTestset = {
        section: req.body.sectionId,
        chapter: req.body.chapterId,
        testSetTitle: req.body.testSetTitle,
        examDuration: req.body.examDuration, // in minutes
        totalMarks: req.body.totalMarks,
        totalQuestions: req.body.totalQuestions,
        negativeMarks: req.body.negativeMarks,
    }

    TestSet.findByIdAndUpdate(req.body._id, updatedTestset)
    .then(()=>{
        message = {success: true,};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't save the sections to database.
            Please try again later.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

export async function del(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to delete testset'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    TestSet.findByIdAndDelete(req.body._id)
    .then(()=>{
        message = {success: true,};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't save the sections to database.
            Please try again later.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}