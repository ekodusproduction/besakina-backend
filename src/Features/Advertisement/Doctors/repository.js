// repositories/advertisementRepository.js

import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import pool from "../../../Mysql/mysql.database.js";
import { deleteFiles } from "../../../Utility/deleteFiles.js";
import { filterQuery, selectJoinQuery, selectQuery, updateQuery } from "../../../Utility/sqlQuery.js";
import { getUserAndDoctors } from "./sqlQuery.js";

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

        const [rows, field] = await pool('doctors').insert(requestBody);
        if (rows == null) {
            return { error: true, message: "Error adding doctors" };
        }
        return { error: false, message: "doctors added successfully", id: rows };
    } catch (error) {
        logger.info(error)
        throw new ApplicationError("Internal server error", 500);
    }
};

const getAdvertisement = async (advertisementID) => {
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
    }
};



const getListAdvertisement = async () => {
    try {
        const advertisements = await pool('doctors')
            .select('*')
            .where({ is_active: 1 });

        if (advertisements.length === 0) {
            return null;
        }

        // Assuming 'images' field is stored as a stringified JSON
        advertisements.forEach(ad => {
            ad.images = JSON.parse(ad.images);
            ad.images = ad.images.map(photo => photo.replace(/\\/g, '/'));
        });

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
    }
};

export const deactivateAdvertisement = async (advertisementID) => {
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
    }
};

export const addImage = async (advertisementID, files) => {
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
    }
};

export const deleteImage = async (advertisementID, files) => {
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
    }
};

export const listUserAdvertisement = async (userID) => {
    try {
        const advertisements = await pool('doctors').where('user_id', userID);
        return { error: false, message: "User advertisement list", advertisements };
    } catch (error) {
        logger.info(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const activateAdvertisement = async (advertisementID) => {
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