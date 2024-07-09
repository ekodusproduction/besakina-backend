import { createClient } from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';
dotenv.config();

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD;

const redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`,
    password: redisPassword,
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000)
    }
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('end', () => {
    console.log('Redis client disconnected');
});

redisClient.on('reconnecting', (delay, attempt) => {
    console.log(`Reconnecting to Redis: attempt ${attempt}, delay ${delay}`);
});

// Promisify Redis commands
const asyncSet = promisify(redisClient.set).bind(redisClient);
const asyncGet = promisify(redisClient.get).bind(redisClient);
const asyncSadd = promisify(redisClient.sAdd).bind(redisClient);
const asyncSrem = promisify(redisClient.sRem).bind(redisClient);
const asyncSmembers = promisify(redisClient.sMembers).bind(redisClient);
const asyncSismember = promisify(redisClient.sIsMember).bind(redisClient);

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Redis client connected successfully');
    } catch (err) {
        console.error('Redis connection error', err);
    }
}

export { asyncGet, asyncSadd, asyncSet, asyncSismember, asyncSmembers, asyncSrem, connectRedis };
