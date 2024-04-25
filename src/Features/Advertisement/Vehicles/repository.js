// repositories/advertisementRepository.js

import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import pool from "../../../Mysql/mysql.database.js";
import { deleteFiles } from "../../../Utility/deleteFiles.js";
import { filterQuery, insertQuery, selectJoinQuery, selectQuery, updateQuery } from "../../../Utility/sqlQuery.js";
import { getUserAndVehicles } from "./sqlQuery.js";

const parseImages = async (advertisements) => {
    return advertisements.map(advertisement => {
        advertisement.images = JSON.parse(advertisement.images);
        advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
        return advertisement;
    });
};

const addAdvertisement = async (requestBody, files) => {
    try {

        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify(filePaths);
        requestBody.images = photosJson;
        console.log("request", requestBody)
        const [query, values] = await insertQuery("vehicles", requestBody)
        const [rows, field] = await pool.raw(query, values);
        if (rows == null) {
            return { error: true, message: "Error adding vehicles" };
        }
        return { error: false, message: "vehicles added successfully", id: rows };
    } catch (error) {
        console.log(error)
        logger.info(error)
        throw new ApplicationError("Internal server error", 500);
    }
};

const getAdvertisement = async (advertisementID) => {
    try {
        const [rows, field] = await pool.raw(getUserAndVehicles, [advertisementID])
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
    }
};



const getListAdvertisement = async () => {
    try {
        const advertisements = await pool('vehicles')
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
    }
};

const filterAdvertisement = async (query) => {
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
    }
};


export const updateAdvertisement = async (advertisementID, filter) => {
    try {
        console.log("Updating advertisement with ID:", advertisementID);
        console.log("Filter:", filter);

        if (!filter || typeof filter !== 'object') {
            throw new ApplicationError("Invalid filter object provided", 400);
        }
        const [sql, values] = await updateQuery("vehicles", filter, { "id": advertisementID })
        console.log("sql", sql)
        const [rows, field] = await pool.raw(sql, values)

        if (!rows) {
            throw new ApplicationError("vehicles not updated. No matching vehicles found for the provided ID.", 404);
        }

        return { error: false, message: "vehicles updated successfully", "advertisements": rows };
    } catch (error) {
        console.log("error in catch", error)

        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const deactivateAdvertisement = async (advertisementID) => {
    try {
        const sql = `UPDATE vehicles SET is_active = 0 WHERE id = ?`
        const [rows, fields] = await pool.raw(sql, [advertisementID]);
        if (rows.affectedRows === 0) {
            throw new ApplicationError("vehicles not deactivated. No matching vehicles found for the provided ID.", 404);
        }
        return { error: false, message: "vehicles deactivated successfully", advertisements: rows };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const addImage = async (advertisementID, files) => {
    try {
        const [advertisement] = await pool('vehicles').where('id', advertisementID).select('images');
        console.log("advertisement", advertisement)
        if (!advertisement) {
            throw new ApplicationError("vehicles not found.", 404);
        }
        const images = JSON.parse(advertisement.images || '[]');
        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify([...filePaths, ...images]);
        await pool('vehicles').where('id', advertisementID).update({ images: photosJson });
        return { error: false, message: "Images added successfully to the vehicles" };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const deleteImage = async (advertisementID, files) => {
    try {
        console.log("add files", files)
        const sql = `SELECT * FROM vehicles WHERE id = ?`
        const [rows, fields] = await pool.raw(sql, [advertisementID])
        console.log("add rows after db req", rows)

        if (rows[0].length == null) {
            new ApplicationError("vehicles not found.", 404);
        }
        if (rows[0].images == []) {
            return { error: false, message: "Images deleted successfully from the vehicles" };
        }
        let images = JSON.parse(rows[0].images || []).filter(item => !files.includes(item));

        const photosJson = images ? JSON.stringify(images) : [];
        console.log("add photosJson after db req", photosJson)
        const updateSql = `UPDATE vehicles SET images =? WHERE id = ?`
        await pool.raw(updateSql, [photosJson, advertisementID])

        return { error: false, message: "Images deleted successfully from the vehicles" };
    } catch (error) {
        console.log("erro in catch", error)
        logger.info(error);
        new ApplicationError("Internal server error", 500);
    }
};

export const listUserAdvertisement = async (userID) => {
    try {
        const advertisements = await pool('vehicles').where('user_id', userID);
        return { error: false, message: "User advertisement list", advertisements };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const activateAdvertisement = async (advertisementID) => {
    try {
        const [advertisement] = await pool('vehicles').where('id', advertisementID).select('is_active');
        if (!advertisement) {
            throw new ApplicationError("vehicles not found.", 404);
        }
        await pool('vehicles').where('id', advertisementID).update({ is_active: 1 });
        return { error: false, message: "vehicles activated successfully" };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
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