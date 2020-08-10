import Exam from '../../../_db/exam';

export async function get(req, res, next) {
    let message;

    let {exam} = req.params;
    
    Exam.aggregate(
        [
            { $match : { examShortTitle : exam} },
            { $unset : [ "sectorId",] } 
        ])
        .lookup({
            from: "testpacks",
            let: { id: "$_id" },
            pipeline: [
                { $match:{ $expr:{ $eq: [ "$examId",  "$$id" ] },},},
                { $match:{ published: true } },
                { $project: { __v: 0,} }
            ],
            as: "testPacks"
        })
        .then((docs)=> {
            // first remove all the links from the video details
            if(!docs) {
                let e = new Error('Cannot find the exam');
                e.name = "CourseNullError";
                throw e;
            }
            message = {success: true, data: docs[0],};
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
        .catch((error) => {
            if(error.name == 'CourseNullError') {
                message = { 
                    success: false, 
                    err: 
                    `Could not find the exam.`
                };
            }
            else {
                console.log(error);
                message = { 
                    success: false, 
                    serverErr: 
                    `Something went wrong. Couldn't get videos from database! 
                    Please try again later.`
                };
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
}