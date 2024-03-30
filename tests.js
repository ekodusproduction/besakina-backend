const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
let data = new FormData();
data.append('images', fs.createReadStream('/D:/electricity.jpg'));
data.append('images', fs.createReadStream('/D:/386a2100-08bf-4514-8a22-a511721b5f61.jpg'));
data.append('images', fs.createReadStream('/D:/burj khalifa.jpg'));
data.append('images', fs.createReadStream('/D:/electricity.jpg'));
data.append('title', 'Burj Khalifa');
data.append('type', 'rent');
data.append('bedrooms', '5');
data.append('furnishing', 'unfurnished');
data.append('construction_status', 'completed');
data.append('listed_by', 'owner');
data.append('super_builtup_area', '1000');
data.append('carpet_area', '800');
data.append('maintenance', '1500');
data.append('total_rooms', '9');
data.append('floor_no', '8');
data.append('car_parking', '2');
data.append('price', '25000');
data.append('category', 'VILLA');
data.append('map_location', 'https://maps.app.goo.gl/eZ4ykMq3w2byz6Vp9');
data.append('latitude', '26');
data.append('longitude', '91');
data.append('plan_id', '1');
data.append('bathrooms', '2');
data.append('street', 'Vip road');
data.append('address', 'house no 14, borbari');
data.append('city', 'Guwahati');
data.append('state', 'Assam');
data.append('pincode', '780220');

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://139.59.92.146/api/property',
  headers: { 
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInBsYW5faWQiOm51bGwsImlhdCI6MTcxMTcwMzA5NCwiZXhwIjoxNzExNzg5NDk0fQ.L4nbQbpG0nDk5be0XM1JddEWvorUrzMn3mlxZpIMjW0', 
    ...data.getHeaders()
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
