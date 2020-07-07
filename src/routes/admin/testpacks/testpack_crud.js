import TestPack from '../../../_db/testpack';

export async function get(req, res, next) {
    let message;

    TestPack.find({}).exec()
    .then((testpacks)=> {
        message = {
                success: true, 
                data: testpacks,
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
    let testPack = new TestPack({
        examId: req.body.examId,
        testPackTitle: req.body.testPackTitle,
        price: parseInt(req.body.price), 
        features: req.body.features,
        validity: req.body.validity,
        launchDate: new Date(req.body.launchDate),
    });

    testPack.save()
    .then(()=>{
        message = {success: true};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't save the new video to database.
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

    let updateTestPack = {
        examId: req.body.examId,
        testPackTitle: req.body.testPackTitle,
        price: parseInt(req.body.price), 
        features: req.body.features,
        validity: req.body.validity,
        launchDate: new Date(req.body.launchDate),
    };

    TestPack.findByIdAndUpdate(req.body._id, updateTestPack)
    .then(()=>{
        message = {success: true};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't save the new video to database.
            Please try again later.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

export async function del(req, res, next) {
    let message;

    TestPack.findByIdAndDelete(req.body._id).exec()
    .then((testpacks)=> {
        message = {success: true};
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