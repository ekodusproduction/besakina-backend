import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import pool from "../../../Mysql/mysql.database.js";
import { filterQuery, insertQuery, selectJoinQuery, selectQuery, updateQuery } from "../../../Utility/sqlQuery.js";
import { getUserAndVehicles } from "./sqlQuery.js";

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
        const [query, values] = await insertQuery("vehicles", requestBody)
        const [rows, field] = await connection.query(query, values);
        if (rows == null) {
            return { error: true, message: "Error adding vehicles" };
        }
        return { error: false, message: "vehicles added successfully", id: rows.insertId };
    } catch (error) {
        logger.info(error)
        throw new ApplicationError(error, 500);
    } finally {
        connection.release();
    }
};

const getAdvertisement = async (advertisementID) => {
    let connection = await pool.getConnection();

    try {
        const [rows, field] = await connection.query(getUserAndVehicles, [advertisementID])
        if (rows.length === 0) {
            return null;
        }

        let data = await parseImages(rows)
        data[0].user = await JSON.parse(data[0].user)

        return data[0];
    } catch (error) {

        logger.info(error);
        throw new ApplicationError(error, 500);
    } finally {
        connection.release();
    }
};

const getListAdvertisement = async () => {
    let connection = await pool.getConnection();

    try {
        const [query, values] = await selectQuery("vehicles", {}, { is_active: 1 })
        const [advertisements, fields] = await connection.query(query, values)

        if (advertisements.length === 0) {
            return null;
        }

        const data = await parseImages(advertisements)

        return advertisements;
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    } finally {
        connection.release();
    }
};

const filterAdvertisement = async (query) => {
    let connection = await pool.getConnection();

    try {
        let minPrice = query.minPrice && query.minPrice != '' ? parseInt(query.minPrice) : undefined;
        let maxPrice = query.maxPrice && query.maxPrice != '' ? parseInt(query.maxPrice) : undefined;
        console.log("minPrice", minPrice)
        console.log("maxPrice", maxPrice)
        const rangeCondition = minPrice != undefined && maxPrice != undefined ? { price: { min: minPrice, max: maxPrice } } : {};

        if (query?.minPrice || query.minPrice == '') delete query.minPrice;
        if (query?.maxPrice || query.maxPrice == '') delete query.maxPrice;
        console.log("query", query)
        console.log("rangeCondition", rangeCondition)

        const [sql, values] = await filterQuery("vehicles", [], { is_active: 1, ...query }, rangeCondition);
        const [rows, fields] = await connection.query(sql, values);
        const data = await parseImages(rows);
        return { error: false, message: "vehicles filter list", "data": data };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    } finally {
        connection.release();
    }
};


export const updateAdvertisement = async (advertisementID, updateBody, userId) => {
    let connection = await pool.getConnection();

    try {

        if (!updateBody || typeof updateBody !== 'object') {
            throw new ApplicationError("Invalid updateBody object provided", 400);
        }
        const [sql, values] = await updateQuery("vehicles", updateBody, { "id": advertisementID, "user_id": userId })
        const [rows, field] = await connection.query(sql, values)

        if (!rows) {
            throw new ApplicationError("vehicles not updated. No matching vehicles found for the provided ID.", 404);
        }

        return { error: false, message: "vehicles updated successfully", "advertisements": rows };
    } catch (error) {
        console.log("error in repo", error)
        logger.info(error);
        throw new ApplicationError(error, 500);
    } finally {
        connection.release();
    }
};

export const deactivateAdvertisement = async (advertisementID, userId) => {
    let connection = await pool.getConnection();
    try {
        const select = `SELECT * FROM vehicles WHERE is_active = 1 AND id = ? AND user_id = ?`;
        const [advertisement, selectFields] = await connection.query(select, [advertisementID, userId]);

        if (advertisement.length == 0) {
            throw new ApplicationError("Advertisement not found", 500);
        }

        const sql = `UPDATE vehicles SET is_active = 0 WHERE id = ?`;
        const [rows, fields] = await connection.query(sql, [advertisementID]);

        return { error: false, message: "Advertisement deactivated successfully" };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    } finally {
        connection.release();
    }
};

export const addImage = async (advertisementID, files, userId) => {
    let connection = await pool.getConnection();

    try {
        const [query, values] = await selectQuery("vehicles", {}, { id: advertisementID, user_id: userId })
        const [advertisement, field] = await connection.query(query, values);
        if (advertisement.length == 0) {
            throw new ApplicationError("vehicles not found.", 404);
        }
        const images = JSON.parse(advertisement[0].images || '[]');

        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify([...filePaths, ...images]);

        const [update, updateValues] = await updateQuery("vehicles", { images: photosJson }, { id: advertisementID })

        const [rows] = await connection.query(update, updateValues);
        return { error: false, message: "Images added successfully to the vehicles", data: filePaths };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    } finally {
        connection.release();
    }
};

export const deleteImage = async (advertisementID, files, userId) => {
    let connection = await pool.getConnection();

    try {
        const sql = `SELECT * FROM vehicles WHERE id = ? AND user_id = ?`
        const [rows, fields] = await connection.query(sql, [advertisementID, userId])

        if (rows[0].length == 0) {
            throw new ApplicationError("vehicles not found.", 404);
        }
        if (rows[0].images == []) {
            return { error: false, message: "Images deleted successfully from the vehicles" };
        }

        const parsedImages = JSON.parse(rows[0].images || []);

        const normalizedImages = parsedImages.map(image => image.replace(/\\/g, '/'));

        const filteredImages = normalizedImages.filter(image => !files.includes(image));

        let images = filteredImages;

        const photosJson = JSON.stringify(images);

        const updateSql = `UPDATE vehicles SET images =? WHERE id = ?`

        await connection.query(updateSql, [photosJson, advertisementID])

        return { error: false, message: "Images deleted successfully from the vehicles" };
    } catch (error) {
        logger.info(error);
        console.log("erro riu catch", error)
        throw new ApplicationError(error, 500);
    } finally {
        connection.release();
    }
};

export const activateAdvertisement = async (advertisementID, userId) => {
    let connection = await pool.getConnection();

    try {
        const [query, values] = await selectQuery('vehicles', { is_active: 1 }, { id: advertisementID, user_id: userId })
        const [advertisement] = await connection.query(query, values);

        if (advertisement.length == 0) {
            throw new ApplicationError("vehicles not found.", 404);
        }
        const [update, updateValues] = await updateQuery('vehicles', { is_active: 1 }, { id: advertisementID })
        const [rows] = await connection.query(update, updateValues);
        return { error: false, message: "vehicles activated successfully", data: rows };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
    } finally {
        connection.release();
    }
};

export const deleteAdvertisement = async (advertisementID, userId) => {
    let connection = await pool.getConnection();
    try {
        const sql = `DELETE FROM vehicles WHERE id = ? AND user_id = ?`
        const [advertisement] = await connection.query(sql, [advertisementID, userId]);
        return { error: false, message: "property deleted successfully" };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError(error, 500);
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
    deleteAdvertisement
};