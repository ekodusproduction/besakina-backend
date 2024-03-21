import { body } from "express-validator";
import { validateImagesArray } from "../../Utility/imageValidator.js";

const categoryValidationRules = () => {
    return [
        body('name').isDecimal().withMessage('Price must be a decimal').notEmpty().withMessage('Price is required'),
        body('photos').custom(validateImagesArray),
    ];
};
export const validationMiddlewarePost = async (req, res, next) => {
    const rules = categoryValidationRules();
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