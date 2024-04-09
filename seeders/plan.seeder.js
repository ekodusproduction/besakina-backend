import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const addPlans = async () => {
    const plansData = [
        {
            contact_limit: '200',
            images: fs.createReadStream(path.join(__dirname, 'images', 'mobile app-silver.png')),
            search_priority: '1',
            verification_badge: '1',
            validity: '30',
            price: '999',
            no_of_ads: '1',
            type: 'Silver',
            images_business_profile: '0',
            business_profile: '0'
        },
        {
            contact_limit: '1000000',
            images: fs.createReadStream(path.join(__dirname, 'images', 'mobile app-platinum.png')),
            search_priority: '3',
            verification_badge: '1',
            validity: '30',
            price: '4999',
            no_of_ads: '7',
            type: 'Platinum',
            images_business_profile: '25',
            business_profile: '1'
        },
        {
            contact_limit: '600',
            images: fs.createReadStream(path.join(__dirname, 'images', 'mobile app-gold.png')),
            search_priority: '2',
            verification_badge: '1',
            validity: '30',
            price: '2999',
            no_of_ads: '3',
            type: 'Gold',
            images_business_profile: '15',
            business_profile: '1'
        }
    ];

    try {
        for (const data of plansData) {
            let formData = new FormData();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://139.59.92.146/api/plans',
                headers: {
                    'Authorization': 'Bearer YOUR_TOKEN_HERE',
                    ...formData.getHeaders()
                },
                data: formData
            };

            const response = await axios.request(config);
            console.log(JSON.stringify(response.data));
        }
    } catch (error) {
        console.error("Error in adding plans:", error);
    }
}

// Call the addPlans function
addPlans();
