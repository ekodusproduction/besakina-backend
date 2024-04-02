import { body, validationResult } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';

export const hospitalValidationRules = () => {
    return [
        body('type').isString().trim().withMessage('Type must be a string'),
        body('name').isString().trim().withMessage('Name must be a string'),
        body('full_address').isString().trim().withMessage('Full address must be a string'),
        body('title').isString().trim().withMessage('Title must be a string'),
        body('description').isString().trim().withMessage('Description must be a string'),
        body('price_registration').toInt().withMessage('Price registration must be a decimal'),
        body('price_per_visit').toInt().withMessage('Price per visit must be a decimal'),

        body('street').optional().isString().trim().withMessage('Street must be a string'),
        body('locality').isString().trim().withMessage('Address must be a string'),
        body('city').isString().trim().withMessage('City must be a string'),
        body('state').isString().trim().withMessage('State must be a string'),
        body('pincode').toInt().withMessage('Pincode must be an integer'),

        body('images').optional(),
        body('video').optional(),

        body('map_location').optional().withMessage('Map location must be a non-empty string'),
        body('longitude').optional().withMessage('Longitude must be a non-empty decimal').toFloat(),
        body('latitude').optional().withMessage('Latitude must be a non-empty decimal').toFloat(),
    ];
};

export const editHospitalValidationRules = () => {
    return [
        body('type').optional().isString().trim().withMessage('Type must be a string'),
        body('name').optional().isString().trim().withMessage('Name must be a string'),
        body('full_address').optional().isString().trim().withMessage('Full address must be a string'),
        body('title').optional().isString().trim().withMessage('Title must be a string'),
        body('description').optional().isString().trim().withMessage('Description must be a string'),
        body('price_registration').optional().toInt().withMessage('Price registration must be a decimal'),
        body('price_per_visit').optional().toInt().withMessage('Price per visit must be a decimal'),
        body('images').optional().custom(validateImagesArray),

        body('street').optional().isString().trim().withMessage('Street must be a string'),
        body('locality').optional().isString().trim().withMessage('Address must be a string'),
        body('city').optional().isString().trim().withMessage('City must be a string'),
        body('state').optional().isString().trim().withMessage('State must be a string'),
        body('pincode').optional().toInt().withMessage('Pincode must be an integer'),

        body('images').optional(),
        body('video').optional(),

        body('map_location').optional().withMessage('Map location must be a non-empty string'),
        body('longitude').optional().toFloat().withMessage('Longitude must be a non-empty decimal'),
        body('latitude').optional().toFloat().withMessage('Latitude must be a non-empty decimal'),
    ];
};


export const validationMiddlewarePost = async (req, res, next) => {
    const rules = hospitalValidationRules();
    console.log(req.body)
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
    const rules = editHospitalValidationRules();
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