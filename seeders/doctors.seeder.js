import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);


export const addDoctors = async (token) => {
    const propertyDataArray = [
        {
            expertise: 'Cardiologist',
            name: 'Dr. John Doe',
            total_experience: 10,
            title: 'Consultant Cardiologist',
            description: 'Dr. John Doe is a highly skilled cardiologist with expertise in various cardiac conditions.',
            price_per_visit: '2000',
            street: 'Main Street',
            locality: 'Borbari',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            images: ['fwe.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1445,
            longitude: 91.7362,
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            expertise: 'Pediatrician',
            name: 'Dr. Jane Smith',
            total_experience: 8,
            title: 'Pediatric Consultant',
            description: 'Dr. Jane Smith specializes in pediatric care and has extensive experience in managing children\'s health.',
            price_per_visit: '1500',
            street: 'Park Road',
            locality: 'Pan Bazaar',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781005',
            images: ['diabetics.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1765,
            longitude: 91.7578,
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            expertise: 'Neurologist',
            name: 'Dr. Mala das',
            total_experience: 8,
            title: 'Neurologist Surgeon',
            description: 'Dr. Mala das specializes in pediatric care and has extensive experience in managing children\'s health.',
            price_per_visit: '1500',
            street: 'Park Road',
            locality: 'Pan Bazaar',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781005',
            images: ['gastroentrologists.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1765,
            longitude: 91.7578,
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            expertise: 'General physician',
            name: 'Dr. Drake gramorey',
            total_experience: 8,
            title: 'General physician in your town',
            description: 'Dr. Drake gramorey specializes in pediatric care and has extensive experience in managing children\'s health.',
            price_per_visit: '1500',
            street: 'Park Road',
            locality: 'Pan Bazaar',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781005',
            images: ['general_physycian.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1765,
            longitude: 91.7578,
            verified: 1,
            is_active: 1,
            seen_by: 0,
        }
    ];

    try {
        for (const propertyData of propertyDataArray) {
            const data = new FormData();
            for (const [key, value] of Object.entries(propertyData)) {
                if (key === 'images') {
                    if (Array.isArray(value)) {
                        for (const image of value) {
                            data.append('images', fs.createReadStream(path.resolve("seeders", "images", 'doctors', image)));
                        }
                    }
                } else {
                    data.append(key, value.toString());
                }
            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://139.59.92.146/api/doctors/add',
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
