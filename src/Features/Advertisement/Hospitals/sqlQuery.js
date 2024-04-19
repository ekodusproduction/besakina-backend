export const getUserAndHospitals = `
SELECT u.*, 
JSON_OBJECT(
     'id', p.id,
     'fullname', p.fullname,
     'mobile', p.mobile,
     'alternate_mobile', p.alternate_mobile,
     'email', p.email,
     'doc_number', p.doc_number,
     'doc_type', p.doc_type,
     'profile_pic', p.profile_pic,
     'state', p.state,
     'city', p.city,
     'locality', p.locality,
     'pincode', p.pincode,
     'about', p.about
) AS user
FROM hospitals AS u
LEFT JOIN users AS p ON u.user_id = p.id
WHERE u.id = ?;`;