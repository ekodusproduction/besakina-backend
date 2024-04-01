import { body, validationResult } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';

const educationValidationRules = () => {
    return [
        body('user_id').isInt().withMessage('User ID must be an integer').notEmpty().withMessage('User ID is required'),
        body('course_type').isString().withMessage('Course type must be a string').notEmpty().withMessage('Course type is required'),
        body('domain').isString().withMessage('Domain must be a string').notEmpty().withMessage('Domain is required'),
        body('institution_name').isString().withMessage('Institution name must be a string').notEmpty().withMessage('Institution name is required'),
        body('course_duration').isString().withMessage('Course duration must be a string').notEmpty().withMessage('Course duration is required'),
        body('ad_title').isString().withMessage('Ad title must be a string').notEmpty().withMessage('Ad title is required'),
        body('description').isString().withMessage('Description must be a string').notEmpty().withMessage('Description is required'),
        body('price').isString().withMessage('Price must be a decimal').notEmpty().withMessage('Price is required'),

        body('images').optional().isArray().withMessage('Photos must be an array'),
        body('street').isString().withMessage('Street must be a string'),
        body('locality').isString().withMessage('locality must be a string'),
        body('city').isString().withMessage('City must be a string'),
        body('state').isString().withMessage('State must be a string'),
        body('pincode').isInt().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),
    ];
};

const editEducationValidationRules = () => {
    return [
        body('course_type').optional().isString().withMessage('Course type must be a string'),
        body('domain').optional().isString().withMessage('Domain must be a string'),
        body('institution_name').optional().isString().withMessage('Institution name must be a string'),
        body('course_duration').optional().isString().withMessage('Course duration must be a string'),
        body('ad_title').optional().isString().withMessage('Ad title must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('price').optional().isDecimal().withMessage('Price must be a decimal'),
        body('images').optional().isArray().withMessage('Photos must be an array'),

        body('street').optional().isString().withMessage('Street must be a string'),
        body('address').optional().isString().withMessage('Address must be a string'),
        body('city').optional().isString().withMessage('City must be a string'),
        body('state').optional().isString().withMessage('State must be a string'),
        body('pincode').optional().isInt().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),
    ];
};


export const validationMiddlewarePost = async (req, res, next) => {
    const rules = educationValidationRules();
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
    const rules = editEducationValidationRules();
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