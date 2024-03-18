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
            const destinationPath = path.join(cwd(), 'public', destination);
            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            const name = Date.now() + "-" + file.originalname;
            cb(null, name);
        },
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new ApplicationError('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        }
    });
}

export const fileUpload = (destination) => {
    const upload = multer({ storage: createStorageMiddleware(destination) });
    return upload
};