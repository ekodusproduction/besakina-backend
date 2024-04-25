import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);


export const addVehicles = async (token, baseUrl) => {
    const propertyDataArray = [{
        type: 'car',
        brand: 'BMW',
        registration_year: '2018',
        kilometer_driven: '25000',
        title: 'BMW X5 for sale',
        description: 'This BMW X5 is in excellent condition.',
        price: '5000000',
        category: 'SUV',
        street: 'Main Street',
        locality: 'Borbari',
        city: 'Guwahati',
        state: 'Assam',
        pincode: '781001',
        images: ['red.jpg'],
        video: '',
        map_location: '',
        latitude: 26.1445,
        longitude: 91.7362,

        fuel: 'petrol',
        transmission: 'automatic',
        model: "thar",
        variant: 'plus',
        second_hand: 1,
    },
    {
        type: 'car',
        brand: 'tata',
        registration_year: '2019',
        kilometer_driven: '10000',
        title: 'Tata nexon for sale',
        description: 'Well-maintained nexon available for sale.',
        price: '50000',
        category: 'car',
        street: 'Park Road',
        locality: 'Pan Bazaar',
        city: 'Guwahati',
        state: 'Assam',
        pincode: '781005',
        images: ['nexon.jpg'],
        video: '',
        map_location: '',
        latitude: 26.1765,
        longitude: 91.7578,

        fuel: 'petrol',
        transmission: 'automatic',
        model: "thar",
        variant: 'plus',
        second_hand: 1,
    },
    {
        type: 'car',
        brand: 'maruti',
        registration_year: '2019',
        kilometer_driven: '10000',
        title: 'Maruti suzuki swift for sale',
        description: 'Well-maintained swift available for sale.',
        price: '400000',
        category: 'Scooter',
        street: 'Park Road',
        locality: 'Pan Bazaar',
        city: 'Guwahati',
        state: 'Assam',
        pincode: '781005',
        images: ['red.jpg'],
        video: '',
        map_location: '',
        latitude: 26.1765,
        longitude: 91.7578,

        fuel: 'petrol',
        transmission: 'automatic',
        model: "thar",
        variant: 'plus',
        second_hand: 1,
    },
    {
        type: 'car',
        brand: 'mahindra',
        registration_year: '2019',
        kilometer_driven: '10000',
        title: 'Thar for sale',
        description: 'Well-maintained thar for sale.',
        price: '1000000',
        category: 'car',
        street: 'Park Road',
        locality: 'Pan Bazaar',
        city: 'Guwahati',
        state: 'Assam',

        fuel: 'petrol',
        transmission: 'automatic',
        model: "thar",
        variant: 'plus', 
        second_hand: 1,

        pincode: '781005',
        images: ['thar.jpg'],
        video: '',
        map_location: '',
        latitude: 26.1765,
        longitude: 91.7578,

    }
    ];

    try {
        for (const propertyData of propertyDataArray) {
            const data = new FormData();
            for (const [key, value] of Object.entries(propertyData)) {
                if (key === 'images') {
                    if (Array.isArray(value)) {
                        for (const image of value) {
                            data.append('images', fs.createReadStream(path.resolve("seeders", "images", 'vehicles', image)));
                        }
                    }
                } else {
                    data.append(key, value.toString());
                }
            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://${baseUrl}/api/vehicles/add`,
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
