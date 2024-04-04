export const selectLatestAds = `(
    SELECT id, title, price, created_at, images, 'property' AS category
    FROM property
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price, created_at, images, 'vehicles' AS category
    FROM vehicles
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price, created_at, images, 'hospitality' AS category
    FROM hospitality
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price, created_at, images, 'education' AS category
    FROM education
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, price_per_visit, created_at, images, 'doctors' AS category
    FROM doctors
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title,price_per_visit, created_at, images, 'hospitals' AS category
    FROM hospitals
    ORDER BY created_at DESC
    LIMIT 10
)
ORDER BY FIELD(category, 'property', 'vehicles', 'hospitality', 'education', 'doctors', 'hospitals'), created_at DESC
LIMIT 10;
`