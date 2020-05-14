import User from '../../../_db/user';
import Token from '../../../_db/token';
import nodemailer from 'nodemailer';
import generator from 'generate-password';

// check the email of the user

export async function post(req, res, next) {
    let message;
    // Find the given token
    Token.findOne({ token: req.body.token }, function (err, token) {
        if (!token) {
            message = { 
                success: false, 
                err: 'Invalid code. The token code entered is incorrect.' 
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        }
        else {
            // If we found a token, find a matching user
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    message = { 
                        success: false, 
                        err: 'We were unable to find a user for this token.' 
                    };
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(message));
                }
                // set a new password and send the email
                else {
                    let newPassword = generator.generate({
                        length: 10,
                        numbers: true,
                        uppercase: true,
                        lowercase: true,
                        symbols: true
                    });
                    user.setPassword(newPassword , function(err, user){
                        user.save(function (err) {
                            if (err) { 
                                message = { 
                                success: false, 
                                err: 'Something went wrong. Please try again later' 
                                } 
                            }
                            else {
                                // Send the email
                                var transporter = nodemailer.createTransport(
                                    { 
                                        service: 'gmail', 
                                        auth: { user: 'nairjithus@gmail.com', pass: 'qnwxvnvdzjitidnn' } 
                                    });
                        
                                let email_html = `Hello, 
                                Your new password is ${newPassword} 
                                You can change your password through the profile settings section.`;
                    
                                var mailOptions = { 
                                    from: 'no-reply@webapplication.com', 
                                    to: user.email, 
                                    subject: 'Account Verification', 
                                    text: email_html
                                };
                                
                                transporter.sendMail(mailOptions, function (err) {
                                    if (err) { 
                                        message = { 
                                            success: false, 
                                            err: `Sorry, something went wrong. 
                                            We were unable to send a new password to your email.
                                            Mail our support for help.`
                                        }
                                    }
                                    else {
                                        message = { 
                                            success: true, 
                                            msg: `Successfully changed password. <br>
                                            The new password has been sent to ${user.email}` 
                                        }; 
                                    }
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end(JSON.stringify(message));
                                });
                            }
                        });
                    })
                    
                }
            });
        }
    });
}