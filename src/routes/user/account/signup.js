import User from '../../../_db/user';
import Token from '../../../_db/token';
import { verifyEmail } from '../../../_helpers/mailer';
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
                fullname: tar.fullname,
                isVerified: tar.isVerified,
                isAdmin: tar.isAdmin
            };

            // generate a random 4 digit token
            let randomToken = generator.generate({
                length:4, 
                numbers:true, 
                symbols:false, 
                uppercase:false,
                lowercase:false
            });

            let token = new Token({ _userId: user._id, token: randomToken });
            return token.save();
        })
        // send email
        .then((token) => {
            return verifyEmail({token:token.token, email:req.body.email})
        })
        .then((result)=>{
            message = {
                success:true,
                email: req.body.email,
                session: session
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
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
