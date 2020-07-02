import VideoCourseDetail from '../../_db/videocourse';
import Order from '../../_db/order';

import moment from 'moment';

export async function get(req, res, next) {
    let message;
    if(!req.user || req.user.isAdmin) {
        message = {success:false, serverErr: 'You are not a registerd user'}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return
    }

    Order.find({userId: req.user._id, status:'captured'}).exec()
    .then((orders)=>{
        let stillValidPurchase;
        if(orders) {
            stillValidPurchase = 
                orders.filter((item)=> {
                    let lastUpdated = moment(item.lastUpdated);
                    let validTill = 
                        lastUpdated.add(item.courseValidity+1, 'days').startOf('day')
                    let currentlyValid = validTill - moment() > 0
                    return currentlyValid
                })
            stillValidPurchase = stillValidPurchase.map((item)=>{
                return item.courseId
            })
        }
        // theoretically there should only be one valid for each course
        // purchase after filtering if there are any purchases at all i.e.   
        return stillValidPurchase;
    }).then((validOrders)=>{
        return VideoCourseDetail.find({_id: {$in: validOrders}}).exec()
    })
    .then((courseDetails)=>{
        courseDetails = courseDetails.map((course)=>{
            let copiedCourse = JSON.parse(JSON.stringify(course));
            copiedCourse['paid'] = true;
            return copiedCourse;
        })
        message = {success: true, data: courseDetails};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        console.log(error);
        message = {success: false, serverErr: 'Something went wrong on our end'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}