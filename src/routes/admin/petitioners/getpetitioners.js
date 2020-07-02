import Petitioner from '../../../_db/petitioner';

export async function get(req, res, next) {
    let message;

    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    Petitioner.find({}).exec()
    .then((docs)=>{
        message = {success:true, data: docs}
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        console.error(error)
        message = {success:false, serverErr:'Something went wrong, Sorry!'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}