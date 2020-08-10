import Order from '../../../_db/order';

import Crypto from 'crypto';

import { invoiceGenerator } from '../../../_helpers/invoiceNumberGenerator';
import { invoice } from '../../../_helpers/mailer';
import moment from 'moment';

// post request for razorpay webhooks
export async function post(req, res, next) {
    let message;

    // THIS HAS TO BE CHANGED TO ENV VARIABLE
    const SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shasum = Crypto.createHmac('sha256', SECRET)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex');

    let payload;

    let orderFromDB;
    let invoiceData;
    let totalPrice;
    let subTotal;
    let gstAmount;

    if(digest == req.headers['x-razorpay-signature']) {
        payload = {...req.body.payload.payment.entity}
        Order.findOne({orderId: payload.order_id}).exec()
        .then((order)=>{
            // due to network unpredictability, the webhook req may
            // not always be in the order Authorized-->Captured. Sometimes,
            // Captured may come first, in this case, care must be taken not
            // to overwrite the DB about the payment status.
            if(order.status == 'captured') {
                let e = Error('Captured Already');
                e.name = 'CapturedError';
                throw e;
            }
            else {
                orderFromDB = order;
                
                totalPrice = orderFromDB.amount;
                subTotal = parseInt(orderFromDB.coursePrice);

                gstAmount = totalPrice - subTotal;
                
                // first get all orders that were captured and also 
                // lastupdated date > April 1 and sort them in by date
                // in descending order - older last.
                let firstAprilThisYear = moment().year()+'-04-01';
                // to find the last invoice number in DB
                return Order.findOne({status: 'captured', 
                    lastUpdated: {$gt: firstAprilThisYear}
                })
                .sort({lastUpdated: -1}).exec()
            }
        })
        .then((order)=>{
            //send a mail
            invoiceData = {
                email: orderFromDB.userId.email,
                courseName: orderFromDB.courseTitle,
                subTotal: subTotal,
                gstAmount: gstAmount,
                totalAmount: totalPrice,
                invoiceNumber: invoiceGenerator(order),
                dateIssued: moment().format("DD/MM/YYYY @ H:MMa"),
                customerName: orderFromDB.userId.fullname,
                customerEmail: orderFromDB.userId.email,
                customerContact: orderFromDB.userId.mobile
            }
            return invoice(invoiceData);
        })
        .then(()=> {
            let lastUpdated = moment(orderFromDB.lastUpdated);
            let validTill = lastUpdated.add(orderFromDB.courseValidity+1, 'days').startOf('day');
            // update the order
            return Order.update( {orderId: req.body.razorpay_order_id},
                {
                    status: 'captured', 
                    lastUpdated: new Date(), 
                    invoice: invoiceData.invoiceNumber,
                    validTill: new Date(validTill),
                }
                ).exec()
        })
        .then(()=>message = {msg: 'success'})
        .catch((error)=>{
            // if already captured, ignore the whole thing
            if(error.name =='CapturedError') {
                message = {msg: 'ignoring'};
            }
            // whatever the situation Razorpay has to get a 
            // response with status '200'. So the message here
            // can be anything random.
            // HOWEVER, the possible implication here is that
            // the server was not updated of the payment status.
            // If this errors out due to DB issues we can hope 
            // that the request sent by the client succeeds. 
            // If that too fails, the user will have to contact
            // support.
            else {
                console.log(error);
                message = {msg: 'Server Error'};
            }
        })
    }
    else {
        // some fraud, ignore the request
        message = {msg: 'You are a con man'}
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(message));
}