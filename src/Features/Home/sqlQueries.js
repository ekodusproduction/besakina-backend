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

// export const searchAdd = `(
//     SELECT
//     property.id,
//     property.title,
//     property.price,
//     property.type,
//     property.created_at,
//     property.images,
//     property.city,
//     property.state,
//     'property' AS category
// FROM
//     property
// WHERE
//     MATCH (title, type, city, street, state, landmark, category, price, pincode) AGAINST (?)
// )
// UNION ALL
// (
// SELECT
//     vehicles.id,
//     vehicles.title,
//     vehicles.price,
//     vehicles.type,
//     vehicles.images,
//     vehicles.city,
//     vehicles.state,
//     vehicles.created_at,
//     'vehicles' AS category
// FROM
//     vehicles
// WHERE
//     MATCH (title, brand, type, city, kilometer_driven, registration_year, locality, category, price, pincode, model, variant, transmission) AGAINST (?)
// )
// UNION ALL
// (
// SELECT
//     hospitality.id,
//     hospitality.title,
//     hospitality.price,
//     hospitality.name,
//     hospitality.images,
//     hospitality.city,
//     hospitality.state,
//      hospitality.created_at,
//     'hospitality' AS category
// FROM
//     hospitality
// WHERE
//     MATCH (title, name, type, description, city, state, locality, category, pincode) AGAINST (?)
// )
// UNION ALL
// (
// SELECT
//     hospitals.id,
//     hospitals.title,
//     hospitals.price_registration AS price,
//     hospitals.name,
//     hospitals.images,
//     hospitals.city,
//     hospitals.state,
//      hospitals.created_at,
//     'hospitals' AS category
// FROM
//     hospitals
// WHERE
//     MATCH (title, name, type, description, street, city, state, locality, category, pincode) AGAINST (?)
// )
// UNION ALL
// (
// SELECT
//     education.id,
//     education.title,
//     education.price,
//     education.institution_name,
//     education.images,
//     education.city,
//     education.state,
//     education.created_at,
//     'education' AS category
// FROM
//     education
// WHERE
//     MATCH (title, domain, institution_name, type, description, city, locality, pincode) AGAINST (?)
// )
// UNION ALL
// (
// SELECT
//     doctors.id,
//     doctors.title,
//     doctors.price_per_visit AS price,
//     doctors.name,
//     doctors.images,
//     doctors.city,
//     doctors.state,
//     doctors.created_at,
//     'doctors' AS category
// FROM
//     doctors
// WHERE
//     MATCH (title, expertise, description, street, city, locality, pincode) AGAINST (?)
// );
// `



export const searchAdd = `(
    SELECT
    property.id,
    property.title,
    property.price,
    property.type,
    property.created_at,
    property.images,
    property.city,
    property.state,
    'property' AS category
FROM
    property
WHERE
    MATCH (title, type, city, street, state, landmark, category, price, pincode) AGAINST (? IN BOOLEAN MODE)
)
UNION ALL
(
SELECT
    vehicles.id,
    vehicles.title,
    vehicles.price,
    vehicles.type,
    vehicles.images,
    vehicles.city,
    vehicles.state,
    vehicles.created_at,
    'vehicles' AS category
FROM
    vehicles
WHERE
    MATCH (title, brand, type, city, kilometer_driven, registration_year, locality, category, price, pincode, model, variant, transmission) AGAINST (? IN BOOLEAN MODE)
)
UNION ALL
(
SELECT
    hospitality.id,
    hospitality.title,
    hospitality.price,
    hospitality.name,
    hospitality.images,
    hospitality.city,
    hospitality.state,
     hospitality.created_at,
    'hospitality' AS category
FROM
    hospitality
WHERE
    MATCH (title, name, type, description, city, state, locality, category, pincode) AGAINST (? IN BOOLEAN MODE)
)
UNION ALL
(
SELECT
    hospitals.id,
    hospitals.title,
    hospitals.price_registration AS price,
    hospitals.name,
    hospitals.images,
    hospitals.city,
    hospitals.state,
     hospitals.created_at,
    'hospitals' AS category
FROM
    hospitals
WHERE
    MATCH (title, name, type, description, street, city, state, locality, category, pincode) AGAINST (? IN BOOLEAN MODE)
)
UNION ALL
(
SELECT
    education.id,
    education.title,
    education.price,
    education.institution_name,
    education.images,
    education.city,
    education.state,
     education.created_at,
    'education' AS category
FROM
    education
WHERE
    MATCH (title, domain, institution_name, type, description, city, locality, pincode) AGAINST (? IN BOOLEAN MODE)
)
UNION ALL
(
SELECT
    doctors.id,
    doctors.title,
    doctors.price_per_visit AS price,
    doctors.name,
    doctors.images,
    doctors.city,
    doctors.state,
     doctors.created_at,
    'doctors' AS category
FROM
    doctors
WHERE
    MATCH (title, expertise, description, street, city, locality, pincode) AGAINST (? IN BOOLEAN MODE)
);
`