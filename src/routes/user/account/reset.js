import User from '../../../_db/user';
import Token from '../../../_db/token';

// check if the token exists when user first lands on [reset].svelte page
export async function get(req, res, next) {
    let message;
    let token = req.query.token;
    // Find the given token
    Token.findById(token).exec()
    .then((token) => {
        if (!token) {
            let e = new Error('Invalid code. The token code entered is incorrect');
            e.name = 'TokenError';
            throw e;
        }
        // If we found a token, find a matching user
        return User.findOne({ _id: token._userId }).exec()
    })
    .then((user)=>{
        if (!user) {
            let e = new Error('We were unable to find a user for this token.');
            e.name = 'NoUserError';
            throw e;
        }
        message = {success: true, token: token, user: user._id};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.error(error);
        // If no token was found
        if(err.name == 'TokenError') {
            message = { 
                success: false, 
                err: error.message
            };
        }
        // if for some reason the user corresponding to token does not exist
        else if(error.name == 'NoUserError') {
            message = { 
                success: false, 
                err: error.message
            };
        }
        // all other potential server errors
        else {
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

export async function post(req, res, next) {
    let message;
    Token.findById(req.body.token).exec()
    .then((token) => {
        if (!token) {
            var e = new Error('No such token');
            e.name = 'TokenAbsentError';
            throw e;
        }
        // If we found a token, find a matching user
        return User.findById(req.body.user).exec();
    })
    .then((user) => user.setPassword(req.body.newPassword))
    .then((user)=> user.save())
    .then(()=> {
        message = {success: true}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        console.log(error);
        if(err.name == 'TokenAbsentError') {
            message = { success: false, err: err.message};
        }
        else {
            message = { 
                success: false, 
                serverErr: 'Something went wrong on our end! Try again after a while'}
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}
