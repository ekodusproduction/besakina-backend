import { body, validationResult } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';
import { deleteFiles } from '../../../Utility/deleteFiles.js';

export const hospitalityValidationRules = () => {
    return [
        body('type').isString().trim().withMessage('Type must be a string'),
        body('name').isString().withMessage('Name must be a string'),
        body('title').isString().withMessage('Ad title must be a string').notEmpty().withMessage('Ad title is required'),
        body('description').isString().withMessage('Description must be a string').notEmpty().withMessage('Description is required'),
        body('price').optional().isString().withMessage('Price is required'),
        body('images').custom(validateImagesArray),
        body('longitude').optional().isDecimal().withMessage('Longitude must be a decimal'),
        body('latitude').optional().isDecimal().withMessage('Latitude must be a decimal'),

        body('street').optional().isString().withMessage('Street must be a string'),
        body('locality').isString().withMessage('Address must be a string'),
        body('city').isString().withMessage('City must be a string'),
        body('state').isString().withMessage('State must be a string'),
        body('pincode').isInt().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),
    ];
};

export const editHospitalityValidationRules = () => {
    return [
        body('type').optional().isString().withMessage('Type must be a string'),
        body('name').optional().isString().withMessage('Name must be a string'),
        body('full_address').optional().isString().withMessage('Full address must be a string'),
        body('ad_title').optional().isString().withMessage('Ad title must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('price').optional().isString().withMessage('Price must be a decimal'),
        body('map_location').optional().isString().withMessage('Map location must be a string'),
        body('longitude').optional().isDecimal().withMessage('Longitude must be a decimal'),
        body('latitude').optional().isDecimal().withMessage('Latitude must be a decimal'),

        // body('verified').isString().withMessage('verified must be a boolean'),
        body('seen_by').optional().isString().withMessage('seen_by must be a string'),

        body('street').optional().isString().withMessage('Street must be a string'),
        body('address').optional().isString().withMessage('Address must be a string'),
        body('city').optional().isString().withMessage('City must be a string'),
        body('state').optional().isString().withMessage('State must be a string'),
        body('pincode').optional().isString().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),
    ];
};


export const validationMiddlewarePost = async (req, res, next) => {
    const rules = hospitalityValidationRules();
    await Promise.all(rules.map(rule => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.files) {
            await deleteFiles(req.files)
        }
        return res.status(400).json({
            message: errors.array()[0].msg,
            status: "failed",
            http_status_code: 400,
        });
    }
    next();
};

export const validationMiddlewarePut = async (req, res, next) => {
    console.log("inside edit hospitality", req.body)
    const rules = editHospitalityValidationRules();
    await Promise.all(rules.map(rule => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.files) {
            await deleteFiles(req.files)
        }
        return res.status(400).json({
            message: errors.array()[0].msg,
            status: "failed",
            http_status_code: 400,
        });
    }
    next();
};

const imageUpload = () => {
    return [
        body('images').custom(validateImagesArray),
    ]
}
const videoUpload = () => {
    return [
        body('video').custom(validateImagesArray),
    ]
}
export const imageValidator = async (req, res, next) => {
    const rules = imageUpload();
    await Promise.all(rules.map(rule => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await deleteFiles(req.files)
        return res.status(400).json({
            message: errors.array()[0].msg,
            status: "failed",
            http_status_code: 400,
        });
    }
    next();
};

export const videoValidator = async (req, res, next) => {
    const rules = videoUpload();
    await Promise.all(rules.map(rule => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await deleteFiles(req.files)
        return res.status(400).json({
            message: errors.array()[0].msg,
            status: "failed",
            http_status_code: 400,
        });
    }
    next();
};