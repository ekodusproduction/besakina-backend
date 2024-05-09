import multer from "multer";
import { ApplicationError } from "../ErrorHandler/applicationError.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cwd } from "process";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const multerMemoryStorage = multer.memoryStorage();

const multerUpload = multer({
    storage: multerMemoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

const uploadToSpaces = async (file) => {
    const params = {
        Bucket: 'your-bucket-name', 
        Key: `${uuidv4()}_${file.originalname}`, 
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; 
    } catch (error) {
        throw new ApplicationError('Failed to upload file to DigitalOcean Spaces');
    }
};

export const fileUpload = (destination) => {
    return async (req, res, next) => {
        multerUpload.any()(req, res, async (err) => {
            if (err) {
                return next(err);
            }

            if (!req.files || req.files.length === 0) {
                return next(new ApplicationError('No files uploaded', 400));
            }

            try {
                const uploadedFileUrls = [];
                for (const file of req.files) {
                    const fileUrl = await uploadToSpaces(file);
                    uploadedFileUrls.push(fileUrl);
                }
                req.fileUrls = uploadedFileUrls; 
                next();
            } catch (error) {
                next(error);
            }
        });
    };
};
