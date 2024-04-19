import { ApplicationError } from "../../../ErrorHandler/applicationError.js"
import { sendResponse, sendError } from "../../../Utility/response.js";
import pool from "../../../Mysql/mysql.database.js";
// import path from 'path';  // Import path module
import { insertQuery, selectJoinQuery, selectQuery, updateQuery } from "../../../Utility/sqlQuery.js";
import { deleteFiles } from "../../../Utility/deleteFiles.js";
import { getUserAndHospitals } from "../Hospitals/sqlQuery.js";

export const addAdvertisement = async (req, res, next) => {
  let requestBody = req.body;
  requestBody.user_id = req.user_id;
  // requestBody.user_id = req.plan_id;
  // const category = req.params.category;
  const files = req.files;
  const filePaths = files.map(file => file.path);
  const photosJson = JSON.stringify(filePaths);
  requestBody.images = photosJson;
  const connection = await pool.getConnection();
  try {
    const [query, values] = await insertQuery('education', requestBody);
    await connection.beginTransaction();
    const [rows, fields] = await connection.query(query, values);
    if (rows.affectedRows === 0) {
      await connection.rollback();
      return sendError(res, "Error adding advertisement", 400);
    }
    await connection.commit();
    return sendResponse(res, "Education added successfully", 201, { id: rows.insertId });
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release();
  }
}

export const getAdvertisement = async (req, res, next) => {
  let connection = await pool.getConnection();;
  try {
    const advertisementID = req.params.id;
    const [rows] = await connection.query(getUserAndHospitals, [advertisementID]);

    if (rows.length === 0) {
      return sendError(res, "Education not found", 404);
    }
    rows[0].user = JSON.parse(rows[0].user);
    rows.forEach(advertisement => {
      advertisement.images = JSON.parse(advertisement.images);
      advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
    });
    return sendResponse(res, "Advertisement fetched successfully", 200, { advertisement: rows[0] });
  } catch (error) {
    return sendError(res, error.message || "Error fetching advertisement", 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export const getListAdvertisement = async (req, res, next) => {
  let connection = await pool.getConnection();;
  try {
    const [query, values] = await selectQuery('education', [], { is_active: 1 });
    const [rows, fields] = await connection.query(query, values);
    if (rows.length === 0) {
      return sendError(res, "Advertisements not found", 404);
    }
    rows.forEach(advertisement => {
      advertisement.images = JSON.parse(advertisement.images);
      advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
    });
    return sendResponse(res, "Advertisements fetched successfully", 200, { advertisements: rows });
  } catch (error) {
    return sendError(res, error.message || "Error fetching advertisements", 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export const filterAdvertisement = async (req, res, next) => {
  let connection = await pool.getConnection();

  try {
    let { minPrice, maxPrice } = req.query;
    minPrice = parseInt(minPrice)
    maxPrice = parseInt(maxPrice)
    const filter = `SELECT id, title, price, images, city, state FROM education WHERE is_active = ? AND price BETWEEN ? AND ?`;
    const [rows, fields] = await connection.query(filter, [true, minPrice || 0, maxPrice || 1000000000000]);

    if (rows.length === 0) {
      return sendError(res, "Education not found for given filter", 404);
    }

    rows.forEach(advertisement => {
      advertisement.images = JSON.parse(advertisement.images);
      advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
    });

    return sendResponse(res, "Education fetched successfully", 200, { advertisements: rows });
  } catch (error) {
    return sendError(res, error.message || "Error fetching education", 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const updateAdvertisement = async (req, res, next) => {
  // Implement your logic for updateAdvertisement
  let connection = await pool.getConnection();

  try {
    const advertisementID = req.params.id;
    const filter = req.body;
    // Validate and sanitize the filter object if needed
    const [query, values] = await updateQuery('education', filter, { id: advertisementID });
    const [rows, fields] = await connection.query(query, values);
    if (rows.length === 0) {
      return sendError(res, "Advertisement not updated. No matching advertisement found for the provided ID.", 404);
    }
    return sendResponse(res, "Advertisements updated successfully", 200, { advertisements: rows });
  } catch (error) {
    await connection.rollback();
    return sendError(res, error.message || "Error fetching advertisements", 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
export const deleteAdvertisement = async (req, res, next) => {
  // Implement your logic for deleteAdvertisement
  const advertisementID = req.params.id;
  let connection = await pool.getConnection();;
  try {

    const [query, values] = await updateQuery('education', { "is_active": 0 }, { id: advertisementID, is_active: 1 });
    const [rows, fields] = await connection.query(query, values);
    if (rows.changedRows === 0) {
      return sendError(res, "Advertisement not deleted. No matching advertisement found for the provided ID.", 404);
    }
    return sendResponse(res, "Advertisements deleted successfully", 200, { advertisements: rows });
  } catch (error) {
    await connection.rollback();
    return sendError(res, error.message || "Error fetching advertisements", 500);
  } finally {
    connection.release();

  }
}

export const addImage = async (req, res, next) => {
  const advertisementID = req.params.id;
  let files = req.files;
  if (!Array.isArray(files)) {
    files = [files];
  }
  const filePaths = files.map(file => file.path);
  const connection = await pool.getConnection();
  try {
    const [query1, values1] = await selectQuery('education', ['images'], { id: advertisementID });
    const [results, columns] = await connection.query(query1, values1)
    if (results.length === 0) {
      return sendError(res, "Advertisement not found.", 404);
    }
    const images = JSON.parse(results.images);
    // Convert file paths to a JSON array
    const photosJson = JSON.stringify([...filePaths, ...images]);
    const [query, values] = await updateQuery('education', { "images": photosJson }, { id: advertisementID, is_active: 1 });
    const [rows, fields] = await connection.query(query, values);
    if (rows.length === 0) {
      return sendError(res, "Failed to add images to the advertisement.", 404);
    }
    return sendResponse(res, "Images added successfully to the advertisement", 200, { advertisements: rows });
  } catch (error) {
    await deleteFiles(files)
    await connection.rollback();
    return sendError(res, error.message || "Error adding images to the advertisement", 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// soft delete
export const deleteImage = async (req, res, next) => {
  const advertisementID = req.params.id;
  let files = req.body;
  const connection = await pool.getConnection();
  try {
    const [results] = await selectQuery('education', ['images'], { id: advertisementID });
    if (results.length === 0) {
      return sendError(res, "Advertisement not found.", null, 404);
    }
    let images = JSON.parse(results.images).filter(item => files.indexOf(item) == false);
    const photosJson = JSON.stringify(images);
    const { query, values } = await updateQuery(category, { "images": photosJson }, { id: advertisementID, is_active: 1 });
    const [rows] = await connection.query(query, values);
    if (rows.length === 0) {
      return sendError(res, "Failed to delete images of the advertisement.", null, 404);
    }
    await deleteFiles(images)
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
  const user_id = req.user_id;
  let connection = await pool.getConnection();
  try {
    const [query, values] = await selectQuery('education', [], { user_id: user_id });

    const [rows, fields] = await connection.query(query, values)
    if (rows.length === 0) {
      return sendError(res, "Advertisement not found.", 404);
    }
    rows.forEach(advertisement => {
      advertisement.images = JSON.parse(advertisement.images);
      advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
    });
    return sendResponse(res, "User advertisment list", 200, { advertisements: rows });
  } catch (error) {
    return sendError(res, error.message || "Error deleting images to the advertisement", 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// activate deleted adv again
export const activateAdvertisement = async (req, res, next) => {
  let connection = await pool.getConnection();

  try {
    const advertisementID = req.params.id;
    // Validate and sanitize the filter object if needed
    const [query, values] = await updateQuery('education', { is_active: 1 }, { id: advertisementID });
    const [rows, fields] = await connection.query(query, values);
    if (rows.length === 0) {
      return sendError(res, "Advertisement not updated. No matching advertisement found for the provided ID.", 404);
    }
    return sendResponse(res, "Advertisements updated successfully", 200, { advertisements: rows });
  } catch (error) {
    await connection.rollback();
    return sendError(res, error.message || "Error fetching advertisements", 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}