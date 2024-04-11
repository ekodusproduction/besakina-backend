import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);


export const addHospitals = async (token, baseUrl) => {
    const propertyDataArray = [
        {
            type: 'Hospital',
            name: 'City Hospital',
            title: 'City Hospital in Guwahati',
            description: 'City Hospital provides comprehensive medical care with state-of-the-art facilities.',
            price_registration: 1000,
            price_per_visit: 500,
            images: ['32r.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1445,
            longitude: 91.7362,
            category: 'General',
            street: 'Main Street',
            locality: 'Borbari',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            type: 'Hospital',
            name: 'Green Hospital',
            title: 'Green Hospital in Guwahati',
            description: 'Green Hospital offers specialized medical services with a focus on sustainability.',
            price_registration: 1500,
            price_per_visit: 600,
            images: ['32r32.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1765,
            longitude: 91.7578,
            category: 'Specialty',
            street: 'Park Road',
            locality: 'Pan Bazaar',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781005',
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            type: 'Hospital',
            name: 'City Hospital',
            title: 'City Hospital in Guwahati',
            description: 'City Hospital provides comprehensive medical care with state-of-the-art facilities.',
            price_registration: 1000,
            price_per_visit: 500,
            images: ['x12.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1445,
            longitude: 91.7362,
            category: 'General',
            street: 'Main Street',
            locality: 'Borbari',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            type: 'Hospital',
            name: 'Green Hospital',
            title: 'Green Hospital in Guwahati',
            description: 'Green Hospital offers specialized medical services with a focus on sustainability.',
            price_registration: 1500,
            price_per_visit: 600,
            images: ['f321.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1765,
            longitude: 91.7578,
            category: 'Specialty',
            street: 'Park Road',
            locality: 'Pan Bazaar',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781005',
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
    ];

    try {
        for (const propertyData of propertyDataArray) {
            const data = new FormData();
            for (const [key, value] of Object.entries(propertyData)) {
                if (key === 'images') {
                    if (Array.isArray(value)) {
                        for (const image of value) {
                            data.append('images', fs.createReadStream(path.resolve("seeders", "images", 'hospitals', image)));
                        }
                    }
                } else {
                    data.append(key, value.toString());
                }
            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://${baseUrl}/api/hospitals/add`,
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
