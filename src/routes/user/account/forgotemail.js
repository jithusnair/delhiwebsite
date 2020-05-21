import User from '../../../_db/user';
import Token from '../../../_db/token';
import nodemailer from 'nodemailer';
import generator from 'generate-password';

// check the email of the user

export async function post(req, res, next) {
    let message;
    let foundUser;
    // Find a user with the given email
    User.findOne({ email: req.body.email }).exec()
        .then((user) => {
            if (!user) {
                var e = new Error('We were unable to find a user with this email.');
                e.name = 'NoUserError';
                throw e;
            }
            // generate a token and save
            else {
                foundUser = user;
                let randomToken = generator.generate({
                    length: 10,
                    numbers: true,
                    uppercase: true,
                    lowercase: true,
                    symbols: true
                });
                let token = new Token({ _userId: user._id, token: randomToken });
                return token.save().exec()
            }
        })
        // send the email
        .then((token) => {
            var transporter = nodemailer.createTransport(
                { 
                    service: 'gmail', 
                    auth: { user: process.env.USERNAME, pass: process.env.PASSWORD } 
                });
            
            let email_html = `Hello, 
            Your token is ${token.token}`;

            var mailOptions = { 
                from: 'no-reply@webapplication.com', 
                to: foundUser.email, 
                subject: 'Reset Password', 
                text: email_html
            };
            
            transporter.sendMail(mailOptions, function (err) {
                message = { 
                    success: true, 
                    msg: `A token code has been sent to ${foundUser.email}. <br>
                    Type the code in to reset password.` 
                }; 
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            });
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