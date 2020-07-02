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
    let stillValidPurchase;
    let purchased;
    // first confirm if the user has a paid and still valid course.
    // if not send the videodata without the links
    Order.find({userId: req.user._id, courseId: req.body.courseId, status: 'captured'})
    .exec()
    .then((orders)=>{
        // Check validity - Ideally there should only be one valid course.
        if(orders) {
            stillValidPurchase = 
                orders.filter((item)=> {
                    let lastUpdated = moment(item.lastUpdated);
                    let validTill = 
                        lastUpdated.add(item.courseValidity+1, 'days').startOf('day')
                    let currentlyValid = validTill - moment() > 0
                    return currentlyValid
                })
        }
        return Video.find({courseId: req.body.courseId}).exec()
    })
    .then((videos)=>{
        let newVideos;
        // if there are still valid purchases send the full videos
        if (stillValidPurchase && stillValidPurchase.length>0) {
            videoDetails = videos;
            purchased = true;
        }
        // Else there are no valid purchases and hence should return
        // videos without the links
        else {
            newVideos = videos.map((item)=>{
                let copiedItem = JSON.parse(JSON.stringify(item));
                copiedItem.link = null;
                return copiedItem;
            })
            videoDetails = newVideos;
            purchased = false;
        }
        // only return the published courses
        return VideoCourseDetail.findOne({_id:req.body.courseId, published: true}).exec()
    })
    .then((course)=>{
        // There is a chance that a random request might come where the course and the
        // videos do exist, but the course was not published. Therefore, that scenario
        // needs to be handled
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
        if(error.name == 'CourseNotFoundError') {
            message = {success: false, err: 'Course not found'}
        }
        console.log(error);
        message = {success: false, serverErr: 'Something went wrong on our end'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}