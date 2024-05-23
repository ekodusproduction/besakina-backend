export const getAllPosts = `(
    SELECT id, title, price, created_at, images,city, state,is_active, 'property' AS category
    FROM property WHERE user = ?
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state,is_active, 'vehicles' AS category
    FROM vehicles WHERE user = ?
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state,is_active, 'hospitality' AS category
    FROM hospitality WHERE user = ?
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state,is_active, 'education' AS category
    FROM education WHERE user = ?
)
UNION ALL
(
    SELECT id, title, price_per_visit, created_at, images,city, state,is_active, 'doctors' AS category
    FROM doctors WHERE user = ?
)
UNION ALL
(
    SELECT id, title, price_registration, created_at, images,city, state,is_active ,'hospitals' AS category
    FROM hospitals WHERE user = ?
)
ORDER BY FIELD(category, 'property', 'vehicles', 'hospitality', 'education', 'doctors', 'hospitals'), created_at DESC
LIMIT 100 OFFSET 0;`

export const getUserAndPlan = `SELECT u.*, 
JSON_OBJECT(
     'id', p.id,
     'type', p.type,
     'no_of_ads', p.no_of_ads,
     'price', p.price,
     'validity', p.validity,
     'verification_badge', p.verification_badge,
     'search_priority', p.search_priority,
     'membership_badge', p.membership_badge,
     'contact_limit', p.contact_limit,
     'no_images', p.no_images,
     'business_profile', p.business_profile,
     'images_business_profile', p.images_business_profile,
     'offer_price', p.offer_price
) AS plan
FROM users AS u
LEFT JOIN userselectedplans AS usp ON u.id = usp.user
LEFT JOIN plans AS p ON usp.plan_id = p.id
WHERE u.id = ?;`;


export const countUserPosts = `SELECT SUM(total_count) AS total_posts
FROM (
    SELECT COUNT(*) AS total_count
    FROM property 
    WHERE user = ?
    UNION ALL
    SELECT COUNT(*)
    FROM vehicles 
    WHERE user = ?
    UNION ALL
    SELECT COUNT(*)
    FROM hospitality 
    WHERE user = ?
    UNION ALL
    SELECT COUNT(*)
    FROM education 
    WHERE user = ?
    UNION ALL
    SELECT COUNT(*)
    FROM doctors 
    WHERE user = ?
    UNION ALL
    SELECT COUNT(*)
    FROM hospitals 
    WHERE user = ?
) AS post_counts;
`

export const fetchPlansAndTotalAdds = `
SELECT 
    usp.*, 
    p.no_of_ads,
    (
        SELECT SUM(total_count) AS total_posts
        FROM (
            SELECT COUNT(*) AS total_count
            FROM property 
            WHERE user = ? 
            UNION ALL
            SELECT COUNT(*)
            FROM vehicles 
            WHERE user = ?
            UNION ALL
            SELECT COUNT(*)
            FROM hospitality 
            WHERE user = ?
            UNION ALL
            SELECT COUNT(*)
            FROM education 
            WHERE user = ?
            UNION ALL
            SELECT COUNT(*)
            FROM doctors 
            WHERE user = ?
            UNION ALL
            SELECT COUNT(*)
            FROM hospitals 
            WHERE user = ?
        ) AS post_counts
    ) AS total_posts
FROM 
    userselectedplans AS usp
INNER JOIN 
    plans AS p 
ON 
    usp.plan_id = p.id
WHERE 
    usp.user = ?`


export const getUserMobileById = `SELECT * FROM users WHERE id = ?`;