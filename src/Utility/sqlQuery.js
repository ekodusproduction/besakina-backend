
export const insertQuery = async (tableName, requestBody) => {
    let columns = [];
    let placeholders = [];
    const values = [];
  
    for (const [key, val] of Object.entries(requestBody)) {
      (key, val);
      columns.push(key);
      placeholders.push('?');
      values.push(val);
    }
  
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders.map(() => '?').join(', ')})`;
  
    return [query, values];
  }
  
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
    console.log("selectClause", selectClause)
  
    const whereClause = columns.length > 0 ? `WHERE ${columns.map(column => `${column} = ?`).join(' AND ')}` : '';
    console.log("whereClause", whereClause)
  
    const query = `SELECT ${selectClause} FROM ${tableName} ${whereClause}`;
    console.log(values)
    return [query, values];
  };
  
  
  export const updateQuery = async (tableName, updateFields, condition) => {
    let updateColumns = [];
    let updatePlaceholders = [];
    const updateValues = [];
  
    for (const [key, val] of Object.entries(updateFields)) {
      updateColumns.push(`${key} = ?`);
      updateValues.push(val);
    }
  
    let whereColumns = [];
    const whereValues = [];
  
    for (const [key, val] of Object.entries(condition)) {
      whereColumns.push(`${key} = ?`);
      whereValues.push(val);
    }
  
    const updateClause = updateColumns.length > 0 ? `SET ${updateColumns.join(', ')}` : '';
    const whereClause = whereColumns.length > 0 ? `WHERE ${whereColumns.join(' AND ')}` : '';
  
    const query = `UPDATE ${tableName} ${updateClause} ${whereClause}`;
    const values = [...updateValues, ...whereValues];
  
    return [ query, values ];
  };
  
  export const deleteQuery = async (tableName, updateFields, condition) => {
    let updateColumns = [];
    let updatePlaceholders = [];
    const updateValues = [];
  
    for (const [key, val] of Object.entries(updateFields)) {
      updateColumns.push(`${key} = ?`);
      updateValues.push(val);
    }
  
    let whereColumns = [];
    const whereValues = [];
  
    for (const [key, val] of Object.entries(condition)) {
      whereColumns.push(`${key} = ?`);
      whereValues.push(val);
    }
  
    const updateClause = updateColumns.length > 0 ? `SET ${updateColumns.join(', ')}` : '';
    const whereClause = whereColumns.length > 0 ? `WHERE ${whereColumns.join(' AND ')}` : '';
  
    const query = `DELETE ${tableName} ${updateClause} ${whereClause}`;
    const values = [...updateValues, ...whereValues];
  
    return [ query, values ];
  };
  
  