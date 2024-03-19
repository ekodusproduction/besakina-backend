import { ApplicationError } from "../ErrorHandler/applicationError.js";

export const validateImagesArray = (value, { req }) => {
    try {
        if (!Array.isArray(req.files)) {
            throw new Error("Images must be an array");
        }

        for (const file of req.files) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new ApplicationError("Unsupported file type. Only JPEG, PNG, or JPG are allowed", 400);
            }
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};