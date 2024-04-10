import { body, validationResult } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';
import { deleteFiles } from '../../../Utility/deleteFiles.js';

export const hospitalValidationRules = () => {
    return [
        body('type').isString().withMessage('Type must be a string').trim().notEmpty(),
        body('name').trim().isString().withMessage('Name must be a string'),
        body('title').trim().isString().withMessage('Title must be a string'),
        body('description').trim().isString().withMessage('Description must be a string'),
        body('price_registration').isString().withMessage('Price registration must be a decimal').toInt(),
        body('price_per_visit').isString().withMessage('Price per visit must be a decimal').toInt(),

        body('street').optional().trim().isString().withMessage('Street must be a string'),
        body('locality').trim().isString().withMessage('Address must be a string'),
        body('city').trim().isString().withMessage('City must be a string'),
        body('state').trim().isString().withMessage('State must be a string'),
        body('pincode').isString().withMessage('Pincode must be an integer').toInt(),

        body('images').optional(),
        body('video').optional(),

        body('verified').isString().withMessage('verified must be a boolean'),

        body('map_location').optional(),
        body('longitude').optional().toFloat(),
        body('latitude').optional().toFloat(),
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
    console.log(req.body)
    const rules = hospitalValidationRules();
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