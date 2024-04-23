// repositories/advertisementRepository.js

import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import pool from "../../../Mysql/mysql.database.js";
import { getUserAndDoctors } from "./sqlQuery.js";

const addAdvertisement = async (requestBody, files) => {
    try {
        requestBody.user_id = req.user_id;
        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify(filePaths);
        requestBody.images = photosJson;

        const [rows] = await pool('vehicles').insert(requestBody);
        if (!rows.length) {
            return { error: true, message: "Error adding vehicles" };
        }
        return { error: false, message: "Vehicles added successfully", id: rows[0] };
    } catch (error) {
        logger(error)
        throw new ApplicationError("Internal server error", 500);
    }
};

const getAdvertisement = async (advertisementID) => {
    try {
        const advertisement = await pool('vehicles')
            .select(
                'vehicles.*',
                pool.raw(getUserAndDoctors))
            .leftJoin('users', 'vehicles.user_id', 'users.id')
            .where('vehicles.id', advertisementID);

        if (advertisement.length === 0) {
            return null;
        }

        // advertisement[0].user = JSON.parse(advertisement[0].user);

        advertisement.forEach(ad => {
            ad.images = JSON.parse(ad.images);
            ad.images = ad.images.map(photo => photo.replace(/\\/g, '/'));
        });

        return advertisement[0];
    } catch (error) {
        logger(error);
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

        // Assuming 'images' field is stored as a stringified JSON
        advertisements.forEach(ad => {
            ad.images = JSON.parse(ad.images);
            ad.images = ad.images.map(photo => photo.replace(/\\/g, '/'));
        });

        return advertisements;
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

const filterAdvertisement = async (query) => {
    try {
        const { sql, values } = await selectQuery("vehicles", [], query);
        const advertisements = await pool.raw(sql, values);

        return advertisements[0];
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const updateAdvertisement = async (advertisementID, filter) => {
    try {
        const [rows] = await pool('vehicles').where('id', advertisementID).update(filter);
        if (rows === 0) {
            throw new ApplicationError("Vehicles not updated. No matching vehicles found for the provided ID.", 404);
        }
        return { error: false, message: "Vehicles updated successfully", advertisements: rows };
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const deleteAdvertisement = async (advertisementID) => {
    try {
        const [rows] = await pool('vehicles').where('id', advertisementID).update({ "is_active": 0 });
        if (rows.changedRows === 0) {
            throw new ApplicationError("Vehicles not deleted. No matching vehicles found for the provided ID.", 404);
        }
        return { error: false, message: "Vehicles deleted successfully", advertisements: rows };
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const addImage = async (advertisementID, files) => {
    try {
        const [advertisement] = await pool('vehicles').where('id', advertisementID).select('images');
        if (!advertisement) {
            throw new ApplicationError("Vehicles not found.", 404);
        }
        const images = JSON.parse(advertisement.images || '[]');
        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify([...filePaths, ...images]);
        await pool('vehicles').where('id', advertisementID).update({ images: photosJson });
        return { error: false, message: "Images added successfully to the vehicles" };
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const deleteImage = async (advertisementID, files) => {
    try {
        const [advertisement] = await pool('vehicles').where('id', advertisementID).select('images');
        if (!advertisement) {
            throw new ApplicationError("vehicles not found.", 404);
        }
        let images = JSON.parse(advertisement.images || '[]').filter(item => !files.includes(item));
        const photosJson = JSON.stringify(images);
        await pool('vehicles').where('id', advertisementID).update({ images: photosJson });
        return { error: false, message: "Images deleted successfully from the vehicles" };
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const listUserAdvertisement = async (userID) => {
    try {
        const advertisements = await pool('vehicles').where('user_id', userID);
        return { error: false, message: "User advertisement list", advertisements };
    } catch (error) {
        logger(error);
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
        return { error: false, message: "Vehicles activated successfully" };
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export default {
    addAdvertisement,
    getAdvertisement,
    getListAdvertisement,
    filterAdvertisement,
    deleteAdvertisement,
    updateAdvertisement,
    addImage,
    activateAdvertisement,
    deleteImage,
    listUserAdvertisement,
};