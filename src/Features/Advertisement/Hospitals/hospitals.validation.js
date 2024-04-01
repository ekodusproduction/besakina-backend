import { body, validationResult } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';


export const hospitalValidationRules = () => {
    return [
        body('user_id').isInt().withMessage('User ID must be an integer').notEmpty().withMessage('User ID is required'),
        body('type').isString().withMessage('Type must be a string').notEmpty().withMessage('Type is required'),
        body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
        body('full_address').isString().withMessage('Full address must be a string').notEmpty().withMessage('Full address is required'),
        body('title').isString().withMessage('Title must be a string').notEmpty().withMessage('Title is required'),
        body('description').isString().withMessage('Description must be a string').notEmpty().withMessage('Description is required'),
        body('price_registration').isDecimal().withMessage('Price registration must be a decimal').notEmpty().withMessage('Price registration is required'),
        body('price_per_visit').isDecimal().withMessage('Price per visit must be a decimal').notEmpty().withMessage('Price per visit is required'),
        body('images').custom(validateImagesArray),
        body('is_active').isBoolean().optional().withMessage('Is active must be a boolean'),

        body('street').optional().isString().withMessage('Street must be a string'),
        body('area').isString().withMessage('Address must be a string'),
        body('city').isString().withMessage('City must be a string'),
        body('state').isString().withMessage('State must be a string'),
        body('pincode').isInt().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),
    ];
};
export const editHospitalValidationRules = () => {
    return [
        body('plan_id').optional().isInt().withMessage('Plan ID must be an integer'),
        body('user_id').optional().isInt().withMessage('User ID must be an integer'),
        body('type').optional().isString().withMessage('Type must be a string'),
        body('name').optional().isString().withMessage('Name must be a string'),
        body('full_address').optional().isString().withMessage('Full address must be a string'),
        body('title').optional().isString().withMessage('Title must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('price_registration').optional().isDecimal().withMessage('Price registration must be a decimal'),
        body('price_per_visit').optional().isDecimal().withMessage('Price per visit must be a decimal'),
        body('images').optional().custom(validateImagesArray),
        body('is_active').optional().isBoolean().withMessage('Is active must be a boolean'),

        body('street').optional().isString().withMessage('Street must be a string'),
        body('address').optional().isString().withMessage('Address must be a string'),
        body('city').optional().isString().withMessage('City must be a string'),
        body('state').optional().isString().withMessage('State must be a string'),
        body('pincode').optional().isInt().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),
    ];
};


export const validationMiddlewarePost = async (req, res, next) => {
    const rules = hospitalValidationRules();
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
    const rules = editHospitalValidationRules();
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