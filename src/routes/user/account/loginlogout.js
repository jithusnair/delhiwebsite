import passport from 'passport';

export async function post(req, res, next) {
    let message;
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            message = { success: false, err: err };
        }
        if (!user) {
            message = { success: false, loginErr: info.message };
        }
        req.logIn(user, function(err) {
            if (err) {
                message = { success: false, loginErr: info.message };
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
            }
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
      })(req, res, next);
}

export async function get(req, res, next) {
    req.logout();
    let message = {success: true, user:null};
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(message));
}