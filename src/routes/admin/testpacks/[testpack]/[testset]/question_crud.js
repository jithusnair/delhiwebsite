import Question from '../../../../../_db/question';
import Subject from '../../../../../_db/subject';
import {deleteMultiple} from '../../../../../_helpers/s3NormalBucket';

import mongoose from 'mongoose';

export async function get(req, res, next) {
    let message;
    let {testset} = req.params;

    Subject.aggregate(
    [
        { $match : { testSetId : mongoose.Types.ObjectId(testset) } },
        { $unset : [ "testSetId"] }
    ])
    .lookup({
            from: "questions",
            let: { "id": "$_id" },
            pipeline: [
                {"$match": {"$expr": {$eq: ["$subjectId", "$$id"]}}},
                { "$sort" : { "qnNumber" : 1 }}
            ],
            as: "questions"
    })
    .then((docs)=>{  
        message = {
                success: true, 
                subjectsandquestions: docs,
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

    let obj = {}
    obj.subjectId = req.body.subjectId;
    obj.qnNumber = req.body.qnNumber;

    obj.comprehension = req.body.comprehension;
    if(obj.comprehension) {
        obj.passageNumber = req.body.passageNumber;
        obj.passage = req.body.passage;
        // if this question is a continuation of previous comprehension question
        if(req.body.hindiVersion) {
            obj.passageHindi = req.body.passageHindi; 
        }
        if(req.body.compImages) {
            obj.compImages = req.body.compImages;
        }
    }

    if(req.body.hindiVersion) {
        obj.hindiVersion = req.body.hindiVersion;
        obj.questionHindi = req.body.questionHindi;
        obj.optionsHindiHtml = req.body.optionsHindiHtml;
        obj.optionsHindi = req.body.optionsHindi;
        obj.detailedAnsHindi = req.body.detailedAnsHindi;
    }

    if(req.body.quesImages) { 
        obj.quesImages = req.body.quesImages;
    }
    obj.question = req.body.question;
    
    obj.optionsAreImages = req.body.optionsAreImages;
    obj.optionsHtml = req.body.optionsHtml;
    obj.options = req.body.options;
    
    obj.correctAns = req.body.correctAns;

    if(req.body.detailedAnsImages) {
        obj.detailedAnsImages = req.body.detailedAnsImages;
    }
    obj.detailedAns = req.body.detailedAns;
    
    let question = new Question(obj);

    if(req.body.imagesToBeDeleted) {
        await deleteImages(req.body.imagesToBeDeleted);
    }
    
    // Save the course details to DB
    question.save()
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
        message = {success: false, err: 'You are not authorised to create edit'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    let obj = {}

    obj.subjectId = req.body.subjectId;
    obj.qnNumber = req.body.qnNumber;

    obj.comprehension = req.body.comprehension;
    if(obj.comprehension) {
        if(req.body.compImages) obj.compImages = req.body.compImages;
        obj.passage = req.body.passage;
        obj.passageNumber = req.body.passageNumber;
    } else {
        obj.compImages = null;
    }

    if(req.body.quesImages) obj.quesImages = req.body.quesImages;
    obj.question = req.body.question;
    
    obj.optionsAreImages = req.body.optionsAreImages;
    obj.options = req.body.options;
    obj.optionsHtml = req.body.optionsHtml;
    
    obj.correctAns = req.body.correctAns;
    if(req.body.detailedAnsImages) obj.detailedAnsImages = req.body.detailedAnsImages;
    obj.detailedAns = req.body.detailedAns;

    if(req.body.hindiVersion) {
        obj.hindiVersion = req.body.hindiVersion;
        obj.questionHindi = req.body.questionHindi;
        obj.optionsHindi = req.body.optionsHindi;
        obj.optionsHindiHtml = req.body.optionsHindiHtml
        obj.detailedAnsHindi = req.body.detailedAnsHindi;
        if(req.body.comprehension) {
            obj.passageHindi = req.body.passageHindi;
        }
    }

    let allImagesToBeDeleted = [];
    if(req.body.compImagesToBeDeleted) {
        allImagesToBeDeleted.push(...req.body.compImagesToBeDeleted);
    }
    if(req.body.otherImagesToBeDeleted) {
        allImagesToBeDeleted.push(...req.body.otherImagesToBeDeleted);
    }
    if(allImagesToBeDeleted.length != 0) {
        await deleteImages(allImagesToBeDeleted);
    }

    let dbAction;
    let passageChanged;

    if(req.body.passageChanged) {
        let findBy = {subjectId: obj.subjectId, passageNumber: obj.passageNumber};
        let updateFields = {compImages: obj.compImages, passage: obj.passage};
        if(req.body.hindiVersion) {
            updateFields.passageHindi = obj.passageHindi;
        } 
        passageChanged = true;
        dbAction = Question.updateMany(findBy, updateFields);
    }
    else {
        dbAction = Question.findByIdAndUpdate(req.body._id, obj);
    }

    dbAction.exec()
    .then(()=>{
        if(passageChanged) return Question.findByIdAndUpdate(req.body._id, obj).exec();
        message = {success: true,};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .then(()=>{
        if(passageChanged) {
            message = {success: true,};
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        }
        else return
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
        message = {success: false, err: 'You are not authorised to delete'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }

    let dbAction;

    if(req.body.comprehension) {
        let findBy = {
            subjectId: req.body.subjectId, 
            passageNumber: req.body.passageNumber
        };
        dbAction = Question.find(findBy);
    }
    else {
        dbAction = Question.findByIdAndDelete(req.body._id);
    }

    if(req.body.otherImagesToBeDeleted) {
        await deleteImages(req.body.otherImagesToBeDeleted);
    }

    dbAction.exec()
    .then(async (docs) => {
        if(req.body.comprehension) {
            if(docs.length == 1 && req.body.compImagesToBeDeleted) {
                await deleteImages(req.body.compImagesToBeDeleted);
            }
            return Question.findByIdAndDelete(req.body._id);
        }
        message = {success: true,};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .then(()=>{
        if(req.body.comprehension) {
            message = {success: true,};
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        }
    })
    .catch((error) => {
        console.log(error);
        message = { 
            success: false, 
            serverErr: 
            `Something went wrong. Couldn't delete the question.
            Please try again later.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}

async function deleteImages(imagesToDelete) {
    if(imagesToDelete.length != 0) {
        let imageKeysArray = [];
        for (let i = 0; i < imagesToDelete.length; i++) {
            let filename = imagesToDelete[i].split('/').pop()
            imageKeysArray.push({Key: filename});
        }
        await deleteMultiple(imageKeysArray);
    }
}