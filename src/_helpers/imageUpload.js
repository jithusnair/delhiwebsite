const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'ap-south-1'
});

const s3 = new aws.S3();
export const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'direction-academy',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.originalname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});

export function deleteFile(key) {
    var bucketInstance = new aws.S3();
    var params = {
        Bucket: 'direction-academy',
        Key: key
    };
    return bucketInstance.deleteObject(params).promise();
}