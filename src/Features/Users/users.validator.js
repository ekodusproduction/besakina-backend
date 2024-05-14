import { body, validationResult, check } from 'express-validator';


export const loginValidation = async (req, res, next) => {
    const rules = [
        body('mobile')
            .notEmpty().withMessage('Mobile number is required')
            .isMobilePhone('en-IN').withMessage('Invalid mobile number format'),
        body('otp')
            .notEmpty().withMessage('OTP is required')
            .isNumeric().withMessage('OTP must be a number')
            .isLength({ min: 4, max: 4 }).withMessage('OTP must be 4 digits')
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
    next()
};

export const mobileValidation = async (req, res, next) => {
    const rules = [
        body('mobile')
            .notEmpty().withMessage('Mobile number is required')
            .isMobilePhone('en-IN').withMessage('Invalid mobile number format')
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
    next()
};


