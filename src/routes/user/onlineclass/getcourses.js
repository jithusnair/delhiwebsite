import VideoCourseDetail from '../../../_db/videocourse';
import Order from '../../../_db/order';

import moment from 'moment';

export async function get(req, res, next) {
    let message;
    if(!req.user || req.user.isAdmin) {
        message = {success:false, serverErr: 'You are not a registerd user'}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return
    }
    let courses;

    VideoCourseDetail.find({published: true}).exec()
    .then((docs)=>{
        courses = [...docs];
        return Order.find({userId: req.user._id, status:'captured'}).exec()
    })
    .then((orders)=>{
        let stillValidPurchase;
        if(orders) {
            // when calculating VALID-TILL part, if adding, say, 365days
            // made the date "Jul 2, 2021 5:15PM" - The valid till calculation
            // part will just make it valid till midnight of that date, i.e.,
            // "Jul 3, 2021 00:00AM". 
            stillValidPurchase = orders.filter((item)=> {
                    let lastUpdated = moment(item.lastUpdated);
                    let validTill = 
                        lastUpdated.add(item.courseValidity+1, 'days').startOf('day')
                    let currentlyValid = validTill - moment() > 0
                    return currentlyValid
            })
        }
        if (stillValidPurchase && stillValidPurchase.length>0) {
            courses = courses.map((course)=>{
                let copiedCourse = JSON.parse(JSON.stringify(course));
                for (let i = 0; i < stillValidPurchase.length; i++) {
                    if(copiedCourse._id == stillValidPurchase[i].courseId) {
                        copiedCourse['paid'] = true;
                        break;
                    }
                    else {
                        copiedCourse['paid'] = false;
                    }
                }
                return copiedCourse;
            })
        }
        // theoretically there should only be one valid purchase after filtering
        // if there are any purchases at all i.e.
        return courses;
    })
    .then((courseDetails)=>{
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