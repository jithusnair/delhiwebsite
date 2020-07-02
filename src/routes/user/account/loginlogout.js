import passport from 'passport';
import User from '../../../_db/user';

// Log In
// ****NOTES****
// 1)
// Sending response is quite boilerplaty.
// An async await/promise system might be better,
// but currently not enough time to figure out how to
// promisify passport.authenticate()
// 2)
// Server Errors should be logged and when it occurs a
// noticiation should be sent out.
export async function post(req, res, next) {
    let message;
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            message = { success: false, serverErr: err };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        }
        else if (!user) {
            message = { success: false, loginErr: info.message };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        }
        else {
            req.logIn(user, function(err) {
                if (err) {
                    message = { success: false, serverErr: err };
                } else {  
                    let user = req.user;
                    
                    let tar = JSON.parse(JSON.stringify(req.user))
                    user = {
                        _id: tar._id.toString(),
                        fullname: tar.fullname,
                        isVerified: tar.isVerified,
                        isAdmin: tar.isAdmin
                    };

                    User.findByIdAndUpdate(user._id, {lastLogin: Date.now()}).exec()
                    .catch((error)=>{
                        console.log('User was logged in but could not update lastLogin');
                        console.log(error);
                    })

                    message = { success: true, user: user };
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(message));
                }
            });
        }
      })(req, res, next);
}

// Log Out
export async function get(req, res, next) {
    req.logout();
    let message = {success: true, user:null};
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(message));
}