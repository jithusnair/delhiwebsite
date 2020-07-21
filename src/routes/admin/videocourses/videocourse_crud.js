import VideoCourse from '../../../_db/videocourse';
import Video from '../../../_db/video';

import {upload, deleteFile} from '../../../_helpers/s3NormalBucket'; 

export async function post(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to create new course'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }
    // if there is an image
    if(Object.keys(req.body).length == 0) {
        let singleUpload = upload.single('image');
        singleUpload(req, res, function(err) {
            let data = JSON.parse(req.body.data)
            if (err) {
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
            let videoCourse = new VideoCourse({
                courseTitle: data.courseTitle,
                price: parseInt(data.price), 
                features: data.features,
                courseValidity: data.courseValidity,
                demoVideo: data.demoVideo,
                launchDate: new Date(data.launchDate),
                image: { filename: req.file.originalname, url: req.file.location }
            });
            
            videoCourse.save()
            .then(()=>{
                message = {
                    success: true, 
                    msg: 'Course detail has been saved'
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
            .catch((error) => {
                console.log(error);
                message = { 
                    success: false, 
                    serverErr: 
                    `Something went wrong. Couldn't save the new course to database.
                    Please try again later.`
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
        });
    }
    // if there is no image
    else {
        let data = req.body;
        let videoCourse = new VideoCourse({
            courseTitle: data.courseTitle,
            price: parseInt(data.price), 
            features: data.features,
            courseValidity: data.courseValidity,
            demoVideo: data.demoVideo,
            launchDate: new Date(data.launchDate),
        });

        videoCourse.save()
        .then(()=>{
            message = {
                success: true, 
                msg: 'Course detail has been saved'
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
        .catch((error) => {
            console.log(error);
            message = { 
                success: false, 
                serverErr: 
                `Something went wrong. Couldn't save the new course to database.
                Please try again later.`
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        });
    }
}

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

export async function del(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to delete this'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    }
    else {
        // first find the course by id
        VideoCourse.find({_id:req.body._id, image: { $exists: true }}).exec()
            .then((course)=>{
                // delete the images from S3 if only if it exits
                if(course.length != 0){
                    return deleteFile(course[0].image.url.split('/').pop())
                }
                else return
            })
            // now remove the course
            .then(()=>VideoCourse.findByIdAndRemove(req.body._id).exec())
            // then remove all the videos referencing that course
            .then(()=> {
                return Video.findOneAndDelete({courseId: req.body._id}).exec()
            })
            .then(()=>{
                message = {success: true};
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
            .catch((error) => {
                console.log(error);
                message = { 
                    success: false, 
                    serverErr: 
                    `Something went wrong. Couldn't delete everything from database. 
                    Please try again later.`
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
    }           
}

export async function put(req, res, next) {
    let message;
    // Check if user is logged in and has permission
    if(!req.user || !req.user.isAdmin) {
        message = {success: false, err: 'You are not authorised to edit this'};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }
    // if the req has an image upload the image first
    // then delete the existing image and update the DB.
    if(Object.keys(req.body).length == 0) {
        let singleUpload = upload.single('image');
        singleUpload(req, res, function(err) {
            if (err) {
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
            let data = JSON.parse(req.body.data);
            let image = { filename: req.file.originalname, url: req.file.location };

            VideoCourse.find({_id:data._id, image: { $exists: true }}).exec()
            .then((course)=>{
                // delete the images from S3 if only if the details of 
                // the same exists in our db.
                if(course.length != 0){
                    return deleteFile(course[0].image.url.split('/').pop())
                }
                else return
            })
            .then(()=>{
                let updatedCourse = {
                    courseTitle: data.courseTitle,
                    price: parseInt(data.price), 
                    features: data.features,
                    courseValidity: data.courseValidity,
                    image: image,
                    demoVideo: data.demoVideo,
                    launchDate: new Date(data.launchDate),
                };
                return VideoCourse.findOneAndUpdate({_id: data._id}, updatedCourse).exec()
            })
            .then(()=>{
                message = {success: true};
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
            .catch((error) => {
                console.log(error);
                message = { 
                    success: false, 
                    serverErr: 
                    `Something went wrong. Couldn't save the edit to database. 
                    Please try again later.`
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
          });
    }
    else { 
        let updatedCourse =  { 
            courseTitle : req.body.courseTitle,
            price: parseInt(req.body.price),
            features : req.body.features,
            courseValidity : req.body.courseValidity,
            demoVideo: req.body.demoVideo,
            launchDate: new Date(req.body.launchDate),
        }
        VideoCourse.findOneAndUpdate({_id: req.body._id}, updatedCourse).exec()
            .then(()=>{
                message = {success: true};
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
            .catch((error) => {
                console.log(error);
                message = { 
                    success: false, 
                    serverErr: 
                    `Something went wrong. Couldn't save the edit to database. 
                    Please try again later.`
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(message));
            })
    }
}