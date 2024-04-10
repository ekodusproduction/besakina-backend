import { body, validationResult } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';
import { deleteFiles } from '../../../Utility/deleteFiles.js';

const allowedCategories = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK", "1RK", "HOUSE", "VILLA"]
const propertiesValidationRules = () => {
    return [
        body('title').isString().withMessage('title must be a string').notEmpty().withMessage('Title is required'),
        body('type').isString().withMessage('Type must be a string').notEmpty().withMessage('Type is required'),
        body('bedrooms').isString().withMessage('Bedrooms must be an integer').notEmpty().withMessage('Bedrooms is required'),
        body('bathrooms').isString().withMessage('Bathrooms must be an integer').notEmpty().withMessage('Bathrooms is required'),
        body('furnishing').isString().withMessage('Furnishing must be a string').notEmpty().withMessage('Furnishing is required'),
        body('construction_status').isString().withMessage('Construction status must be a string').notEmpty().withMessage('Construction status is required'),
        body('listed_by').isString().withMessage('Listed by must be a string').notEmpty().withMessage('Listed by is required'),
        body('super_builtup_area').isString().withMessage('Super builtup area must be a string'),
        body('carpet_area').isString().withMessage('Carpet area must be a decimal'),
        body('maintenance').isString().withMessage('Maintenance must be a decimal'),
        body('total_rooms').isString().withMessage('Total floors must be an integer').notEmpty().withMessage('Total floors is required'),
        body('floor_no').isString().withMessage('Floor number must be an integer').notEmpty().withMessage('Floor number is required'),
        body('car_parking').isString().withMessage('Car parking must be an integer').notEmpty().withMessage('Car parking is required'),
        body('price').isString().withMessage('Price must be a decimal').notEmpty().withMessage('Price is required'),
        body('category').isString(allowedCategories).withMessage(`Category must be one of: ${allowedCategories.join(', ')}`),
        body('description').trim().isString().withMessage(`description must be string`),

        body('verified').isString().withMessage('verified must be a boolean'),

        body('street').optional().isString().withMessage('Street must be a string'),
        body('house_no').isString().withMessage('house_no must be a string'),
        body('landmark').isString().withMessage('landmark must be a string'),
        body('city').isString().withMessage('City must be a string'),
        body('state').isString().withMessage('State must be a string'),
        body('pincode').isString().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),

        body('images').optional(),
        body('video').optional(),

        body('map_location').optional().withMessage('Map location must be a non-empty string'),
        body('longitude').optional().withMessage('Longitude must be a non-empty decimal'),
        body('latitude').optional().withMessage('Latitude must be a non-empty decimal'),
    ];
};



const editPropertiesValidationRules = () => {
    return [
        body('type').optional().isString().withMessage('Type must be a string'),
        body('bedrooms').optional().isInt().withMessage('Bedrooms must be an integer'),
        body('bathrooms').optional().isInt().withMessage('Bathrooms must be an integer'),
        body('furnishing').optional().isString().withMessage('Furnishing must be a string'),
        body('construction_status').optional().isString().withMessage('Construction status must be a string'),
        body('listed_by').optional().isString().withMessage('Listed by must be a string'),
        body('super_builtup_area').optional().isDecimal().withMessage('Super builtup area must be a decimal'),
        body('carpet_area').optional().isDecimal().withMessage('Carpet area must be a decimal'),
        body('maintenance').optional().isDecimal().withMessage('Maintenance must be a decimal'),
        body('total_rooms').optional().isInt().withMessage('Total floors must be an integer'),
        body('floor_no').optional().isInt().withMessage('Floor number must be an integer'),
        body('car_parking').optional().isInt().withMessage('Car parking must be an integer'),
        body('price').optional().isDecimal().withMessage('Price must be a decimal'),
        body('category').optional().isIn(allowedCategories).withMessage(`Category must be one of: ${allowedCategories.join(', ')}`),
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
    const rules = propertiesValidationRules();
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
    const rules = editPropertiesValidationRules();
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


const imageUpload = () => {
    return [
        body('images').custom(validateImagesArray),
    ]
}
const videoUpload = () => {
    return [
        body('video').custom(validateVideos),
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