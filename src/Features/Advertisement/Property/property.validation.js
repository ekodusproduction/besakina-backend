import { body } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';

const allowedCategories = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK", "1RK", "HOUSE", "VILLA"]
export const propertiesValidationRules = () => {
    return [
        body('plan_id').isInt().withMessage('Plan ID must be an integer').notEmpty().withMessage('Plan ID is required'),
        body('title').isString().withMessage('title must be a string').notEmpty().withMessage('Title is required'),
        body('type').isString().withMessage('Type must be a string').notEmpty().withMessage('Type is required'),
        body('bedrooms').isInt().withMessage('Bedrooms must be an integer').notEmpty().withMessage('Bedrooms is required'),
        body('bathrooms').isInt().withMessage('Bathrooms must be an integer').notEmpty().withMessage('Bathrooms is required'),
        body('furnishing').isString().withMessage('Furnishing must be a string').notEmpty().withMessage('Furnishing is required'),
        body('construction_status').isString().withMessage('Construction status must be a string').notEmpty().withMessage('Construction status is required'),
        body('listed_by').isString().withMessage('Listed by must be a string').notEmpty().withMessage('Listed by is required'),
        body('super_builtup_area').isDecimal().withMessage('Super builtup area must be a decimal'),
        body('carpet_area').isDecimal().withMessage('Carpet area must be a decimal'),
        body('maintenance').isDecimal().withMessage('Maintenance must be a decimal'),
        body('total_rooms').isInt().withMessage('Total floors must be an integer').notEmpty().withMessage('Total floors is required'),
        body('floor_no').isInt().withMessage('Floor number must be an integer').notEmpty().withMessage('Floor number is required'),
        body('car_parking').isInt().withMessage('Car parking must be an integer').notEmpty().withMessage('Car parking is required'),
        body('price').isDecimal().withMessage('Price must be a decimal').notEmpty().withMessage('Price is required'),
        body('photos').custom(validateImagesArray),
        body('category').isIn(allowedCategories).withMessage(`Category must be one of: ${allowedCategories.join(', ')}`),
        body('map_location').isString().withMessage('Map location must be a string').notEmpty().withMessage('Map location is required'),
        body('longitude').isString().withMessage('Longitude must be a decimal').notEmpty().withMessage('Longitude is required'),
        body('latitude').isString().withMessage('Latitude must be a decimal').notEmpty().withMessage('Latitude is required'),
    ];
};



export const editPropertiesValidationRules = () => {
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
    ];
};

const runValidation = async (req, res, next, rules) => {
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

export const validationMiddlewarePost = async (req, res, next) => {
    const rules = propertiesValidationRules();
    await runValidation(req, res, next, rules);
};

export const validationMiddlewarePut = async (req, res, next) => {
    const rules = editPropertiesValidationRules();
    await runValidation(req, res, next, rules);
};
