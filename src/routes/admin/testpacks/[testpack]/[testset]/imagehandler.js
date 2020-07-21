import { upload } from '../../../../../_helpers/s3NormalBucket';

export async function post(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to create new course'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    let singleUpload = upload.single('image');
    singleUpload(req, res, function(err) {
        if (err) {
            console.log(err);
            message = { 
                success: false, 
                serverErr: 
                `Something went wrong. Couldn't save the new course to database.
                Please try again later.`
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
            return;
        }
        message = {
            success: true,
            file: req.file.location,
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    });
}