
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
    if (typeof val === 'object') {
      // Handle range conditions
      const operator = Object.keys(val)[0]; // Get the operator, e.g., '<' or '>'
      columns.push(`${key} ${operator} ?`);
      values.push(val[operator]); // Push the value associated with the operator
    } else {
      columns.push(`${key} = ?`);
      values.push(val);
    }
  }

  let selectClause = '*';
  if (selectFields.length === 1) {
    selectClause = selectFields[0];
  } else if (selectFields.length > 1) {
    selectClause = selectFields.join(', ');
  }
  const whereClause = columns.length > 0 ? `WHERE ${columns.join(' AND ')}` : '';
  const query = `SELECT ${selectClause} FROM ${tableName} ${whereClause}`;
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

  return [query, values];
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

  return [query, values];
};

export const selectJoinQuery = async (tableName, selectFields, condition) => {
  let columns = [];
  let placeholders = [];
  const values = [];

  for (const [key, val] of Object.entries(condition)) {
    columns.push(`${tableName}.${key}`); // Specify table alias for columns in condition
    placeholders.push('?');
    values.push(val);
  }

  let selectClause = '*';
  if (selectFields.length === 1) {
    selectClause = `${tableName}.${selectFields[0]}`; // Specify table alias for select fields
  } else if (selectFields.length > 1) {
    selectClause = selectFields.map(field => `${tableName}.${field}`).join(', ');
  }

  const whereClause = columns.length > 0 ? `WHERE ${columns.map(column => `${column} = ?`).join(' AND ')}` : '';

  const query = `
    SELECT ${selectClause}, users.* 
    FROM ${tableName}
    LEFT JOIN users ON ${tableName}.user_id = users.id
    ${whereClause};
  `;

  return [query, values];
};

export const filterQuery = async (tableName, selectFields, condition, rangeCondition) => {
  let columns = [];
  let placeholders = [];
  const values = [];

  // Handle regular conditions
  for (const [key, val] of Object.entries(condition)) {
    columns.push(`${key} = ?`);
    values.push(val);
  }

  // Handle range conditions
  for (const [key, val] of Object.entries(rangeCondition)) {
    const { min, max } = val;
    if (min !== undefined && max !== undefined) {
      columns.push(`${key} BETWEEN ? AND ?`);
      values.push(min, max);
    } else if (min !== undefined) {
      columns.push(`${key} > ?`);
      values.push(min);
    } else if (max !== undefined) {
      columns.push(`${key} < ?`);
      values.push(max);
    }
  }

  let selectClause = '*';
  if (selectFields.length === 1) {
    selectClause = selectFields[0];
  } else if (selectFields.length > 1) {
    selectClause = selectFields.join(', ');
  }

  const whereClause = columns.length > 0 ? `WHERE ${columns.join(' AND ')}` : '';
  const query = `SELECT ${selectClause} FROM ${tableName} ${whereClause}`;
  return [query, values];
};
