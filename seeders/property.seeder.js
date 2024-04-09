import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);


export const addProperties = async () => {
    const propertyDataArray = [
        {
            title: 'Luxury Villa in borbari',
            type: 'Buy',
            bedrooms: 5,
            bathrooms: 4,
            furnishing: 'Furnished',
            construction_status: 'Ready to move',
            listed_by: 'Owner',
            super_builtup_area: 5000,
            carpet_area: 4000,
            maintenance: 2000,
            total_rooms: 8,
            floor_no: 2,
            total_floors: 3,
            car_parking: 2,
            price: '9000',
            category: '1BHK',
            description: 'This is a luxurious villa with all modern amenities.',
            street: 'Main Street',
            house_no: '123',
            landmark: 'Near Park',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            images: ['fwe.jpg',
            'fwefw.jpg',
            'Gacbj.jpg'
            ],
            video: "",
            map_location: "",
            latitude: 26.1445,
            longitude: 91.7362,
            seen_by: 0,
            verified: true,
        },
        {
            title: 'Luxury Villa',
            type: 'Buy',
            bedrooms: 5,
            bathrooms: 4,
            furnishing: 'Furnished',
            construction_status: 'Ready to move',
            listed_by: 'Owner',
            super_builtup_area: 5000,
            carpet_area: 4000,
            maintenance: 2000,
            total_rooms: 8,
            floor_no: 2,
            total_floors: 3,
            car_parking: 2,
            price: '12000',
            category: '2BHK',
            description: 'This is a luxurious villa with all modern amenities.',
            street: 'Main Street',
            house_no: '123',
            landmark: 'Near Park',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            images: ['fwe.jpg'
            ],
            video: "",
            map_location: "",
            latitude: 26.1445,
            longitude: 91.7362,
            seen_by: 0,
            verified: true,
        },
        {
            title: 'Luxury Villa for rent',
            type: 'rent',
            bedrooms: 2,
            bathrooms: 2,
            furnishing: 'Furnished',
            construction_status: 'completed',
            listed_by: 'Owner',
            super_builtup_area: 5000,
            carpet_area: 4000,
            maintenance: 2000,
            total_rooms: 8,
            floor_no: 2,
            total_floors: 3,
            car_parking: 2,
            price: '10000',
            category: 'Villa',
            description: 'This is a luxurious villa with all modern amenities.',
            street: 'Main Street',
            house_no: '123',
            landmark: 'Near Park',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            images: ['fwe.jpg',
            'fwefw.jpg',
            'Gacbj.jpg'
            ],
            video: "",
            map_location: "",
            latitude: 26.1445,
            longitude: 91.7362,
            seen_by: 100,
            verified: true,
        },
        {
            title: 'Luxury Villa for rent',
            type: 'rent',
            bedrooms: 2,
            bathrooms: 2,
            furnishing: 'Furnished',
            construction_status: 'completed',
            listed_by: 'Owner',
            super_builtup_area: 5000,
            carpet_area: 4000,
            maintenance: 2000,
            total_rooms: 8,
            floor_no: 2,
            total_floors: 3,
            car_parking: 2,
            price: '11000',
            category: 'Villa',
            description: 'This is a luxurious villa with all modern amenities.',
            street: 'Main Street',
            house_no: '123',
            landmark: 'Near Park',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            images: [
               'vf.jpg',
            ],
            video: "",
            map_location: "",
            latitude: 26.1445,
            longitude: 91.7362,
            seen_by: 100,
            verified: true
        },
        {
            title: 'Luxury Villa for rent',
            type: 'rent',
            bedrooms: 1,
            bathrooms: 1,
            furnishing: 'Furnished',
            construction_status: 'completed',
            listed_by: 'Owner',
            super_builtup_area: 5000,
            carpet_area: 4000,
            maintenance: 2000,
            total_rooms: 8,
            floor_no: 2,
            total_floors: 3,
            car_parking: 2,
            price: '11000',
            category: '1BHK',
            description: 'This is a luxurious villa with all modern amenities.',
            street: 'Main Street',
            house_no: '123',
            landmark: 'Near Park',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            images: [
                'fwe.jpg',
            ],
            video: "",
            map_location: "",
            latitude: 26.1445,
            longitude: 91.7362,
            seen_by: 100,
            verified: true
        },
    ];

    try {
        for (const propertyData of propertyDataArray) {
            const data = new FormData();
            for (const [key, value] of Object.entries(propertyData)) {
                if (key === 'images') {
                    if (Array.isArray(value)) {
                        for (const image of value) {
                            data.append('images', fs.createReadStream(path.resolve("seeders", "images",'property',image)));
                        }
                    } 
                } else {
                    data.append(key, value.toString());
                }
            }
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBsYW5faWQiOm51bGwsImlhdCI6MTcxMjY0NzQ1NiwiZXhwIjoxNzEyNzMzODU2fQ.6nOnuhz58kCcoRdY4EOE4ShwyKS2QSkowmqwbiGvUoM'

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://139.59.92.146/api/property/add',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...data.getHeaders()
                },
                data: data
            };

            const response = await axios.request(config);
            console.log(JSON.stringify(response.data));
        }
    } catch (error) {
        console.log(error);
    }
}
// Example property data array
