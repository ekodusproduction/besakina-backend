import { body } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';

export const hospitalityValidationRules = () => {
    return [
        body('plan_id').isInt().withMessage('Plan ID must be an integer').notEmpty().withMessage('Plan ID is required'),
        body('type').isString().withMessage('Type must be a string').notEmpty().withMessage('Type is required'),
        body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
        body('full_address').isString().withMessage('Full address must be a string').notEmpty().withMessage('Full address is required'),
        body('ad_title').isString().withMessage('Ad title must be a string').notEmpty().withMessage('Ad title is required'),
        body('description').isString().withMessage('Description must be a string').notEmpty().withMessage('Description is required'),
        body('price').isDecimal().withMessage('Price must be a decimal').notEmpty().withMessage('Price is required'),
        body('photos').custom(validateImagesArray),
        body('map_location').isString().withMessage('Map location must be a string').notEmpty().withMessage('Map location is required'),
        body('longitude').isDecimal().withMessage('Longitude must be a decimal').notEmpty().withMessage('Longitude is required'),
        body('latitude').isDecimal().withMessage('Latitude must be a decimal').notEmpty().withMessage('Latitude is required'),
    ];
};

export const editHospitalityValidationRules = () => {
    return [
        body('type').isString().withMessage('Type must be a string'),
        body('name').isString().withMessage('Name must be a string'),
        body('full_address').isString().withMessage('Full address must be a string'),
        body('ad_title').isString().withMessage('Ad title must be a string'),
        body('description').isString().withMessage('Description must be a string'),
        body('price').isDecimal().withMessage('Price must be a decimal'),
        body('map_location').optional().isString().withMessage('Map location must be a string'),
        body('longitude').optional().isDecimal().withMessage('Longitude must be a decimal'),
        body('latitude').optional().isDecimal().withMessage('Latitude must be a decimal'),
    ];
};


export const validationMiddlewarePost = async (req, res, next) => {
    const rules = hospitalityValidationRules();
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
    const rules = editHospitalityValidationRules();
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