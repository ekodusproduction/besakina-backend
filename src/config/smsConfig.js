import dotenv from 'dotenv';
dotenv.config();
import axios from "axios"

const url = 'https://www.fast2sms.com/dev/bulkV2';
const apiKey = process.env.API_KEY_FAST2SMS;
export const sendSms = async function(messageId, variables, number) {
    const data = {
      sender_id: process.env.DLT_SENDER_ID,
      message: messageId,
      variables_values: variables,
      route: 'dlt',
      numbers: number
    };
  
    try {
      const response = await axios.post(url, new URLSearchParams(data), {
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log(response.data);
      return true; // Resolve to true if the request is successful
    } catch (error) {
      console.error('Error:', error.message);
      return false; // Resolve to false if there is an error
    }
  };