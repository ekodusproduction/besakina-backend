import { body, validationResult } from 'express-validator';

const educationValidationRules = () => {
    return [
        body('plan_id').isInt().withMessage('Plan ID must be an integer').notEmpty().withMessage('Plan ID is required'),
        body('user_id').isInt().withMessage('User ID must be an integer').notEmpty().withMessage('User ID is required'),
        body('course_type').isString().withMessage('Course type must be a string').notEmpty().withMessage('Course type is required'),
        body('domain').isString().withMessage('Domain must be a string').notEmpty().withMessage('Domain is required'),
        body('institution_name').isString().withMessage('Institution name must be a string').notEmpty().withMessage('Institution name is required'),
        body('course_duration').isString().withMessage('Course duration must be a string').notEmpty().withMessage('Course duration is required'),
        body('ad_title').isString().withMessage('Ad title must be a string').notEmpty().withMessage('Ad title is required'),
        body('description').isString().withMessage('Description must be a string').notEmpty().withMessage('Description is required'),
        body('price').isDecimal().withMessage('Price must be a decimal').notEmpty().withMessage('Price is required'),
        body('photos').optional().isArray().withMessage('Photos must be an array'),
        body('is_active').optional().isBoolean().withMessage('Is active must be a boolean'),
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
        body('photos').optional().isArray().withMessage('Photos must be an array'),
    ];
};

const validationMiddlewarePost = async (req, res, next) => {
    let validationRules = educationValidationRules();


    await Promise.resolve(validationRules.map(rule => rule.run(req)));
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            status: "failed",
            http_status_code: 400,
        });
    }

    next();
};

const ValidationMiddlewarePut = async (req, res, next) => {
    let validationRules = editEducationValidationRules();
    await Promise.resolve(validationRules.map(rule => rule.run(req)));
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            status: "failed",
            http_status_code: 400,
        });
    }

    next();
};


export const ImagesValidator = async function (req, res, next) {
    try {
        const rules = [
            body("images")
                .custom((value, { req }) => {
                    try {
                        if (!Array.isArray(req.files)) {
                            throw new Error("Images must be an array");
                        }

                        for (const file of req.files) {
                            if (!file || !file.filename || !file.mimetype) {
                                throw new Error("Invalid file in the images array");
                            }
                        }
                        return true;
                    } catch (error) {
                        throw new Error(error.message);
                    }
                })
        ];

        await Promise.all(rules.map(rule => rule.run(req)))
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).send({ "message": validationErrors.array()[0].msg, "status": "failed", "http_status_code": 400 })
        }
        next();
    } catch (error) {
        throw new Error(error)
    }
}



