import VideoCourseDetail from '../../../_db/videocourse';
import Order from '../../../_db/order';

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
        return Order.find({
            courseCollection: "VideoCourseDetail",
            userId: req.user._id, 
            status: 'captured',
            validTill: { $gte: new Date()}
        })
    .exec()
    })
    .then((orders)=>{
        if(orders && orders.length != 0) {
            courses = courses.map((course)=>{
                let copiedCourse = JSON.parse(JSON.stringify(course));
                for (let i = 0; i < orders.length; i++) {
                    if(copiedCourse._id == orders[i].courseId) {
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