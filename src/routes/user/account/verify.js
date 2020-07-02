import User from '../../../_db/user';
import Token from '../../../_db/token';
import { verifyEmail } from '../../../_helpers/mailer';
import generator from 'generate-password';

// Verify token of newly signed in user
export async function post(req, res, next) {
    let message;

    Token.findOne({token: req.body.code })
    .populate('_userId')
    .exec()
    .then((token)=>{
        if (!token || token.length==0) {
            let e = new Error('Invalid Code.');
            e.name = 'InvalidTokenError';
            throw e;
        }
        if (token._userId.isVerified) {
            let e = new Error('Already verified.');
            e.name = 'DuplicateVerificationError';
            throw e; 
        }
        // Verify and save the user
        return User.updateOne({_id: token._userId},{isVerified: true});
    })
    .then(()=>{
        message = {success: true, msg: 'Thank you for verifying.'} 
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));       
    })
    .catch((error)=>{
        if(error.name == 'InvalidTokenError') {
            message = {success: false, err:'Invalid Token!'};
        }
        else if(error.name == 'DuplicateVerificationError') {
            message = {success: true, err: 'This user has already been verified.'}
        }
        else {
            console.error(error);
            message = { 
                success: false, 
                serverErr: 'Something went wrong. Please try again later' 
            } 
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

// resend verification token
export async function get(req, res, next) {
    let message;
    let email;

    if(!req.user) {
        message = {success: false, tokenErr: 'You are not logged in'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return
    }

    return User.findById(req.user._id).exec()
    .then((user)=>{
        email = user.email;

        let randomToken = generator.generate({
            length:4, 
            numbers:true, 
            symbols:false, 
            uppercase:false,
            lowercase:false
        });
    
        let token = new Token({ _userId: user._id, token: randomToken });
        return token.save()
    })
    .then((token) => {
        return verifyEmail({token:token.token, email:email})
    })
    .then(()=>{
        message = {
            success:true,
            email: email,
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong on our end! Couldn't send verification code.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}