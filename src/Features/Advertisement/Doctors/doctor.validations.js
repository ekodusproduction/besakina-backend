import { body , validationResult} from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';

export const doctorValidationRules = () => {
    return [
        body('plan_id').isInt().notEmpty(),
        body('expertise').isString().notEmpty(),
        body('name').isString().notEmpty(),
        body('total_experience').isInt().notEmpty(),
        body('title').isString().notEmpty(),
        body('description').isString().notEmpty(),
        body('price_registration').isDecimal().notEmpty(),
        body('price_per_visit').isDecimal().notEmpty(),
        body('photos').custom(validateImagesArray),
        body('map_location').isString().withMessage('Map location must be a string').notEmpty().withMessage('Map location is required'),
        body('longitude').isDecimal().withMessage('Longitude must be a decimal').notEmpty().withMessage('Longitude is required'),
        body('latitude').isDecimal().withMessage('Latitude must be a decimal').notEmpty().withMessage('Latitude is required'),

        body('street').optional().isString().withMessage('Street must be a string'),
        body('address').isString().withMessage('Address must be a string'),
        body('city').isString().withMessage('City must be a string'),
        body('state').isString().withMessage('State must be a string'),
        body('pincode').isInt().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),
    ];
};

export const editDoctorValidationRules = () => {
    return [
        body('expertise').optional().isString(),
        body('name').optional().isString(),
        body('total_experience').optional().isInt(),
        body('title').optional().isString(),
        body('description').optional().isString(),
        body('price_registration').optional().isDecimal(),
        body('price_per_visit').optional().isDecimal(),
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