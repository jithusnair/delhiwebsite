import User from '../../../_db/user';

export async function post(req, res, next) {
    let message;
    if(!req.user) {
        message = {success: false, err: 'You are not logged in'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return
    }
    // Find logged in user
    User.findOne({ _id: req.user._id }).exec()
    .then((user)=> {
        if (!user) {
            message = { 
                success: false, 
                msg: 'Unable to find the user.' 
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        }
        // Change the password
        else {
            user.changePassword(req.body.old, req.body.new, function(err){
                if(err) {
                    if(err.name === 'IncorrectPasswordError'){
                            message = { success: false, err: 'Permission denied. Incorrect Password' }; 
                    } 
                    else {
                        message = { success: false, err: 'Something went wrong!! Please try again after sometimes.' };
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(message));
                } 
                else {
                    message = { success: true, msg: 'Your password has been changed successfully' };
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(message));
                }
            });
        }
    });
}