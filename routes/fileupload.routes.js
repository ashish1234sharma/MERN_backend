import * as dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { profileupload, productimageupload } from '../controllers/fileupload.controller.js'
import { Auth } from '../middlewares/auth.js';

dotenv.config()
const FileuploadRoute = express.Router({ automatic405: false });

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
    region: process.env.S3_REGION,
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        },
    }),
});

FileuploadRoute.post(`/user/profile/image/`, Auth, upload.single('profileImg'), profileupload)
FileuploadRoute.post(`/user/product/images/`, Auth, upload.array('thumbnails', 5), productimageupload)

export {
    FileuploadRoute
}
