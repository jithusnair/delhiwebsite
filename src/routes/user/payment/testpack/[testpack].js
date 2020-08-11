import Order from '../../../../_db/order';
import TestPack from '../../../../_db/testpack';
import { invoiceGenerator } from '../../../../_helpers/invoiceNumberGenerator';
import { invoice } from '../../../../_helpers/mailer';

import Razorpay from 'razorpay';
import Crypto from 'crypto';
import moment from 'moment';

// Get request only creates the order and sents it back to the client
export async function get(req, res, next) {
    // first check if user is logged in or if this is an admin account
    if(!req.user || req.user.isAdmin) return

    const { testpack } = req.params;
    let message;
    let razorpayOrder;

    if(!req.user.isVerified) {
        message = {
            success: false, 
            err: `Please verify your email first.
            You can verify your email through the profile settings.`
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }
    // Check if the user has bought the particular course before
    Order.find({ 
            userId: req.user._id, 
            courseId: testpack, 
            status: 'captured',
            validTill: { $gte: new Date()}
        }).exec()
    .then((paidList)=>{
        if(paidList.length == 0) {
            return
        }
    
        let e = new Error('Already purchased');
        e.name = 'DuplicatePurchaseError'
        throw e;
    })
    .then(() => TestPack.findById(testpack).exec())
    // if no such duplicate purchase exist, continue creating the new order
    .then(async (testPackDetail)=>{
        let razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    
        let orderOptions = {
            amount: parseInt(testPackDetail.price)*100 + Math.floor(((parseInt(testPackDetail.price)*18))), //adding GST
            currency: 'INR', 
            receipt: testPackDetail._id + '_' + Date.now(),
            // Though not specified anywhere explicitly in Razorpay that 
            // receipt should be unique, we are making it unique using Date.now()
            payment_capture: 1,
        }

        razorpayOrder = await razorpay.orders.create(orderOptions);

        let newOrder = {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount, //amount including gst
            courseTitle: testPackDetail.testPackTitle,
            coursePrice: testPackDetail.price,
            courseCollection: "TestPack",
            courseId: testPackDetail._id,
            courseValidity: testPackDetail.validity,
            userId: req.user._id,
            status: 'created',
            lastUpdated: Date.now()
        }
        return Order.create(newOrder)
    })
    .then((order)=>{
        message = {
            success: true, 
            data: {
                orderID: razorpayOrder.id, 
                amount: razorpayOrder.amount, 
                currency: razorpayOrder.currency,
                lastUpdated: order.lastUpdated,
                courseValidity: order.courseValidity
            }
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        if(error.name == 'DuplicatePurchaseError') {
            message = {
                success: false, 
                err: "You've already purchased this course."
            }
        }
        else {
            console.log(error);
            message = {
                success: false, 
                serverErr: "Sorry, something went wrong on our end! Try again later."
            }
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

// Post request for the Handler function called by razorpay checkout.js
export async function post(req, res, next) {
    // first check if user is logged in or if this is an admin account
    if(!req.user || req.user.isAdmin) {
        next();
        return
    }

    let message;
    let generated_signature;
    
    let orderFromDB;
    let invoiceData;
    let totalPrice;
    let subTotal;
    let gstAmount;

    // razorpay will send order_id only if the payment was captured
    if(req.body.razorpay_order_id) {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const shasum = Crypto.createHmac('sha256', secret)
        shasum.update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
        generated_signature = shasum.digest('hex');
    }
    // if payment was just authorised and not captured
    else {
        message = {
            success: false,
            paymentErr: 'Sorry! We have not yet received payment' + 
            'In case the amount was debited it will be credited back in' +
            '7 business days.'
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return
    }

    if (generated_signature && generated_signature == req.body.razorpay_signature) {
        Order.findOne({ orderId: req.body.razorpay_order_id })
        .populate('userId')
        .exec()
        .then((order)=>{
            //if info about payment had been received via webhook ignore. 
            if(order.status == 'captured') message = {success: true}

            // There is a chance that the order status might be in
            // 'authorized' state. This will happen if there the
            // when the webhook for captured event did not reach us OR
            // due to late authorisation.
            // In case of former, we can update the status of the order
            // from this client-request.
            // In case of latter, the client handler wont send a POST with 
            // razorpay_order_id anyway, and that scenario is handled in the 
            // beginning of this route, before checking signature.
            
            // That being said, else part should be a very very rare occurence.
            // Razorpay webhook event should reach our servers first before 
            // the request from client-side reaches our servers. But in case
            // for some reason the webhook event did not reach the servers,
            // we can update the order based on the client-side req.
            // ****NOTE****
            // There is one more chance of payment problem for the user.
            // ---------------------------------
            // The outlier-by-a-huge-margin case
            // ---------------------------------
            // When webhook did not reach our server and the client-side also
            // did not send back the request.
            // 
            // This happens if the server was down for more than 5 seconds and
            // also the user's end also faced somekind of internet issues.
            // In such a case, the only course of action for user would be to
            // contact the support.
            else {
                // send a receipt/invoice to customer
                orderFromDB = order;
                
                totalPrice = orderFromDB.amount/100;
                subTotal = parseInt(orderFromDB.coursePrice);

                gstAmount = totalPrice - subTotal;
                
                // first get all orders that were captured and also 
                // lastupdated date > April 1 and sort them in by date
                // in descending order - older last.
                let firstAprilThisYear = moment().year()+'-04-01';

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
        .then(()=>{
            // update the order
            let lastUpdated = moment(orderFromDB.lastUpdated);
            let validTill = lastUpdated.add(orderFromDB.courseValidity+1, 'days').startOf('day');
            return Order.update( {orderId: req.body.razorpay_order_id},
                {
                    status: 'captured', 
                    lastUpdated: new Date(), 
                    invoice: invoiceData.invoiceNumber,
                    validTill: new Date(validTill),
                }
                ).exec()
        })
        .then(()=>{
            if(!message) {
                message = {success: true}
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
        .catch((error)=>{
            console.log(error);
            message = {
                success: false,
                msg: 'Sorry! Something went wrong.<br> If an amount was debited, '+
                'the payment was most probably successful and this error was ' +
                'just a slight glitch on our end. To make sure you got access ' +
                'to the course you paid for please logout and login after sometime.' +
                '<br> If you still do not get access, please contact support.'
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
    }
    else if (generated_signature && generated_signature != req.body.razorpay_signature) {
        message = {msg: 'Bugger off you crony!'}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    }
}