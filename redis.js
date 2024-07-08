import redis from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';
dotenv.config();

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD;

const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    password: redisPassword
});

// Promisify Redis commands
const asyncSet = promisify(redisClient.set).bind(redisClient);
const asyncGet = promisify(redisClient.get).bind(redisClient);
// Promisify Redis commands
const asyncSadd = promisify(redisClient.sAdd).bind(redisClient);
const asyncSrem = promisify(redisClient.sRem).bind(redisClient);
const asyncSmembers = promisify(redisClient.sMembers).bind(redisClient);
const asyncSismember = promisify(redisClient.sIsMember).bind(redisClient);

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('ready', () => {
    console.log('Redis client connected');
});

export { asyncGet, asyncSadd, asyncSet, asyncSismember, asyncSmembers, asyncSrem };
