export const updateQuery = async (tableName, updateFields, condition) => {
    let updateColumns = [];
    const updateValues = [];

    // Constructing the SET clause
    for (const [key, val] of Object.entries(updateFields)) {
        updateColumns.push(`${key} = ?`);
        updateValues.push(val);
    }

    let whereColumns = [];
    const whereValues = [];

    // Constructing the WHERE clause
    for (const [key, val] of Object.entries(condition)) {
        whereColumns.push(`${key} = ?`);
        whereValues.push(val);
    }

    const setClause = updateColumns.length > 0 ? `SET ${updateColumns.join(', ')}` : ''; // Include SET clause only if there are columns to update
    const whereClause = whereColumns.length > 0 ? `WHERE ${whereColumns.join(' AND ')}` : ''; // Constructing the WHERE clause

    // Constructing the UPDATE query
    const query = `UPDATE ${tableName} ${setClause} ${whereClause}`;
    const values = [...updateValues, ...whereValues];

    return [query, values];
};
export const selectQuery = async (tableName, selectFields, condition) => {
    let columns = [];
    let placeholders = [];
    const values = [];

    for (const [key, val] of Object.entries(condition)) {
        columns.push(key);
        placeholders.push('?');
        values.push(val);
    }

    let selectClause = '*';
    if (selectFields.length === 1) {
        selectClause = selectFields[0];
    } else if (selectFields.length > 1) {
        selectClause = selectFields.join(', ');
    }

    const whereClause = columns.length > 0 ? `WHERE ${columns.map(column => `${column} = ?`).join(' AND ')}` : '';

    const query = `SELECT ${selectClause} FROM ${tableName} ${whereClause}`;

    // Return an array containing query and values
    return [query, values];
};
export const insertQuery = async (tableName, insertFields) => {
    const columns = [];
    const placeholders = [];
    const values = [];

    for (const [key, val] of Object.entries(insertFields)) {
        columns.push(key);
        placeholders.push('?');
        values.push(val);
    }

    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

    return [query, values];
};
