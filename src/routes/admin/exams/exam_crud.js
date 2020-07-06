import Exam from '../../../_db/exam';

export async function get(req, res, next) {
    let message;
    
    Exam.find({}).exec()
    .then((exams)=>{
        message = {success: true, data: exams};
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
        message = {success: false, err: 'You are not authorised to create new exams'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    let exam = new Exam({
        sectorId: req.body.sectorId,
        examTitle: req.body.examTitle,
        heads: req.body.heads,
        details: req.body.details,
    })

    exam.save()
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

export async function del(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not to delete'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    Exam.findByIdAndDelete(req.body._id)
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
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to edit'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    let updateData = {
        sectorId: req.body.sectorId,
        examTitle: req.body.examTitle,
        heads: req.body.heads,
        details: req.body.details,
    }

    Exam.findByIdAndUpdate(req.body._id, updateData)
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