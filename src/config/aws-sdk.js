import dotenv from "dotenv";
dotenv.config();
import { S3, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { ApplicationError } from "../ErrorHandler/applicationError.js";

const spaceBaseUrl = process.env.SP_ORIGIN_ENDPOINT;
// Define s3Client here
export const s3Client = new S3Client({
    region: process.env.SP_REGION,
    credentials: {
        accessKeyId: process.env.SP_SPACES_KEY,
        secretAccessKey: process.env.SP_SPACES_SECRET
    },
    endpoint: spaceBaseUrl
});

const uploadToSpaces = async (file) => {
    const params = {
        Bucket: 'besakina',
        Key: `${uuidv4()}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    try {
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);
        const fileUrl = `${spaceBaseUrl}/${params.Key}`;
        return { fieldname: file.fieldname, path: fileUrl };
    } catch (error) {
        throw new ApplicationError('Failed to upload file to supabase', 400);
    }
};

export default uploadToSpaces;