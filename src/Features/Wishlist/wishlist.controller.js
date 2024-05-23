import pool from "../../Mysql/mysql.database";

export const addWishListItem = async function (req, res, next) {
    const user = req.user;
    const { adv_id, adv_type } = req.body; // assuming adv_id and adv_type are sent in the request body
    let connection = await pool.getConnection();
    try {
        const insertQuery = `
            INSERT INTO userswishlist (user, adv_id, adv_type)
            VALUES (?, ?, ?)
        `;
        await connection.query(insertQuery, [user, adv_id, adv_type]);

        return await sendResponse(res, 'Advertisement added to wishlist successfully', 201);
    } catch (error) {
        next(error);
    } finally {
        connection.release();
    }
}

export const removeWishListItem = async function (req, res, next) {
    const adv_id = req.params.id;
    let connection = await pool.getConnection();
    try {
        const deleteQuery = `
            DELETE FROM userswishlist
            WHERE user = ? AND adv_id = ?
        `;
        const [result] = await connection.query(deleteQuery, [req.user, adv_id]);

        if (result.affectedRows === 0) {
            return await sendResponse(res, "Advertisement not found in wishlist", 404);
        }
        return await sendResponse(res, 'Wishlist item deleted.', 201);
    } catch (error) {
        next(error);
    } finally {
        connection.release();
    }
}

export const getWishList = async function (req, res, next) {
    const user = req.params.id;
    let connection = await pool.getConnection();
    try {
        const selectQuery = `
            SELECT adv_id, adv_type
            FROM userswishlist
            WHERE user = ?
        `;
        const [wishlistItems] = await connection.query(selectQuery, [user]);

        if (wishlistItems.length === 0) {
            return await sendResponse(res, "Wishlist is empty", 200);
        }

        const subqueries = wishlistItems.map(item => {
            const tableName = item.adv_type;
            return `
                (SELECT * FROM ${tableName} WHERE id = ${item.adv_id})
            `;
        });

        const unionQuery = subqueries.join(' UNION ALL ');

        const [data] = await connection.query(unionQuery);

        return await sendResponse(res, 'Wishlist details fetched successfully', 200, data);
    } catch (error) {
        next(error);
    } finally {
        connection.release();
    }
}
