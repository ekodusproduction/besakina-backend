// repositories/advertisementRepository.js

import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import pool from "../../../Mysql/mysql.database.js";
import { filterQuery, insertQuery, selectJoinQuery, selectQuery, updateQuery } from "../../../Utility/sqlQuery.js";
import { getUserAndDoctors } from "./sqlQuery.js";

const parseImages = async (advertisements) => {
    return advertisements.map(advertisement => {
        advertisement.images = JSON.parse(advertisement.images);
        advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
        return advertisement;
    });
};

const addAdvertisement = async (requestBody, files) => {
    let connection = await pool.getConnection();

    try {
        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify(filePaths);
        requestBody.images = photosJson;
        console.log("request", requestBody)
        const [query, values] = await insertQuery("doctors", requestBody)
        const [rows, field] = await pool.raw(query, values);
        if (rows == null) {
            return { error: true, message: "Error adding doctors" };
        }
        return { error: false, message: "doctors added successfully", id: rows };
    } catch (error) {
        console.log(error)
        logger.info(error)
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release(); // Release the connection back to the pool

    }
};

const getAdvertisement = async (advertisementID) => {
    let connection = await pool.getConnection();

    try {
        const [rows, field] = await pool.raw(getUserAndDoctors, [advertisementID])
        console.log("error", rows[0])
        if (rows.length === 0) {
            return null;
        }

        const data = await parseImages(rows)
        console.log("rows after modificatgion", rows)

        return data;
    } catch (error) {
        console.log("catch", error)

        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release(); // Release the connection back to the pool

    }
};



const getListAdvertisement = async () => {
    let connection = await pool.getConnection();

    try {
        const advertisements = await pool('doctors')
            .select('*')
            .where({ is_active: 1 });

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
        const [sql, values] = await filterQuery("property", [], { is_active: 1, ...query }, rangeCondition);
        const [rows, fields] = await pool.raw(sql, values);
        const data = await parseImages(rows);
        return data;


    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};


export const updateAdvertisement = async (advertisementID, filter) => {
    let connection = await pool.getConnection();

    try {
        console.log("Updating advertisement with ID:", advertisementID);
        console.log("Filter:", filter);

        if (!filter || typeof filter !== 'object') {
            throw new ApplicationError("Invalid filter object provided", 400);
        }
        const [sql, values] = await updateQuery("doctors", filter, { "id": advertisementID })
        console.log("sql", sql)
        const [rows, field] = await pool.raw(sql, values)

        if (!rows) {
            throw new ApplicationError("doctors not updated. No matching doctors found for the provided ID.", 404);
        }

        return { error: false, message: "doctors updated successfully", "advertisements": rows };
    } catch (error) {
        console.log("error in catch", error)

        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};

export const deactivateAdvertisement = async (advertisementID) => {
    let connection = await pool.getConnection();

    try {
        const sql = `UPDATE doctors SET is_active = 0 WHERE id = ?`
        const [rows, fields] = await pool.raw(sql, [advertisementID]);
        if (rows.affectedRows === 0) {
            throw new ApplicationError("doctors not deactivated. No matching doctors found for the provided ID.", 404);
        }
        return { error: false, message: "doctors deactivated successfully", advertisements: rows };
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
        const [advertisement] = await pool('doctors').where('id', advertisementID).select('images');
        console.log("advertisement", advertisement)
        if (!advertisement) {
            throw new ApplicationError("doctors not found.", 404);
        }
        const images = JSON.parse(advertisement.images || '[]');
        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify([...filePaths, ...images]);
        await pool('doctors').where('id', advertisementID).update({ images: photosJson });
        return { error: false, message: "Images added successfully to the doctors" };
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
        console.log("add files", files)
        const sql = `SELECT * FROM doctors WHERE id = ?`
        const [rows, fields] = await pool.raw(sql, [advertisementID])
        console.log("add rows after db req", rows)

        if (rows[0].length == null) {
            new ApplicationError("doctors not found.", 404);
        }
        if (rows[0].images == []) {
            return { error: false, message: "Images deleted successfully from the doctors" };
        }
        let images = JSON.parse(rows[0].images || []).filter(item => !files.includes(item));

        const photosJson = images ? JSON.stringify(images) : [];
        console.log("add photosJson after db req", photosJson)
        const updateSql = `UPDATE doctors SET images =? WHERE id = ?`
        await pool.raw(updateSql, [photosJson, advertisementID])

        return { error: false, message: "Images deleted successfully from the doctors" };
    } catch (error) {
        console.log("erro in catch", error)
        logger.info(error);
        new ApplicationError("Internal server error", 500);
    } finally {
        connection.release();
    }
};

export const listUserAdvertisement = async (userID) => {
    let connection = await pool.getConnection();

    try {
        const advertisements = await pool('doctors').where('user_id', userID);
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
        const [advertisement] = await pool('doctors').where('id', advertisementID).select('is_active');
        if (!advertisement) {
            throw new ApplicationError("doctors not found.", 404);
        }
        await pool('doctors').where('id', advertisementID).update({ is_active: 1 });
        return { error: false, message: "doctors activated successfully" };
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