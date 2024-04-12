export const selectLatestAds = `(
    SELECT id, title, price, created_at, images,city, state, 'property' AS category
    FROM property
    WHERE is_active = 1
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state, 'vehicles' AS category
    FROM vehicles
    WHERE is_active = 1
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state, 'hospitality' AS category
    FROM hospitality
    WHERE is_active = 1
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state, 'education' AS category
    FROM education
    WHERE is_active = 1
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price_per_visit, created_at, images,city, state, 'doctors' AS category
    FROM doctors
    WHERE is_active = 1
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price_registration, created_at, images,city, state, 'hospitals' AS category
    FROM hospitals
    WHERE is_active = 1
    ORDER BY created_at DESC
    LIMIT 10
)
ORDER BY FIELD(category, 'property', 'vehicles', 'hospitality', 'education', 'doctors', 'hospitals'), created_at DESC
LIMIT ? OFFSET ?;
`


// export const searchAdd = `(SELECT CAST(CONCAT('{"columns": [',IFNULL(@cols,''),'], "indexes": [',IFNULL(@indexes,''),'], "tables":[',IFNULL(@tbls,''),'], "server_name": "', @@hostname, '", "version": "', VERSION(), '"}') AS CHAR) as '' FROM (SELECT (@cols:=NULL), (SELECT (0) FROM information_schema.columns cols WHERE table_schema LIKE IFNULL(NULL, '%') and table_schema = DATABASE() AND (0x00) IN (@cols:=CONCAT_WS(',', @cols, CONCAT('{"schema":"',cols.table_schema,'","table":"',cols.table_name,'","name":"', replace(cols.column_name,'"', '\\"'), '","type":"', cols.column_type, '","nullable":', IF(cols.IS_NULLABLE = 'YES', 'true', 'false'), ',"collation":"', IFNULL(cols.COLLATION_NAME, ''), '"}')))) ) cols, (SELECT (@indexes:=NULL), (SELECT (0) FROM information_schema.statistics indexes WHERE table_schema LIKE IFNULL(NULL, '%') and table_schema = DATABASE() AND (0x00) IN (@indexes:=CONCAT_WS(',', @indexes, CONCAT('{"schema":"',indexes.table_schema,'","table":"',indexes.table_name,'","name":"', indexes.index_name, '","size":"', 0, '","column":"', indexes.column_name, '","index_type":"', LOWER(indexes.index_type), '","cardinality":', indexes.cardinality,',"direction":"', (CASE WHEN indexes.collation = 'D' THEN 'desc' ELSE 'asc' END), '","unique":', IF(indexes.non_unique = 1, 'false', 'true'), '}')))) ) indexes, (SELECT (@tbls:=NULL), (SELECT (0) FROM information_schema.tables tbls WHERE table_schema LIKE IFNULL(NULL, '%') and table_schema = DATABASE() AND (0x00) IN (@tbls:=CONCAT_WS(',', @tbls, CONCAT('{', '"schema":"', `TABLE_SCHEMA`, '",', '"table":"', `TABLE_NAME`, '",', '"rows":', IFNULL(`TABLE_ROWS`, 0), ', "type":"', IFNULL(`TABLE_TYPE`, ''), '",', '"engine":"', IFNULL(`ENGINE`, ''), '",', '"collation":"', IFNULL(`TABLE_COLLATION`, ''), '"}')))) tbls) x);`       

export const searchAdd = `(
    SELECT
      property.id,
      property.title,
      property.price,
      property.created_at,
      property.images,
      property.city,
      property.state,
      'property' AS category
    FROM
      (
        SELECT
          id
        FROM
          property
        WHERE
          property.is_active = 1
        ORDER BY
          property.created_at DESC
        LIMIT
          10
      ) AS property_inner_subselect
      INNER JOIN property ON property_inner_subselect.id = property.id
    WHERE
      1 = 1
      AND MATCH (
        property.title,
        property.type,
        property.street,
        property.city,
        property.house_no,
        property.pincode
      ) AGAINST (? IN BOOLEAN MODE)
    LIMIT
      10
  )
  UNION ALL
  (
    SELECT
      vehicles.id,
      vehicles.title,
      vehicles.price,
      vehicles.created_at,
      vehicles.images,
      vehicles.city,
      vehicles.state,
      'vehicles' AS category
    FROM
      (
        SELECT
          id
        FROM
          vehicles
        WHERE
          vehicles.is_active = 1
        ORDER BY
          vehicles.created_at DESC
        LIMIT
          10
      ) AS vehicles_inner_subselect
      INNER JOIN vehicles ON vehicles_inner_subselect.id = vehicles.id
    WHERE
      1 = 1
      AND MATCH (
        vehicles.title,
        vehicles.brand,
        vehicles.type,
        vehicles.description,
        vehicles.street,
        vehicles.city,
        vehicles.locality,
        vehicles.pincode
      ) AGAINST (? IN BOOLEAN MODE)
    LIMIT
      10
  )
  UNION ALL
  (
    SELECT
      hospitality.id,
      hospitality.title,
      hospitality.price,
      hospitality.created_at,
      hospitality.images,
      hospitality.city,
      hospitality.state,
      'hospitality' AS category
    FROM
      (
        SELECT
          id
        FROM
          hospitality
        WHERE
          hospitality.is_active = 1
        ORDER BY
          hospitality.created_at DESC
        LIMIT
          10
      ) AS hospitality_inner_subselect
      INNER JOIN hospitality ON hospitality_inner_subselect.id = hospitality.id
    WHERE
      1 = 1
      AND MATCH (
        hospitality.title,
        hospitality.name,
        hospitality.type,
        hospitality.description,
        hospitality.street,
        hospitality.city,
        hospitality.locality,
        hospitality.pincode
      ) AGAINST (? IN BOOLEAN MODE)
    LIMIT
      10
  )
  UNION ALL
  (
    SELECT
      education.id,
      education.title,
      education.price,
      education.created_at,
      education.images,
      education.city,
      education.state,
      'education' AS category
    FROM
      (
        SELECT
          id
        FROM
          education
        WHERE
          education.is_active = 1
        ORDER BY
          education.created_at DESC
        LIMIT
          10
      ) AS education_inner_subselect
      INNER JOIN education ON education_inner_subselect.id = education.id
    WHERE
      1 = 1
      AND MATCH (
        education.title,
        education.domain,
        education.institution_name,
        education.description,
        education.street,
        education.city,
        education.locality,
        education.pincode
      ) AGAINST (? IN BOOLEAN MODE)
    LIMIT
      10
  )
  UNION ALL
  (
    SELECT
      doctors.id,
      doctors.title,
      doctors.price_per_visit,
      doctors.created_at,
      doctors.images,
      doctors.city,
      doctors.state,
      'doctors' AS category
    FROM
      (
        SELECT
          id
        FROM
          doctors
        WHERE
          doctors.is_active = 1
        ORDER BY
          doctors.created_at DESC
        LIMIT
          10
      ) AS doctors_inner_subselect
      INNER JOIN doctors ON doctors_inner_subselect.id = doctors.id
    WHERE
      1 = 1
      AND MATCH (
        doctors.title,
        doctors.expertise,
        doctors.description,
        doctors.street,
        doctors.city,
        doctors.locality,
        doctors.pincode
      ) AGAINST (? IN BOOLEAN MODE)
    LIMIT
      10
  )
  UNION ALL
  (
    SELECT
      hospitals.id,
      hospitals.title,
      hospitals.price_registration,
      hospitals.created_at,
      hospitals.images,
      hospitals.city,
      hospitals.state,
      'hospitals' AS category
    FROM
      (
        SELECT
          id
        FROM
          hospitals
        WHERE
          hospitals.is_active = 1
        ORDER BY
          hospitals.created_at DESC
        LIMIT
          10
      ) AS hospitals_inner_subselect
      INNER JOIN hospitals ON hospitals_inner_subselect.id = hospitals.id
    WHERE
      1 = 1
      AND MATCH (
        hospitals.title,
        hospitals.name,
        hospitals.type,
        hospitals.description,
        hospitals.street,
        hospitals.city,
        hospitals.locality,
        hospitals.pincode
      ) AGAINST (? IN BOOLEAN MODE)
    LIMIT
      10
  )
  ORDER BY
    FIELD(
      category,
      'property',
      'vehicles',
      'hospitality',
      'education',
      'doctors',
      'hospitals'
    ),
    created_at DESC 
  `