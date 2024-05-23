
import { sendError, sendResponse } from '../../Utility/response.js';

export const createCategory = async (req, res, next) => {
    try {
        let requestBody = req.body;
        const [result] = await connection.query('category').insert(requestBody);
        if (!result) {
            return await sendError(res, 'Error adding advertisement', 400);
        }
        return await sendResponse(res, 'Advertisement added successfully', 201, { result });
    } catch (error) {
        next(error);
    }
};

export const listCategory = async (req, res, next) => {
    try {
        const categories = await connection.query('category').where({ is_active: 1 });
        if (!categories.length) {
            return await sendError(res, 'Advertisements not found', 404);
        }
        return await sendResponse(res, 'Advertisements fetched successfully', 200, { categories });
    } catch (error) {
        next(error);
    }
};
