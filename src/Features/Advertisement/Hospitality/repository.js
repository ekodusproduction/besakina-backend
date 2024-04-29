// repositories/advertisementRepository.js

import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import pool from "../../../Mysql/mysql.database.js";
import { filterQuery, insertQuery, selectJoinQuery, selectQuery, updateQuery } from "../../../Utility/sqlQuery.js";
import { getUserAndHospitality } from "./sqlQuery.js";

const parseImages = async (advertisements) => {
    return advertisements.map(advertisement => {
        advertisement.images = JSON.parse(advertisement.images);
        advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
        return advertisement;
    });
};
const parseUser = async (advertisements) => {
    return advertisements.map(advertisement => {
        advertisement.user = JSON.parse(advertisement.user);
        advertisement.user = advertisement.user.map(photo => photo.replace(/\\/g, '/'));
        return advertisement;
    });
};

const addAdvertisement = async (requestBody, files) => {
    let connection = await pool.getConnection();

    try {

        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify(filePaths);
        requestBody.images = photosJson;
        const [query, values] = await insertQuery("hospitality", requestBody)
        const [rows, field] = await connection.query(query, values);
        if (rows == null) {
            return { error: true, message: "Error adding hospitality" };
        }
        return { error: false, message: "hospitality added successfully", id: rows.insertId };
    } catch (error) {
        logger.info(error)
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
};

const getAdvertisement = async (advertisementID) => {
    let connection = await pool.getConnection();

    try {
        const [rows, field] = await connection.query(getUserAndHospitality, [advertisementID])
        if (rows.length === 0) {
            return null;
        }

        let data = await parseImages(rows)
        data[0].user = await JSON.parse(data[0].user)

        return data[0];
    } catch (error) {

        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
};



const getListAdvertisement = async () => {
    let connection = await pool.getConnection();

    try {
        const [query, values] = await selectQuery("hospitality", {}, { is_active: 1 })
        const [advertisements, fields] = await connection.query(query, values)

        if (advertisements.length === 0) {
            return null;
        }

        const data = await parseImages(advertisements)

        return advertisements;
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};

const filterAdvertisement = async (query) => {
    let connection = await pool.getConnection();

    try {
        // Define the rangeCondition object based on the query parameters
        const minPrice = query.minPrice ? parseInt(query.minPrice) : undefined;
        const maxPrice = query.maxPrice ? parseInt(query.maxPrice) : undefined;
        const rangeCondition = minPrice !== undefined && maxPrice !== undefined ? { price: { min: minPrice, max: maxPrice } } : {};

        // Remove minPrice and maxPrice from query object
        if (query?.minPrice) delete query.minPrice;
        if (query?.maxPrice) delete query.maxPrice;

        // Call filterQuery with the correct rangeCondition
        const [sql, values] = await filterQuery("hospitality", [], { is_active: 1, ...query }, rangeCondition);
        const [rows, fields] = await connection.query(sql, values);
        const data = await parseImages(rows);
        return data;

    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};


export const updateAdvertisement = async (advertisementID, body) => {
    let connection = await pool.getConnection();

    try {

        if (!body || typeof body !== 'object' || body == {}) {
            throw new ApplicationError("Invalid filter object provided", 400);
        }
        const [sql, values] = await updateQuery("hospitality", body, { "id": advertisementID })
        const [rows, field] = await connection.query(sql, values)

        if (!rows) {
            throw new ApplicationError("hospitality not updated. No matching hospitality found for the provided ID.", 404);
        }

        return { error: false, message: "hospitality updated successfully", "advertisements": rows };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};

export const deactivateAdvertisement = async (advertisementID) => {
    let connection = await pool.getConnection();

    try {
        const sql = `UPDATE hospitality SET is_active = 0 WHERE id = ?`
        const [rows, fields] = await connection.query(sql, [advertisementID]);
        if (rows.affectedRows === 0) {
            throw new ApplicationError("hospitality not deactivated. No matching hospitality found for the provided ID.", 404);
        }
        return { error: false, message: "hospitality deactivated successfully", advertisements: rows };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};

export const addImage = async (advertisementID, files) => {
    let connection = await pool.getConnection();

    try {
        const [query, values] = await selectQuery("hospitality", {}, { id: advertisementID })
        const [advertisement, field] = await connection.query(query, values);
        if (advertisement.length == 0) {
            throw new ApplicationError("hospitality not found.", 404);
        }
        const images = JSON.parse(advertisement[0].images || '[]');

        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify([...filePaths, ...images]);

        const [update, updateValues] = await updateQuery("hospitality", { images: photosJson }, { id: advertisementID })

        const [rows] = await connection.query(update, updateValues);
        return { error: false, message: "Images added successfully to the hospitality", data: filePaths };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};

export const deleteImage = async (advertisementID, files) => {
    let connection = await pool.getConnection();

    try {
        const sql = `SELECT * FROM vehicles WHERE id = ?`
        const [rows, fields] = await connection.query(sql, [advertisementID])
        console.log("rows", rows)
        if (rows[0].length == 0) {
            throw new ApplicationError("vehicles not found.", 404);
        }
        console.log("rows images", rows[0].images)

        if (rows[0].images == []) {
            return { error: false, message: "Images deleted successfully from the vehicles" };
        }

        const parsedImages = JSON.parse(rows[0].images || []);

        const normalizedImages = parsedImages.map(image => image.replace(/\\/g, '/'));

        const filteredImages = normalizedImages.filter(image => !files.includes(image));

        let images = filteredImages;

        const photosJson = JSON.stringify(images);

        const updateSql = `UPDATE vehicles SET images =? WHERE id = ?`
        console.log("photosJson images", photosJson)

        await connection.query(updateSql, [photosJson, advertisementID])

        return { error: false, message: "Images deleted successfully from the vehicles" };
    } catch (error) {
        logger.info(error);
        new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};

export const listUserAdvertisement = async (userID) => {
    let connection = await pool.getConnection();

    try {
        const advertisements = await connection.query('hospitality').where('user_id', userID);
        return { error: false, message: "User advertisement list", advertisements };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};

export const activateAdvertisement = async (advertisementID) => {
    let connection = await pool.getConnection();

    try {

        const [query, values] = await updateQuery('hospitality', { is_active: 1 }, { id: advertisementID })
        const [advertisement] = await connection.query(query, values);

        if (advertisement.length == 0) {
            throw new ApplicationError("hospitality not found.", 404);
        }
        const [update, updateValues] = await updateQuery('hospitality', { is_active: 1 }, { id: advertisementID })
        const [rows] = await connection.query(update, updateValues);
        return { error: false, message: "hospitality activated successfully", data: rows };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};

export default {
    addAdvertisement,
    getAdvertisement,
    getListAdvertisement,
    filterAdvertisement,
    deactivateAdvertisement,
    updateAdvertisement,
    addImage,
    activateAdvertisement,
    deleteImage,
    listUserAdvertisement,
};