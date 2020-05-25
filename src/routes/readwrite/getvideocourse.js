import VideoCourse from '../../_db/videocourse';

export async function get(req, res, next) {
    let message;
    VideoCourse.find({}).exec()
        .then((docs)=>{
            message = {success: true, data: docs};
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
        .catch((error) => {
            console.log(error);
            message = { 
                success: false, 
                serverErr: 
                `Something went wrong. Couldn't get courses from database! 
                Please try again later.`
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
}