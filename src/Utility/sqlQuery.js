
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

export const selectJoinQuery = async (primaryTableName, selectFields, joinTableName, joinCondition, condition) => {
  let primaryColumns = [];
  let joinColumns = [];
  let placeholders = [];
  const values = [];

  // Construct columns and values for the WHERE clause based on the primary table
  for (const [key, val] of Object.entries(condition)) {
    primaryColumns.push(`${primaryTableName}.${key}`);
    placeholders.push('?');
    values.push(val);
  }

  // Construct columns and values for the join condition based on the join table
  for (const [key, val] of Object.entries(joinCondition)) {
    joinColumns.push(`${joinTableName}.${key}`);
    placeholders.push('?');
    values.push(val);
  }

  // Construct the SELECT clause
  let selectClause = '';
  if (selectFields.length > 0) {
    selectClause = selectFields.map(field => `${primaryTableName}.${field}`).join(', ');
  } else {
    selectClause = `${primaryTableName}.*`;
  }

  // Construct the JOIN clause
  const joinClause = `LEFT JOIN ${joinTableName} ON ${joinCondition}`;

  // Construct the WHERE clause
  const whereClause = primaryColumns.length > 0 ? `WHERE ${primaryColumns.map(column => `${column} = ?`).join(' AND ')}` : '';

  // Construct the complete query
  const query = `
      SELECT ${selectClause}
      FROM ${primaryTableName}
      ${joinClause}
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
