import VideoCourseDetail from '../../../_db/videocourse';

// A route to publish the courses
export async function put(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to publish this'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    }
    else {
        VideoCourseDetail.findById(req.body._id).exec()
        .then((course)=>{
            let published;
            // toggle published boolean based on the current status in DB
            if(course.published == true) published = false;
            else published = true;

            return VideoCourseDetail.findOneAndUpdate({_id: course._id}, {published: published})
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
                    `Something went wrong. Couldn't publish the course. 
                    Please try again later.`
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
    }      
}