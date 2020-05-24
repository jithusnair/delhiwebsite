import VideoCourse from '../../../_db/videocourse';
import Video from '../../../_db/video';

export async function post(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to create new course'};
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
                    `Something went wrong. Couldn't save the new course to database.
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
                `Something went wrong. Couldn't get courses from database! 
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
        message = {success: false, err: 'You are not authorised to delete this'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    }
    else {
        // first find and remove the course by id
        VideoCourse.findByIdAndRemove(req.body._id).exec()
            // then remove all the videos referencing that course
            .then(()=> {
                return Video.findOneAndDelete({courseId: req.body._id}).exec()
            })
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
                    `Something went wrong. Couldn't delete everything from database. 
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
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to edit this'};
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
                    `Something went wrong. Couldn't save the edit to database. 
                    Please try again later.`
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
    }      
}