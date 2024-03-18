
export const editImagesValidator = async function (req, res, next) {
    try {
        const rules = [
            body("images")
                .custom((value, { req }) => {
                    try {
                        console.log(req)

                        if (req.files) {
                            if (!Array.isArray(req.files)) {
                                throw new ApplicationError("Images must be an array", 400);
                            }

                            for (const file of req.files) {
                                if (!file || !file.filename || !file.mimetype) {
                                    throw new ApplicationError("Invalid file in the images array", 400);
                                }
                            }
                        } else {
                            throw new ApplicationError("No files found.Invalid file in the images array", 400);

                        }

                        return true;
                    } catch (error) {
                        throw new ApplicationError(error.message, 400);
                    }
                })
        ];

        const errors = await Promise.resolve(validationResult(req));

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()[0].msg,
                status: "failed",
                http_status_code: 400,
            });
        }
        next();
    } catch (error) {
        throw new ApplicationError(error.message, 500)
    }
}