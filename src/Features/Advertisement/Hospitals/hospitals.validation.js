import { body } from 'express-validator';

export const hospitalValidationRules = () => {
    return [
        body('plan_id').isInt().withMessage('Plan ID must be an integer').notEmpty().withMessage('Plan ID is required'),
        body('user_id').isInt().withMessage('User ID must be an integer').notEmpty().withMessage('User ID is required'),
        body('type').isString().withMessage('Type must be a string').notEmpty().withMessage('Type is required'),
        body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
        body('full_address').isString().withMessage('Full address must be a string').notEmpty().withMessage('Full address is required'),
        body('title').isString().withMessage('Title must be a string').notEmpty().withMessage('Title is required'),
        body('description').isString().withMessage('Description must be a string').notEmpty().withMessage('Description is required'),
        body('price_registration').isDecimal().withMessage('Price registration must be a decimal').notEmpty().withMessage('Price registration is required'),
        body('price_per_visit').isDecimal().withMessage('Price per visit must be a decimal').notEmpty().withMessage('Price per visit is required'),
        body('photos').isArray().withMessage('Photos must be an array'),
        body('is_active').isBoolean().optional().withMessage('Is active must be a boolean'),
    ];
};
