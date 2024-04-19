import { ApplicationError } from "../../../ErrorHandler/applicationError.js"
import { sendResponse, sendError } from "../../../Utility/response.js";
import pool from "../../../Mysql/mysql.database.js";
// import path from 'path';  // Import path module
import { insertQuery, selectQuery, updateQuery, selectJoinQuery, filterQuery } from "../../../Utility/sqlQuery.js";
import { deleteFiles } from "../../../Utility/deleteFiles.js";

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
    const [query, values] = await insertQuery('property', requestBody);
    await connection.beginTransaction();
    const [rows, fields] = await connection.query(query, values);
    if (rows.affectedRows === 0) {
      await connection.rollback();
      return sendError(res, "Error adding property", 400);
    }
    await connection.commit();
    return sendResponse(res, "Property added successfully", 201, { id: rows.insertId });
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release();
  }
}

export const getAdvertisement = async (req, res, next) => {
  let connection = await pool.getConnection();
  try {
    const advertisementID = req.params.id;
    const [query, values] = await selectJoinQuery('property', ['*'], 'users', 'property.user_id = users.id', { id: advertisementID, is_active: 1 });

    const [rows] = await connection.query(query, values);

    if (rows.length === 0) {
      return sendError(res, "Property not found", 404);
    }

    rows.forEach(advertisement => {
      advertisement.images = JSON.parse(advertisement.images);
      advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
    });

    return sendResponse(res, "Property fetched successfully", 200, { advertisement: rows[0] });
  } catch (error) {
    return sendError(res, error.message || "Error fetching property", 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export const getListAdvertisement = async (req, res, next) => {
  let connection = await pool.getConnection();;
  try {
    const [query, values] = await selectQuery('property', [], { is_active: 1 });
    const [rows, fields] = await connection.query(query, values);
    if (rows.length === 0) {
      return sendResponse(res, "Advertisement fetched successfully", 200, { advertisement: [] });
    }
    rows.forEach(advertisement => {
      advertisement.images = JSON.parse(advertisement.images);
      advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
    });
    return sendResponse(res, "property fetched successfully", 200, { advertisements: rows });
  } catch (error) {
    return sendError(res, error.message || "Error fetching property", 500);
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
    const filter = `SELECT id, title, price, images, city, state FROM property WHERE is_active = ? AND price BETWEEN ? AND ?`;
    const [rows, fields] = await connection.query(filter, [true, minPrice || 0, maxPrice || 1000000000000]);

    if (rows.length === 0) {
      return sendError(res, "Property not found for given filter", 404);
    }

    rows.forEach(advertisement => {
      advertisement.images = JSON.parse(advertisement.images);
      advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
    });

    return sendResponse(res, "Property fetched successfully", 200, { advertisements: rows });
  } catch (error) {
    return sendError(res, error.message || "Error fetching property", 500);
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
    const [query, values] = await updateQuery('property', filter, { id: advertisementID });
    const [rows, fields] = await connection.query(query, values);
    if (rows.length === 0) {
      return sendError(res, "Property not updated. No matching property found for the provided ID.", 404);
    }
    return sendResponse(res, "Property updated successfully", 200, { advertisements: rows });
  } catch (error) {
    await connection.rollback();
    return sendError(res, error.message || "Error fetching property", 500);
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

    const [query, values] = await updateQuery('property', { "is_active": 0 }, { id: advertisementID, is_active: 1 });
    const [rows, fields] = await connection.query(query, values);
    if (rows.changedRows === 0) {
      return sendError(res, "Property not deleted. No matching property found for the provided ID.", 404);
    }
    return sendResponse(res, "Property deleted successfully", 200, { advertisements: rows });
  } catch (error) {
    await connection.rollback();
    return sendError(res, error.message || "Error fetching property", 500);
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
    const [query1, values1] = await selectQuery('property', ['images'], { id: advertisementID });
    const [results, columns] = await connection.query(query1, values1)
    if (results.length === 0) {
      return sendError(res, "Property not found.", 404);
    }
    const images = JSON.parse(results.images);
    // Convert file paths to a JSON array
    const photosJson = JSON.stringify([...filePaths, ...images]);
    const [query, values] = await updateQuery('property', { "images": photosJson }, { id: advertisementID, is_active: 1 });
    const [rows, fields] = await connection.query(query, values);
    if (rows.length === 0) {
      return sendError(res, "Failed to add images to the property.", 404);
    }
    return sendResponse(res, "Images added successfully to the property", 200, { advertisements: rows });
  } catch (error) {
    await deleteFiles(files)
    await connection.rollback();
    return sendError(res, error.message || "Error adding images to the property", 500);
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
    const [results] = await selectQuery('property', ['images'], { id: advertisementID });
    if (results.length === 0) {
      return sendError(res, "Property not found.", null, 404);
    }
    let images = JSON.parse(results.images).filter(item => files.indexOf(item) == false);
    const photosJson = JSON.stringify(images);
    const { query, values } = await updateQuery(category, { "images": photosJson }, { id: advertisementID, is_active: 1 });
    const [rows] = await connection.query(query, values);
    if (rows.length === 0) {
      return sendError(res, "Failed to delete images of the property.", null, 404);
    }
    await deleteFiles(images)
    return sendResponse(res, "Images deleted successfully of the property", { advertisements: rows }, 200);
  } catch (error) {
    await connection.rollback();
    return sendError(res, error.message || "Error deleting images to the property", null, 500);
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
    const [query, values] = await selectQuery('property', [], { user_id: user_id });

    const [rows, fields] = await connection.query(query, values)
    if (rows.length === 0) {
      return sendError(res, "Property not found.", 404);
    }
    rows.forEach(advertisement => {
      advertisement.images = JSON.parse(advertisement.images);
      advertisement.images = advertisement.images.map(photo => photo.replace(/\\/g, '/'));
    });
    return sendResponse(res, "User property list", 200, { advertisements: rows });
  } catch (error) {
    return sendError(res, error.message || "Error deleting images to the property", 500);
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
    const [query, values] = await updateQuery('property', { is_active: 1 }, { id: advertisementID });
    const [rows, fields] = await connection.query(query, values);
    if (rows.length === 0) {
      return sendError(res, "property not updated. No matching property found for the provided ID.", 404);
    }
    return sendResponse(res, "property updated successfully", 200, { advertisements: rows });
  } catch (error) {
    await connection.rollback();
    return sendError(res, error.message || "Error fetching property", 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}