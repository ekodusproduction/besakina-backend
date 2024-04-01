import multer from "multer";
import { ApplicationError } from "../ErrorHandler/applicationError.js";
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { cwd } from "process";

// Get the current module's path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createStorageMiddleware = (destination) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const destinationPath = path.join('public', destination);
            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            const name = Date.now() + "-" + file.originalname;
            cb(null, name);
        },
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!file) {
                cb(new ApplicationError('No files provided'));
            } else if (!allowedMimeTypes.includes(file.mimetype)) {
                cb(new ApplicationError('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
            } else {
                cb(null, true);
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        }
    });
}

export const fileUpload = (destination) => {
    return (req, res, next) => {
        const upload = multer({ storage: createStorageMiddleware(destination) }).any();
        upload(req, res, function (err) {
            if (err) {
                // Handle any upload errors here
                return next(err); // Pass the error to the error handling middleware
            }
            
            // No errors, proceed to the next middleware
            next();
        });
    };
};
