import redis from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
});

const asyncSet = promisify(redisClient.set).bind(redisClient);
const asyncGet = promisify(redisClient.get).bind(redisClient);

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});


export { redisClient, asyncSet, asyncGet };
