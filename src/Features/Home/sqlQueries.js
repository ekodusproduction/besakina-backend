export const selectLatestAds = `(
    SELECT id, title, description, created_at, 'property' AS category
    FROM property
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, description, created_at, 'vehicles' AS category
    FROM vehicles
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, description, created_at, 'hospitality' AS category
    FROM hospitality
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, description, created_at, 'education' AS category
    FROM education
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, description, created_at, 'doctors' AS category
    FROM doctors
    ORDER BY created_at DESC
    LIMIT 10
)
UNION ALL
(
    SELECT id, title, description, created_at, 'hospitals' AS category
    FROM hospitals
    ORDER BY created_at DESC
    LIMIT 10
)
ORDER BY FIELD(category, 'property', 'vehicles', 'hospitality', 'education', 'doctors', 'hospitals'), created_at DESC
LIMIT 10;
`