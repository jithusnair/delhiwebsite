import Sector from '../../../_db/sector';

export async function get(req, res, next) {
    let message;
    
    Sector.find({}).exec()
    .then((sectors)=>{
        message = {success: true, data: sectors};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        console.error(error);
        message = {
            success: false, 
            message: 'Something went wrong! Could not get data from DB'
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

export async function post(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to create new course'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    let sector = new Sector({
        sectorTitle: req.body.sectorTitle,
    })

    sector.save()
    .then(()=>{
        message = {success: true};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        console.error(error);
        message = {success: false, serverErr: 'Something went wrong! Please try again later'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

export async function put(req, res, next) {
    let message;
    
    Sector.findByIdAndUpdate(req.body._id, {sectorTitle: req.body.sectorTitle}).exec()
    .then((sectors)=>{
        message = {success: true};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        console.error(error);
        message = {
            success: false, 
            message: 'Something went wrong! Could not delete data'
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

export async function del(req, res, next) {
    let message;
    
    Sector.findByIdAndDelete(req.body.data._id).exec()
    .then((sectors)=>{
        message = {success: true};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error)=>{
        console.error(error);
        message = {
            success: false, 
            message: 'Something went wrong! Could not delete data'
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}