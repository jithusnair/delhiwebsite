import User from '../../../_db/user';
import Token from '../../../_db/token';
import { resetPassword } from '../../../_helpers/mailer';

import generator from 'generate-password';

// check the email of the user

export async function post(req, res, next) {
    let message;
    let foundUser;

    // Find a user with the given email
    User.findOne({ email: req.body.email }).exec()
        .then((user) => {
            if (!user) {
                var e = new Error('No user found.');
                e.name = 'NoUserError';
                throw e;
            }
            // generate a random token and save
            // we will be sending the token._id anyway
            foundUser = user;
            let randomToken = generator.generate({
                length: 10,
                numbers: true,
                uppercase: true,
                lowercase: true,
                symbols: false
            });
            let token = new Token({ _userId: user._id, token: randomToken });
            return token.save()
        })
        // send the email
        .then((token) => {
            // CHANGE THIS URL ONCE DEPLOYED
            let resetURL = `https://www.direction-academy.com/user/account/${token._id}`;
            let firstName = foundUser.fullname.split(' ')[0];
            return resetPassword({url: resetURL, email:req.body.email, name: firstName})
        })
        .then(()=>{
            message = { 
                success: true, 
                msg: `An email has been sent to ${foundUser.email}. 
                Use the link in the mail to reset password.` 
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
        .catch((err) => {
            // if no user was found
            if(err.name == 'NoUserError') {
                message = { 
                    success: false, 
                    err: err.message
                };
            }
            // all other potential server errors
            else {
                console.error(err);
                message = { 
                    success: false, 
                    serverErr: 
                    `Something went wrong on our end! 
                    Please try again later.`
                };
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
}