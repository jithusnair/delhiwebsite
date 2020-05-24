import VideoCourse from '../../../_db/videocourse';

export async function post(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    //!req.user || !req.user.isAdmin
    if(false) {
        message = {success: false, err: 'You are not authorised'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    } 
    else {
        // Save the course details to DB
        let videoCourse = new VideoCourse({
            courseTitle: req.body.courseTitle, 
            features: req.body.features
        })
        videoCourse.save()
            .then(()=>{
                message = {
                    success: true, 
                    msg: 'Course detail has been saved'
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
            .catch((error) => {
                console.log(error);
                message = { 
                    success: false, 
                    serverErr: 
                    `Something went wrong on our end! 
                    Please try again later.`
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
    }
}

export async function get(req, res, next) {
    let message;
    VideoCourse.find({}).exec()
        .then((docs)=>{
            message = {success: true, data: docs};
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
        .catch((error) => {
            console.log(error);
            message = { 
                success: false, 
                serverErr: 
                `Something went wrong on our end! 
                Please try again later.`
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
}

export async function del(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    //!req.user || !req.user.isAdmin
    if(false) {
        message = {success: false, err: 'You are not authorised'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    }
    else {
        VideoCourse.findByIdAndRemove(req.body._id).exec()
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
                    `Something went wrong on our end! 
                    Please try again later.`
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
    }           
}

export async function put(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    //!req.user || !req.user.isAdmin
    if(false) {
        message = {success: false, err: 'You are not authorised'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    }
    else {
        let updatedCourse =  { 
            courseTitle : req.body.courseTitle,
            features : req.body.features
        }
        VideoCourse.findOneAndUpdate({_id: req.body._id}, updatedCourse).exec()
            .then((doc)=>{
                message = {success: true};
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
            .catch((error) => {
                console.log(error);
                message = { 
                    success: false, 
                    serverErr: 
                    `Something went wrong on our end! 
                    Please try again later.`
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
    }      
}