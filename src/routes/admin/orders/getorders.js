import Order from '../../../_db/order';

export async function get(req, res, next) {
    let message;

    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    Order.find({})
    .populate('courseId', 'courseTitle courseValidity')
    .populate('userId', 'fullname')
    .exec()
    .then((docs)=>{
        message = {success:true, data: docs}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        console.error(error)
        message = {success:false, serverErr:'Something went wrong, Sorry!'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}