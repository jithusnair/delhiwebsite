import User from '../../../_db/user';
import Token from '../../../_db/token';
import nodemailer from 'nodemailer';
import generator from 'generate-password';

export async function post(req, res, next) {
    let user = {
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email, 
        mobile: req.body.mobile,
    };

    let message;

    let session;
    
    // Find user based on given email.
    User.findOne({ email: req.body.email}).exec()
        .then((docs) => {
            // if user with given email exists send error
            if(docs) {
                var e = new Error('Email address already exists'); // e.name is 'Error'
                e.name = 'EmailError';
                throw e;
            }
            else return
        })
        // If no user with given email is found try to register the new user
        .then(() => User.register(user, req.body.password))
        // If no errors proceeds to generate token 
        .then((user) => {
            // login the registered user
            req.login(user, function(err) {});
            let tar = JSON.parse(JSON.stringify(req.user))
            session = {
                _id: tar._id.toString(), 
                username: tar.fullname,
                fullname: tar.fullname,
                isVerified: tar.isVerified,
                isAdmin: tar.isAdmin
            };

            let randomToken = generator.generate({
                length: 10,
                numbers: true,
                uppercase: true,
                lowercase: true,
                symbols: true
            });
            let token = new Token({ _userId: user._id, token: randomToken });
            return token.save();
        })
        // Send e-mail with the generated token
        // Email is too simple as of now.
        // Better email templating with custom domain would be better
        // Use SENDGRID in the end to make emails better.
        .then((token) => {
            var transporter = nodemailer.createTransport(
                { 
                    service: 'gmail', 
                    auth: { user: process.env.USERNAME, pass: process.env.PASSWORD } 
                });
            let email_html = 
                `Hello,
                Please verify your account. The verification code is ${token.token}`;

            var mailOptions = { 
                from: 'no-reply@webapplication.com', 
                to: user.email, 
                subject: 'Account Verification', 
                text: email_html
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log(err);
                    message = { 
                        success: false, 
                        signUpResult: 
                        `Sorry! Something went wrong on our end!
                        You have been registered but we were unable to send an email for verification.
                        Try verifying through profile settings.`,
                        session: session
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(message)); 
                }
                else {
                    message = { 
                        success: true, 
                        signUpResult: 
                        'A verification code has been sent to ' + user.email + 
                        '. Please verify the code in profile settings after logging in.' + 
                        'The code will be valid for only 12 hrs.',
                        session: session
                    };
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(message));
                }
            });
        })
        .catch((err) => {
            // Isolate user.register errors and send that to front end.
            if(err.name == 'UserExistsError' || err.name == 'MissingUsernameError')
            {
                message = { 
                    success: false, 
                    signUpErr: err.message
                };
            }
            else if(err.name == 'EmailError') {
                message = { 
                    success: false, 
                    signUpErr: err.message 
                };
            }
            // Else error in some other async operations
            // Probably should log this error somewhere
            else {
                console.log(err);
                message = { 
                    success: false, 
                    serverErr: 
                    `Something went wrong on our end! 
                    You may have already been signed up in our database in which case try logging in.
                    If that does not work, try signing up a after sometime.`
                };
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
}
