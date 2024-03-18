export const validateImagesArray = (value, { req }) => {
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
};