export const getAllPosts = `(
    SELECT id, title, price, created_at, images,city, state, 'property' AS category
    FROM property
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state, 'vehicles' AS category
    FROM vehicles
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state, 'hospitality' AS category
    FROM hospitality
    
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state, 'education' AS category
    FROM education
    
)
UNION ALL
(
    SELECT id, title, price_per_visit, created_at, images,city, state, 'doctors' AS category
    FROM doctors WHERE user_id = ?
)
UNION ALL
(
    SELECT id, title, price_registration, created_at, images,city, state, 'hospitals' AS category
    FROM hospitals WHERE user_id = ?
)
ORDER BY FIELD(category, 'property', 'vehicles', 'hospitality', 'education', 'doctors', 'hospitals'), created_at DESC
LIMIT 100 OFFSET 0;`