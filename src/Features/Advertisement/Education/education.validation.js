import { body, validationResult } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';

const educationValidationRules = () => {
    return [
        body('type').isString().trim().withMessage('Course type must be a string'),
        body('domain').isString().trim().withMessage('Domain must be a string'),
        body('institution_name').isString().trim().withMessage('Institution name must be a string'),
        body('course_duration').isString().trim().withMessage('Course duration must be a string'),
        body('title').isString().trim().withMessage('Adv title must be a string'),
        body('description').isString().trim().withMessage('Description must be a string'),
        body('price').isString().toFloat().withMessage('Price must be a decimal'),

        body('street').isString().trim().withMessage('Street must be a string'),
        body('locality').isString().trim().withMessage('locality must be a string'),
        body('city').isString().trim().withMessage('City must be a string'),
        body('state').isString().trim().withMessage('State must be a string'),
        body('pincode').isString().toInt().withMessage('Pincode must be an integer'),

        body('images').optional(),
        body('video').optional(),

        body('map_location').optional(),
        body('longitude').optional().toFloat(),
        body('latitude').optional().toFloat(),
    ];
};

const editEducationValidationRules = () => {
    return [
        body('course_type').optional().isString().trim().withMessage('Course type must be a string'),
        body('domain').optional().isString().trim().withMessage('Domain must be a string'),
        body('institution_name').optional().isString().trim().withMessage('Institution name must be a string'),
        body('course_duration').optional().isString().trim().withMessage('Course duration must be a string'),
        body('ad_title').optional().isString().trim().withMessage('Ad title must be a string'),
        body('description').optional().isString().trim().withMessage('Description must be a string'),
        body('price').optional().isDecimal().withMessage('Price must be a decimal'),

        body('street').optional().isString().trim().withMessage('Street must be a string'),
        body('address').optional().isString().trim().withMessage('Address must be a string'),
        body('city').optional().isString().trim().withMessage('City must be a string'),
        body('state').optional().isString().trim().withMessage('State must be a string'),
        body('pincode').optional().isString().toInt().withMessage('Pincode must be an integer'),

        body('images').optional(),
        body('video').optional(),

        body('verified').isString().withMessage('verified must be a boolean'),
        body('seen_by').isString().withMessage('seen_by must be a string'),

        body('map_location').optional().withMessage('Map location must be a non-empty string'),
        body('longitude').optional().withMessage('Longitude must be a non-empty decimal'),
        body('latitude').optional().withMessage('Latitude must be a non-empty decimal'),
    ];
};

// Middleware for validation on POST request
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

// Middleware for validation on PUT request
export const validationMiddlewarePut = async (req, res, next) => {
    const rules = editEducationValidationRules();
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

// Middleware for image validation
const imageUpload = () => {
    return [
        body('images').custom(validateImagesArray),
    ]
};
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
