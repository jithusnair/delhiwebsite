import User from '../../../_db/user';
import Token from '../../../_db/token';
import nodemailer from 'nodemailer';
import generator from 'generate-password';

// check the email of the user

export async function post(req, res, next) {
    let message;
    // Find a user with the given email
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            message = { 
                success: false, 
                err: 'We were unable to find a user with this email.' 
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
            
        }
        // send a token to email
        else {
            let randomToken = generator.generate({
                length: 10,
                numbers: true,
                uppercase: true,
                lowercase: true,
                symbols: true
            });
            let token = new Token({ _userId: user._id, token: randomToken });
        
            // Save the verification token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
        
                // Send the email
                var transporter = nodemailer.createTransport(
                    { 
                        service: 'gmail', 
                        auth: { user: 'nairjithus@gmail.com', pass: 'qnwxvnvdzjitidnn' } 
                    });
                
                let email_html = `Hello, 
                Your token is ${token.token}`;
    
                var mailOptions = { 
                    from: 'no-reply@webapplication.com', 
                    to: user.email, 
                    subject: 'Reset Password', 
                    text: email_html
                };
                
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { 
                        message = { 
                            success: false, 
                            err: `Sorry, something went wrong. We were unable to send an email.
                            Try again later.`
                        }
                    }
                    else {
                        message = { 
                            success: true, 
                            msg: `A token code has been sent to ${user.email}.
                            Type the code in to reset password.` 
                        }; 
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(message));
                });
            });
        }       
    });
}