import Section from '../../../../_db/section';
import Chapter from '../../../../_db/chapter';

// Get Chapters belonging to the list of sections under the particular testpack_id
// Otherwise get operation would yeild a lot of chapters
export async function get(req, res, next) {
    let message;
    let sections = [];
    let {testpack} = req.params;

    Section.find({testPackId: testpack}).select('_id').exec()
    .then((docs)=> {
        docs.forEach(doc => {
            sections.push(doc._id)
        });
        
        return Chapter.aggregate(
            [
                { $match : { sectionId : { $in : sections }} },

                {
                  $group :
                    {
                      _id : "$sectionId",
                      chapters: { $push:  { _id: "$_id", chapterTitle: "$chapterTitle" } }
                    }
                 }
            ]
        ).exec()
    })
    .then((docs)=>{  
        message = {
                success: true, 
                sectionsandchapters: docs,
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't get videos from database! 
            Please try again later.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

export async function post(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to create new videos'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    // Save the course details to DB
    let chapters = [];

    for (let i = 0; i < req.body.chapters.length; i++) {
        chapters[i] = {
            sectionId: req.body.sectionId, 
            chapterTitle: req.body.chapters[i] 
        }
    }

    Chapter.create(chapters)
    .then(()=>{
        message = {success: true,};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't save the sections to database.
            Please try again later.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

export async function put(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to create new videos'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    // Save the course details to DB

    let updatedChapter = {
        sectionId: req.body.sectionId,
        chapterTitle: req.body.chapterTitle,
    }

    Chapter.findByIdAndUpdate( req.body._id, updatedChapter)
    .then(()=>{
        message = {success: true,};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't save the sections to database.
            Please try again later.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

export async function del(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to delete chapters'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    Chapter.findByIdAndDelete( req.body._id)
    .then(()=>{
        message = {success: true,};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        console.log(error);
        message = {
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't save the sections to database.
            Please try again later.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}