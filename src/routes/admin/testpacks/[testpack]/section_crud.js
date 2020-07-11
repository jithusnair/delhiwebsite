import Section from '../../../../_db/section';
import TestPack from '../../../../_db/testpack';

export async function get(req, res, next) {
    let message;
    let sections;
    let {testpack} = req.params;

    Section.find({testPackId: testpack}).select('_id sectionTitle').exec()
    .then((docs)=> {
        sections = docs;
        return TestPack.findById(testpack).select('_id testPackTitle').exec()
    })
    .then((doc)=>{
        message = {
                success: true, 
                sections: sections, 
                testPack: doc,
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
    let sections = [];

    for (let i = 0; i < req.body.sections.length; i++) {
        sections[i] = {
                testPackId: req.params.testpack, 
                sectionTitle: req.body.sections[i] 
        }
    }

    Section.create(sections)
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

    // Save the course details to DB

    Section.findByIdAndUpdate( req.body._id, {sectionTitle: req.body.sectionTitle})
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

    Section.findByIdAndDelete( req.body._id)
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