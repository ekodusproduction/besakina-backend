import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import { sendResponse, sendError } from "../../Utility/response.js";
import pool from "../../Mysql/mysql.database.js";
import { fileUpload } from "../../Middlewares/multer.middleware.js";
// import path from 'path';  // Import path module
import { insertQuery, selectQuery, updateQuery } from "../../Utility/mysqlQuery.js";

export const addAdvertisement = async (req, res, next) => {
    let connection;
    try {
        let requestBody = req.body;
        requestBody.user_id = req.userId;
        const category = req.params.category;
        // Assuming files are part of req (e.g., uploaded using multer)
        const files = req.files;
        // Extract file paths from req.files
        const filePaths = files.map(file => file.path);
        // Convert file paths to a JSON array
        const photosJson = JSON.stringify(filePaths);
        requestBody.photos = photosJson;
        connection = await pool.getConnection();
        const { query, values } = await insertQuery(category, requestBody);
        console.log(query);
        await connection.beginTransaction();
        const rows = await connection.query(query, values);
        if (rows.affectedRows === 0) {
            await connection.rollback();
            return sendError(res, "Error adding advertisement", null, 400);
        }
        await connection.commit();
        return sendResponse(res, "Advertisement added successfully", { result: rows.insertId }, 201);
    } catch (error) {
        connection.rollback()
        await sendError(error)
    } finally {
        connection.end();
    }
}

export const getAdvertisement = async (req, res, next) => {
    let connection;
    try {
        const advertisementID = req.params.id;
        const category = req.params.category;

        connection = await pool.getConnection();
        const { query, values } = await selectQuery(category, [], { id: advertisementID, is_active: 1 });

        const rows = await connection.query(query, values);

        if (rows.length === 0) {
            return sendError(res, "Advertisement not found", null, 404);
        }

        return sendResponse(res, "Advertisement fetched successfully", { advertisement: rows[0] }, 200);

    } catch (error) {
        return sendError(res, error.message || "Error fetching advertisement", null, 500);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
export const getListAdvertisement = async (req, res, next) => {
    let connection;
    try {
        const category = req.params.category;

        connection = await pool.getConnection();
        const { query, values } = await selectQuery(category, [], { is_active: 1 });

        const rows = await connection.query(query, values);

        if (rows.length === 0) {
            return sendError(res, "Advertisements not found", null, 404);
        }

        return sendResponse(res, "Advertisements fetched successfully", { advertisements: rows }, 200);

    } catch (error) {
        return sendError(res, error.message || "Error fetching advertisements", null, 500);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
export const filterAdvertisement = async (req, res, next) => {
    let connection;
    try {
        const category = req.params.category;
        let filter = req.query;
        filter.is_active = true;
        // Validate and sanitize the filter object if needed
        connection = await pool.getConnection();
        const { query, values } = await selectQuery(category, [], filter);
        const rows = await connection.query(query, values);
        if (rows.length === 0) {
            return sendError(res, "Advertisements not found", null, 404);
        }
        return sendResponse(res, "Advertisements fetched successfully", { advertisements: rows }, 200);
    } catch (error) {
        return sendError(res, error.message || "Error fetching advertisements", null, 500);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
export const updateAdvertisement = async (req, res, next) => {
    // Implement your logic for updateAdvertisement
    let connection;
    try {
        const category = req.params.category;
        const advertisementID = req.params.id;
        const filter = req.body;
        // Validate and sanitize the filter object if needed
        connection = await pool.getConnection();
        const { query, values } = await updateQuery(category, {}, filter);
        const rows = await connection.query(query, values);
        if (rows.length === 0) {
            return sendError(res, "Advertisement not updated. No matching advertisement found for the provided ID.", null, 404);
        }
        return sendResponse(res, "Advertisements updated successfully", { advertisements: rows }, 200);
    } catch (error) {
        await connection.rollback();
        return sendError(res, error.message || "Error fetching advertisements", null, 500);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
export const deleteAdvertisement = async (req, res, next) => {
    // Implement your logic for deleteAdvertisement
    let connection;
    try {
        const category = req.params.category;
        const advertisementID = req.params.id;
        // Validate and sanitize the filter object if needed
        connection = await pool.getConnection();
        const { query, values } = await updateQuery(category, { "is_active": 0 }, { id: advertisementID, is_active: 0 });
        const rows = await connection.query(query, values);
        if (rows.length === 0) {
            return sendError(res, "Advertisement not deleted. No matching advertisement found for the provided ID.", null, 404);
        }
        return sendResponse(res, "Advertisements deleted successfully", { advertisements: rows }, 200);
    } catch (error) {
        await connection.rollback();
        return sendError(res, error.message || "Error fetching advertisements", null, 500);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
export const addImage = async (req, res, next) => {
    let connection;
    try {
        const category = req.params.category;
        const advertisementID = req.params.id;
        let files = req.files;
        // If it's a single file, convert it to an array
        if (!Array.isArray(files)) {
            files = [files];
        }
        // Extract file paths from req.files
        const filePaths = files.map(file => file.path);
        // Validate and sanitize the filter object if needed
        connection = await pool.getConnection();
        const { query1, values1 } = await selectQuery(category, ['photos'], { id: advertisementID });
        const results = await connection.query(query1, values1)
        if (results.length === 0) {
            return sendError(res, "Advertisement not found.", null, 404);
        }
        const photos = JSON.parse(results.photos);
        // Convert file paths to a JSON array
        const photosJson = JSON.stringify([...filePaths, ...photos]);
        const { query, values } = await updateQuery(category, { "photos": photosJson }, { id: advertisementID, is_active: 1 });
        const [rows] = await connection.query(query, values);
        if (rows.length === 0) {
            return sendError(res, "Failed to add images to the advertisement.", null, 404);
        }
        return sendResponse(res, "Images added successfully to the advertisement", { advertisements: rows }, 200);
    } catch (error) {
        await connection.rollback();
        return sendError(res, error.message || "Error adding images to the advertisement", null, 500);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
export const deleteImage = async (req, res, next) => {
    let connection;
    try {
        const category = req.params.category;
        const advertisementID = req.params.id;
        let files = req.body;
        // If it's a single file, convert it to an array

        // Extract file paths from req.files
        // Validate and sanitize the filter object if needed
        connection = await pool.getConnection();
        const [results] = await selectQuery(category, ['photos'], { id: advertisementID });
        if (results.length === 0) {
            return sendError(res, "Advertisement not found.", null, 404);
        }
        let photos = JSON.parse(results.photos).filter(item => files.indexOf(item) == false);
        // Convert file paths to a JSON array
        const photosJson = JSON.stringify(photos);

        const { query, values } = await updateQuery(category, { "photos": photosJson }, { id: advertisementID, is_active: 1 });
        const [rows] = await connection.query(query, values);
        if (rows.length === 0) {
            return sendError(res, "Failed to delete images of the advertisement.", null, 404);
        }
        files.map(item => {
            fileUpload.delete(item);
        })
        return sendResponse(res, "Images deleted successfully of the advertisement", { advertisements: rows }, 200);
    } catch (error) {
        await connection.rollback();
        return sendError(res, error.message || "Error deleting images to the advertisement", null, 500);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
export const listUserAdvertisement = async (req, res, next) => {
    let connection;
    try {
        const category = req.params.category;
        const user_id = req.params.id;
        let files = req.body;
        // If it's a single file, convert it to an array

        // Extract file paths from req.files
        // Validate and sanitize the filter object if needed
        connection = await pool.getConnection();
        const [results] = await selectQuery(category, [], { user_id: user_id });
        if (results.length === 0) {
            return sendError(res, "Advertisement not found.", null, 404);
        }

        return sendResponse(res, "User advertisment list", { advertisements: results }, 200);
    } catch (error) {
        return sendError(res, error.message || "Error deleting images to the advertisement", null, 500);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}