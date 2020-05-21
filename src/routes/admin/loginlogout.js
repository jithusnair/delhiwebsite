import passport from 'passport';

export async function post(req, res, next) {
    let message;
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            message = { success: false, serverErr: err };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        }
        // if authentication fails
        else if (!user) {
            message = { success: false, loginErr: info.message };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        }
        // if the user is NOT AN ADMIN
        else if(!user.isAdmin) {
            message = { success: false, loginErr: 'You should not be here!!!' };
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
                        username: tar.fullname,
                        fullname: tar.fullname,
                        isVerified: tar.isVerified,
                    };
                    message = { success: true, user: user };
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(message));
                }
            });
        }
      })(req, res, next);

	
}