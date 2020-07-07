import Exam from '../../../_db/exam';

export async function get(req, res, next) {
    let message;
    
    Exam.find({}).select('_id examTitle').exec()
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