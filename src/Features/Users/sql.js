export const getAllPosts = `SELECT id, 'doctors' AS type, title, description, images FROM doctors WHERE user_id = ?
UNION ALL
SELECT id, 'education' AS type, title, description, images FROM education WHERE user_id = ?
UNION ALL
SELECT id, 'hospitality' AS type, title, description, images FROM hospitality WHERE user_id = ?
UNION ALL
SELECT id, 'hospitals' AS type, title, description, images FROM hospitals WHERE user_id = ?
UNION ALL
SELECT id, 'property' AS type, title, description, images FROM property WHERE user_id = ?
UNION ALL
SELECT id, 'vehicles' AS type, title, description, images FROM vehicles WHERE user_id = ?
`