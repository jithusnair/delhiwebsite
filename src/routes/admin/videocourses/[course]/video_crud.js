import Video from '../../../../_db/video';

export async function post(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    //!req.user || !req.user.isAdmin
    if(false) {
        message = {success: false, err: 'You are not authorised to create new videos'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    } 
    else {
        // Save the course details to DB
        let video = new Video({
            title: req.body.title, 
            description: req.body.description,
            link: req.body.link,
            courseId: req.body.courseId
        })
        video.save()
            .then(()=>{
                message = {
                    success: true, 
                    msg: 'Video details has been saved'
                };
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
}

export async function get(req, res, next) {
    let message;
    let {course} = req.params;
    Video.find({courseId: course}).exec()
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
                `Something went wrong. Couldn't get videos from database! 
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
        message = {success: false, err: 'You are not authorised to delete this'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    }
    else {
        Video.findByIdAndRemove(req.body._id).exec()
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
                    `Something went wrong. Couldn't delete videos from database. 
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
        message = {success: false, err: 'You are not authorised to edit this'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    }
    else {
        let updatedCourse =  { 
            title: req.body.title,
            description: req.body.description,
            link: req.body.link
        }
        Video.findOneAndUpdate({_id: req.body._id}, updatedCourse).exec()
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