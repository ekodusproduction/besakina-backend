export const selectLatestAds = `(
    SELECT id, title, price, created_at, images,city, state, 'property' AS category
    FROM property
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state, 'vehicles' AS category
    FROM vehicles
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state, 'hospitality' AS category
    FROM hospitality
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state, 'education' AS category
    FROM education
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price_per_visit, created_at, images,city, state, 'doctors' AS category
    FROM doctors
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price_registration, created_at, images,city, state, 'hospitals' AS category
    FROM hospitals
    ORDER BY created_at DESC
    LIMIT 10
)
ORDER BY FIELD(category, 'property', 'vehicles', 'hospitality', 'education', 'doctors', 'hospitals'), created_at DESC
LIMIT ? OFFSET ?;
`


export const searchAdd = `SELECT id, 'doctors' AS type, title, description,images FROM doctors WHERE MATCH(title, expertise, description,street, city, locality, pincode) AGAINST (? IN BOOLEAN MODE)
UNION ALL
SELECT id, 'education' AS type, title, description, images FROM education WHERE MATCH(title, domain, institution_name, description,street, city, locality, pincode) AGAINST (? IN BOOLEAN MODE)
UNION ALL
SELECT id, 'hospitality' AS type, title, description ,images FROM hospitality WHERE MATCH(title, name, type, description,street, city, locality, pincode) AGAINST (? IN BOOLEAN MODE)
UNION ALL
SELECT id, 'hospitals' AS type, title, description, images FROM hospitals WHERE MATCH(title, name, type, description,street, city, locality, pincode) AGAINST (? IN BOOLEAN MODE)
UNION ALL
SELECT id, 'property' AS type, title, description, images FROM property WHERE MATCH(title, type, street, city, house_no, pincode) AGAINST (? IN BOOLEAN MODE)
UNION ALL  
SELECT id, 'vehicles' AS type, title, description, images FROM vehicles WHERE MATCH(title, brand, type, description,street, city, locality, pincode) AGAINST (? IN BOOLEAN MODE)
`       