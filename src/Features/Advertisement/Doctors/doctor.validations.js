import { body, validationResult } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';

export const doctorValidationRules = () => {
    return [
        body('expertise').isString().notEmpty().withMessage('Expertise must be a non-empty string'),
        body('name').isString().notEmpty().withMessage('Name must be a non-empty string'),
        body('total_experience').isInt().notEmpty().withMessage('Total experience must be a non-empty integer'),
        body('title').isString().notEmpty().withMessage('Title must be a non-empty string'),
        body('description').isString().notEmpty().withMessage('Description must be a non-empty string'),
        body('price_registration').isDecimal().notEmpty().withMessage('Price registration must be a non-empty decimal'),
        body('price_per_visit').isString().notEmpty().withMessage('Price per visit must be a non-empty string'),
        body('images').custom(validateImagesArray).withMessage('Invalid images format or size'),
        body('map_location').isString().notEmpty().withMessage('Map location must be a non-empty string'),
        body('longitude').isDecimal().notEmpty().withMessage('Longitude must be a non-empty decimal'),
        body('latitude').isDecimal().notEmpty().withMessage('Latitude must be a non-empty decimal'),

        body('street').optional().isString().withMessage('Street must be a string'),
        body('locality').isString().withMessage('Address must be a string'),
        body('city').isString().withMessage('City must be a string'),
        body('state').isString().withMessage('State must be a string'),
        body('pincode').isInt().notEmpty().withMessage('Pincode must be a non-empty integer'),
    ];
};

export const editDoctorValidationRules = () => {
    return [
        body('expertise').optional().isString().withMessage('Expertise must be a string'),
        body('name').optional().isString().withMessage('Name must be a string'),
        body('total_experience').optional().isInt().withMessage('Total experience must be an integer'),
        body('title').optional().isString().withMessage('Title must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('price_registration').optional().isDecimal().withMessage('Price registration must be a decimal'),
        body('price_per_visit').optional().isDecimal().withMessage('Price per visit must be a decimal'),
        body('map_location').optional().isString().withMessage('Map location must be a string'),
        body('longitude').optional().isDecimal().withMessage('Longitude must be a decimal'),
        body('latitude').optional().isDecimal().withMessage('Latitude must be a decimal'),

        body('street').optional().isString().withMessage('Street must be a string'),
        body('address').optional().isString().withMessage('Address must be a string'),
        body('city').optional().isString().withMessage('City must be a string'),
        body('state').optional().isString().withMessage('State must be a string'),
        body('pincode').optional().isInt().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),
    ];
};


export const validationMiddlewarePost = async (req, res, next) => {
    const rules = doctorValidationRules();
    await Promise.all(rules.map(rule => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            status: "failed",
            http_status_code: 400,
        });
    }
    next();
};

export const validationMiddlewarePut = async (req, res, next) => {
    const rules = editDoctorValidationRules();
    await Promise.all(rules.map(rule => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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