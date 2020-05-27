import Video from '../../_db/video.js';
import VideoCourse from '../../_db/videocourse.js';

export async function get(req, res, next) {
    let message;
    let courseDoc;
    let videoDocs;
    let {course} = req.params;
    Video.find({courseId: course}).exec()
        .then((docs)=> {
            videoDocs = docs;
            return VideoCourse.findOne({_id:course}).exec()
        })
        .then((docs)=>{
            if(!docs) {
                e = new Error('Cannot find the course');
                e.name = "CourseNullError";
                throw e;
            }
            else {
                courseDoc = docs;
                message = {success: true, data: videoDocs, course: courseDoc};
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            }
        })
        .catch((error) => {
            if(error.name == 'CourseNullError') {
                message = { 
                    success: false, 
                    serverErr: 
                    `Could not find the course itself let alone it's videos.`
                };
            }
            else {
                console.log(error);
                message = { 
                    success: false, 
                    serverErr: 
                    `Something went wrong. Couldn't get videos from database! 
                    Please try again later.`
                };
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
}