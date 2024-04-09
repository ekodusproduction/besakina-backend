import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);


export const addEducation = async () => {
    const propertyDataArray = [
        {
            type: 'Graduate',
            domain: 'Computer Science',
            institution_name: 'ABC University',
            course_duration: '4 years',
            title: 'Bachelor of Science in Computer Science',
            description: 'A comprehensive program covering various aspects of computer science.',
            price: '100000',
            street: 'Main Street',
            locality: 'Borbari',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            images: ['chanakya.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1445,
            longitude: 91.7362,
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            type: 'Diploma',
            domain: 'Mechanical Engineering',
            institution_name: 'XYZ Institute',
            course_duration: '2 years',
            title: 'Diploma in Mechanical Engineering',
            description: 'A hands-on program focusing on practical skills in mechanical engineering.',
            price: '50000',
            street: 'Park Road',
            locality: 'Pan Bazaar',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781005',
            images: ['dew.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1765,
            longitude: 91.7578,
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            type: 'Graduate',
            domain: 'Computer Science',
            institution_name: 'ABC University',
            course_duration: '4 years',
            title: 'Bachelor of Science in Computer Science',
            description: 'A comprehensive program covering various aspects of computer science.',
            price: '100000',
            street: 'Main Street',
            locality: 'Borbari',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781001',
            images: ['gcc.jpg'],
            video: '',
            map_location: '',
            latitude: 26.1445,
            longitude: 91.7362,
            verified: 1,
            is_active: 1,
            seen_by: 0,
        },
        {
            type: 'Diploma',
            domain: 'Mechanical Engineering',
            institution_name: 'XYZ Institute',
            course_duration: '2 years',
            title: 'Diploma in Mechanical Engineering',
            description: 'A hands-on program focusing on practical skills in mechanical engineering.',
            price: '50000',
            street: 'Park Road',
            locality: 'Pan Bazaar',
            city: 'Guwahati',
            state: 'Assam',
            pincode: '781005',
            images: ['green_school.jpg'],
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
                            data.append('images', fs.createReadStream(path.resolve("seeders", "images", 'education', image)));
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
                url: 'http://139.59.92.146/api/education/add',
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
