import VideoCourseDetail from '../../../_db/videocourse';
import Video from '../../../_db/video';
import Order from '../../../_db/order';

import moment from 'moment';

// made this post request to avoid handling query params bullshit
export async function post(req, res, next) {
    let message;
    // check if authorised
    if(!req.user || req.user.isAdmin) {
        message = {success:false, serverErr: 'You are not a registerd user'}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return
    }
    let videoDetails;
    let stillValidPurchase = false;
    let purchased;
    // first confirm if the user has a paid and still valid course.
    // if not send the videodata without the links
    Order.find({
            userId: req.user._id, 
            courseId: req.body.courseId, 
            status: 'captured',
            validTill: { $gte: new Date()}
        })
    .exec()
    .then((orders)=>{
        // Check validity - Ideally there should only be one valid course.
        if(orders && orders.length != 0) {
            stillValidPurchase = true;
            purchased = true;
        } else {
            stillValidPurchase = false;
            purchased = false;
        }

        if(stillValidPurchase) {
            return Video.find({courseId: req.body.courseId}).exec()
        } else {
            return Video.find({courseId: req.body.courseId})
            .select('courseId title description') //removes video links
            .exec()
        }
    })
    .then((videos)=>{
        // if videos with the given courseId does not exist
        if(!videos) {
            let e = Error('No videos found');
            e.name = 'VideosNotFoundError';
            throw e;
        }

        videoDetails = videos;
        return VideoCourseDetail.findOne({_id:req.body.courseId, published: true}).exec()
    })
    .then((course)=>{
        // if course doesn't exist
        if(!course) {
            let e = Error('No such course')
            e.name = 'CourseNotFoundError';
            throw e;
        }
        message = {success: true, course: course, videos: videoDetails, purchased: purchased}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        if(error.name == 'CourseNotFoundError' || 'VideosNotFoundError') {
            message = {success: false, err: 'Course not found'}
        }
        console.log(error);
        message = {success: false, serverErr: 'Something went wrong on our end'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}