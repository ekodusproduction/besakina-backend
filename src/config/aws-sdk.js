import { S3 } from "@aws-sdk/client-s3";

const s3Client = new S3({
    forcePathStyle: false,
    endpoint: process.env.DG_ORIGIN_ENDPOINT,
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET
    }
});
const uploadToSpaces = async (file) => {
    const params = {
        Bucket: 'besakina',
        Key: `${uuidv4()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location;
    } catch (error) {
        throw new ApplicationError('Failed to upload file to DigitalOcean Spaces');
    }
};

export { s3Client, uploadToSpaces };
