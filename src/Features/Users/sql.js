export const getAllPosts = `(SELECT id, 'doctors' AS type, title, description, name AS doctor_name, city, state, images 
FROM doctors 
WHERE user_id = ?)

UNION ALL
(
SELECT id, 'education' AS type, title, description, institution_name , city, state, images 
FROM education 
WHERE user_id = ?
)
UNION ALL
(
SELECT id, 'hospitality' AS type, title, description,name AS hospitality_name, city, state, images 
FROM hospitality 
WHERE user_id = ?
)
UNION ALL
(
SELECT id, 'hospitals' AS type, title, description, name AS hospital_name, city, state, images 
FROM hospitals 
WHERE user_id = ?
)
UNION ALL
(
SELECT id, 'property' AS type, title, description, price, city, state, images 
FROM property 
WHERE user_id = ?
)
UNION ALL
(
SELECT id, 'vehicles' AS type, title, description, price, city, state, images 
FROM vehicles 
WHERE user_id = ?
);`