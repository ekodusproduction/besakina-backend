export const wishlistValidation = async (req, res, next) => {
    const validAdvTypes = ["property", "vehicles", "hospitals", "hospitality", "doctors", "education"];

    const rules = [
        // Validate adv_type
        check('adv_type')
            .notEmpty().withMessage('Advertisement type is required')
            .isIn(validAdvTypes).withMessage(`Invalid advertisement type. Allowed types are: ${validAdvTypes.join(', ')}`)
    ];

    // Run validation rules
    await Promise.all(rules.map(rule => rule.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            status: "failed",
            http_status_code: 400,
        });
    }
    // Proceed to the next middleware if validation passes
    next();
}