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

    User.findOne({ email: req.body.email}, function (err, docs){
        if(err) {}
        else {
            if(docs) {
                let message = { success: false, signUpErr: 'Given email address already exist' };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            }
            else {
                User.register(user, req.body.password, function(err, user){
                    if(err){
                        let message = { success: false, signUpErr: err }
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(message));
                    }
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
                            Please verify your account. The verification code is ${token.token}`;

                            var mailOptions = { 
                                from: 'no-reply@webapplication.com', 
                                to: user.email, 
                                subject: 'Account Verification', 
                                text: email_html
                            };
                            
                            transporter.sendMail(mailOptions, function (err) {
                                if (err) { 
                                    let message = { 
                                        success: false, 
                                        signUpResult: `You have been registered but we were unable to send an email for verification.
                                        Try again through the profile settings after logging in. <br><br>
                                        You cannot buy or use our services to the fullest extent until the verification is complete.
                                        This is for security reasons, we are sorry for the inconvenience caused. <br>`
                                    }
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end(JSON.stringify(message)); 
                                }
                                else {
                                    let message = { 
                                        success: true, 
                                        signUpResult: 'A verification code has been sent to ' + user.email + 
                                        '. Please verify the code in profile settings after logging in.' + 
                                        'The code will be valid for only 12 hrs.' 
                                    };
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end(JSON.stringify(message));
                                }
                            });
                        });
                    }
                });
            }
        }
    });
}
