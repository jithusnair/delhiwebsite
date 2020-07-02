import User from '../../../_db/user';
import Order from '../../../_db/order';

import moment from 'moment';

// made this post request to avoid handling query params bullshit
export async function get(req, res, next) {
    let message;

    let userData;
    let orderData;
    // check if authorised
    if(!req.user || req.user.isAdmin) {
        message = {success:false, serverErr: 'You are not a registerd user'}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return
    }

    return User.findById(req.user._id).select('fullname email mobile isVerified').exec()
    .then((user)=>{
        userData = user;
        return Order.find({userId: req.user._id, status: 'captured'})
        .populate('courseId', 'courseTitle price')
        .exec()
    })
    .then((orders)=>{
        orderData = orders.map((order)=>{
            let copiedOrder = JSON.parse(JSON.stringify(order));
            let boughtDate = moment(copiedOrder.lastUpdated)
            copiedOrder['validTill'] = boughtDate.
            add(parseInt(copiedOrder.courseValidity)+1, 'days')
            .startOf('day').toDate();
            return copiedOrder;
        })

        message = {
            success: true,
            user: userData,
            order: orderData
        }

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