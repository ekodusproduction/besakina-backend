import { body, validationResult } from 'express-validator';

export const addPlanValidator = async (req, res, next) => {
    const rules = [
        body('type')
            .notEmpty().withMessage('Plan type is required')
            .isString().withMessage('Plan type must be a string')
            .isLength({ max: 20 }).withMessage('Plan type must not exceed 20 characters'),
        body('no_of_ads')
            .notEmpty().withMessage('Number of ads is required')
            .isInt({ min: 1 }).withMessage('Number of ads must be a positive integer'),
        body('price')
            .notEmpty().withMessage('Price is required')
            .isInt({ min: 0 }).withMessage('Price must be a non-negative integer'),
        body('validity')
            .notEmpty().withMessage('Validity period is required')
            .isInt({ min: 1 }).withMessage('Validity period must be a positive integer'),
        body('verification_badge')
            .optional().isBoolean().withMessage('Verification badge must be a boolean value'),
        body('search_priority')
            .notEmpty().withMessage('Search priority is required')
            .isInt({ min: 1, max: 3 }).withMessage('Search priority must be between 1 and 3'),
        body('membership_badge')
            .optional().isString().withMessage('Membership badge must be a string')
            .isLength({ max: 255 }).withMessage('Membership badge must not exceed 255 characters'),
        body('contact_limit')
            .optional().isInt({ min: 0 }).withMessage('Contact limit must be a non-negative integer')
    ];
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
