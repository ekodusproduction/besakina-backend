// repositories/advertisementRepository.js

import { ApplicationError } from "../../../ErrorHandler/applicationError.js";
import { logger } from "../../../Middlewares/logger.middleware.js";
import pool from "../../../Mysql/mysql.database.js";
import { deleteFiles } from "../../../Utility/deleteFiles.js";
import { getUserAndDoctors } from "./sqlQuery.js";

const addAdvertisement = async (requestBody, files) => {
    try {
        requestBody.user_id = req.user_id;
        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify(filePaths);
        requestBody.images = photosJson;

        const [rows] = await pool('doctors').insert(requestBody);
        if (!rows.length) {
            return { error: true, message: "Error adding doctors" };
        }
        return { error: false, message: "Doctor added successfully", id: rows[0] };
    } catch (error) {
        await deleteFiles(filePaths)
        logger(error)
        throw new ApplicationError("Internal server error", 500);
    }
};

const getAdvertisement = async (advertisementID) => {
    try {
        const advertisement = await pool('doctors')
            .select(
                'doctors.*',
                pool.raw(getUserAndDoctors))
            .leftJoin('users', 'doctors.user_id', 'users.id')
            .where('doctors.id', advertisementID);

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
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

const filterAdvertisement = async (query) => {
    try {
        const { sql, values } = await selectQuery("doctors", [], query);
        const advertisements = await pool.raw(sql, values);

        return advertisements[0];
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const updateAdvertisement = async (advertisementID, filter) => {
    try {
        const [rows] = await pool('doctors').where('id', advertisementID).update(filter);
        if (rows === 0) {
            throw new ApplicationError("Doctors not updated. No matching doctors found for the provided ID.", 404);
        }
        return { error: false, message: "Doctors updated successfully", advertisements: rows };
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const deleteAdvertisement = async (advertisementID) => {
    try {
        const [rows] = await pool('doctors').where('id', advertisementID).update({ "is_active": 0 });
        if (rows.changedRows === 0) {
            throw new ApplicationError("Doctors not deleted. No matching doctors found for the provided ID.", 404);
        }
        return { error: false, message: "Doctors deleted successfully", advertisements: rows };
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const addImage = async (advertisementID, files) => {
    try {
        const [advertisement] = await pool('doctors').where('id', advertisementID).select('images');
        if (!advertisement) {
            throw new ApplicationError("Doctors not found.",404);
        }
        const images = JSON.parse(advertisement.images || '[]');
        const filePaths = files.map(file => file.path);
        const photosJson = JSON.stringify([...filePaths, ...images]);
        await pool('doctors').where('id', advertisementID).update({ images: photosJson });
        return { error: false, message: "Images added successfully to the doctors" };
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const deleteImage = async (advertisementID, files) => {
    try {
        const [advertisement] = await pool('doctors').where('id', advertisementID).select('images');
        if (!advertisement) {
            throw new ApplicationError("Doctors not found.",404);
        }
        let images = JSON.parse(advertisement.images || '[]').filter(item => !files.includes(item));
        const photosJson = JSON.stringify(images);
        await pool('doctors').where('id', advertisementID).update({ images: photosJson });
        return { error: false, message: "Images deleted successfully from the doctors" };
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const listUserAdvertisement = async (userID) => {
    try {
        const advertisements = await pool('doctors').where('user_id', userID);
        return { error: false, message: "User advertisement list", advertisements };
    } catch (error) {
        logger(error);
        throw new ApplicationError("Internal server error", 500);
    }
};

export const activateAdvertisement = async (advertisementID) => {
    try {
        const [advertisement] = await pool('doctors').where('id', advertisementID).select('is_active');
        if (!advertisement) {
            throw new ApplicationError("Doctors not found.",404);
        }
        await pool('doctors').where('id', advertisementID).update({ is_active: 1 });
        return { error: false, message: "Doctors activated successfully" };
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