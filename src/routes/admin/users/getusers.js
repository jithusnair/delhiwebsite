import User from '../../../_db/user';

export async function get(req, res, next) {
    let message;
    // check if authorised to get this data
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }
    User.find({isAdmin: false}, '_id fullname email mobile isVerified').exec()
    .then((users)=>{
        message = {success: true, users: users}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        console.error(error)
        message = {success: false, serverErr: 'Something went wrong on our end'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}