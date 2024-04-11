import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);


export const addHospitality = async (token, baseUrl) => {
    const propertyDataArray = [
        {
            type: 'Hotel',
            name: 'Luxury Hotel',
            title: 'Luxury Hotel in Guwahati',
            description: 'Experience luxury at our hotel with top-notch amenities and services.',
            price: '5000',
            category: '5-star',
            street: 'Main Street',
            locality: 'Borbari',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            images: ['images.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1445,
            longitude: 91.7362,
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            type: 'Restaurant',
            name: 'Fine Dining Restaurant',
            title: 'Fine Dining Restaurant in Guwahati',
            description: 'Enjoy exquisite culinary delights at our fine dining restaurant.',
            price: '2000',
            category: 'Fine Dining',
            street: 'Park Road',
            locality: 'Pan Bazaar',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781005',
            images: ['dnmc.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1765,
            longitude: 91.7578,
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },    {
            type: 'Hotel',
            name: 'Luxury Hotel',
            title: 'Luxury Hotel in Guwahati',
            description: 'Experience luxury at our hotel with top-notch amenities and services.',
            price: '5000',
            category: '5-star',
            street: 'Main Street',
            locality: 'Borbari',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            images: ['assamlodge.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1445,
            longitude: 91.7362,
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            type: 'Restaurant',
            name: 'Fine Dining Restaurant',
            title: 'Fine Dining Restaurant in Guwahati',
            description: 'Enjoy exquisite culinary delights at our fine dining restaurant.',
            price: '2000',
            category: 'Fine Dining',
            street: 'Park Road',
            locality: 'Pan Bazaar',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781005',
            images: ['3qe.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1765,
            longitude: 91.7578,
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
                            data.append('images', fs.createReadStream(path.resolve("seeders", "images", 'hospitality', image)));
                        }
                    }
                } else {
                    data.append(key, value.toString());
                }
            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://${baseUrl}/api/hospitality/add`,
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
