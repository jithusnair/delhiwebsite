import User from '../../../_db/user';
import Token from '../../../_db/token';
import { resetPassword } from '../../../_helpers/mailer';
import generator from 'generate-password';

// check the email of the user

export async function post(req, res, next) {
    let message;
    let newPassword;
    // Find the given token
    Token.findOne({ token: req.body.token}).exec()
        .then(() => {
            if (!token) {
                var e = new Error('Invalid code. The token code entered is incorrect');
                e.name = 'TokenError';
                throw e;
            }
            // If we found a token, find a matching user
            return User.findOne({ email: req.body.email }).exec()
        })
        .then((user)=>{
            if (!user) {
                var e = new Error('We were unable to find a user for this token.');
                e.name = 'NoUserError';
                throw e;
            }
            // set a new password and send the email
            newPassword = generator.generate({
                length: 12,
                numbers: true,
                uppercase: true,
                lowercase: true,
                symbols: false
            });
            return user.setPassword(newPassword);
        })
        .then((user) => user.save())
        .then(() => resetPassword({password:newPassword, email:req.body.email}))
        .then(()=>{
            message = {
                success: true,
                msg: `Password has been reset. The new password has been sent to
                ${req.body.email}`
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
        .catch((err) => {
            // If no token was found
            if(err.name == 'TokenError') {
                message = { 
                    success: false, 
                    err: err.message
                };
            }
            // if for somereason the user corresponding to token does not exist
            else if(err.name == 'NoUserError') {
                message = { 
                    success: false, 
                    err: err.message
                };
            }
            // all other potential server errors
            else {
                console.log(err);
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