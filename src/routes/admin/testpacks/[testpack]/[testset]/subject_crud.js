import Subject from '../../../../../_db/subject';
import TestSet from '../../../../../_db/testset';

export async function get(req, res, next) {
    let message;
    let subjects;
    let {testset} = req.params;

    Subject.find({testSetId: testset}).select('_id subjectTitle').exec()
    .then((docs)=> {
        subjects = docs;
        return TestSet.findById(testset).select('_id testSetTitle').exec()
    })
    .then((doc)=>{
        message = {
                success: true, 
                subjects: subjects, 
                testSet: doc,
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
        message = {success: false, err: 'You are not authorised to create new videos'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    // Save the course details to DB
    let subjects = [];

    for (let i = 0; i < req.body.subjects.length; i++) {
        subjects[i] = {
            testSetId: req.params.testset,
            subjectTitle: req.body.subjects[i],
        }
    }

    Subject.create(subjects)
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
        message = {success: false, err: 'You are not authorised to create new videos'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    Subject.findByIdAndUpdate( req.body._id, {subjectTitle: req.body.subjectTitle})
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
        message = {success: false, err: 'You are not authorised to create new videos'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    // Save the course details to DB

    Subject.findByIdAndDelete(req.body._id)
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
            `Something went wrong. Couldn't delete the subject.
            Please try again later.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}