export const getAllPosts = `(
    SELECT id, title, price, created_at, images,city, state,is_active, 'property' AS category
    FROM property WHERE user_id = ?
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state,is_active, 'vehicles' AS category
    FROM vehicles WHERE user_id = ?
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state,is_active, 'hospitality' AS category
    FROM hospitality WHERE user_id = ?
)
UNION ALL
(
    SELECT id, title, price, created_at, images,city, state,is_active, 'education' AS category
    FROM education WHERE user_id = ?
)
UNION ALL
(
    SELECT id, title, price_per_visit, created_at, images,city, state,is_active, 'doctors' AS category
    FROM doctors WHERE user_id = ?
)
UNION ALL
(
    SELECT id, title, price_registration, created_at, images,city, state,is_active ,'hospitals' AS category
    FROM hospitals WHERE user_id = ?
)
ORDER BY FIELD(category, 'property', 'vehicles', 'hospitality', 'education', 'doctors', 'hospitals'), created_at DESC
LIMIT 100 OFFSET 0;`


// export const getUserAndPlan = `SELECT u.*, p.id AS plan_id, p.type AS plan_type, p.no_of_ads AS plan_no_of_ads, p.price AS plan_price, p.validity AS plan_validity, p.verification_badge AS plan_verification_badge, p.search_priority AS plan_search_priority, p.membership_badge AS plan_membership_badge, p.contact_limit AS plan_contact_limit, p.no_images AS plan_no_images, p.business_profile AS plan_business_profile, p.images_business_profile AS plan_images_business_profile, p.offer_price AS plan_offer_price
// FROM users AS u
// LEFT JOIN plans AS p ON u.plan_id = p.id
// WHERE u.id = ?;`


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
LEFT JOIN plans AS p ON u.plan_id = p.id
WHERE u.id = ?;`