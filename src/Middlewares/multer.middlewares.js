import multer from "multer";
import { ApplicationError } from "../ErrorHandler/applicationError.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cwd } from "process";
import uploadToSpaces from "../config/aws-sdk.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const multerMemoryStorage = multer.memoryStorage();

const multerUpload = multer({
    storage: multerMemoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

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
                    console.log("file url in middleware", fileUrl)
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
