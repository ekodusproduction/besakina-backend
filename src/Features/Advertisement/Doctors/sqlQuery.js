export const getUserAndDoctors = `
SELECT u.*, 
JSON_OBJECT(
     'id', p.id,
     'fullname', p.fullname,
     'email', p.email,
     'doc_number', p.doc_number,
     'doc_type', p.doc_type,
     'profile_pic', p.profile_pic,
     'state', p.state,
     'city', p.city,
     'locality', p.locality,
     'pincode', p.pincode,
     'about', p.about,
     'created_at', p.created_at
) AS user
FROM doctors AS u
LEFT JOIN users AS p ON u.user_id = p.id
WHERE u.id = ?;`;