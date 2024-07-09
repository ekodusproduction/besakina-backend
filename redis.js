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
    password: redisPassword,
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            console.error('The server refused the connection');
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            console.error('Retry time exhausted');
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            console.error('Too many attempts to reconnect');
            return undefined;
        }
        // Reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});

// Promisify Redis commands
const asyncSet = promisify(redisClient.set).bind(redisClient);
const asyncGet = promisify(redisClient.get).bind(redisClient);
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

redisClient.on('end', () => {
    console.log('Redis client disconnected');
});

redisClient.on('reconnecting', (delay, attempt) => {
    console.log(`Reconnecting to Redis: attempt ${attempt}, delay ${delay}`);
});

export { asyncGet, asyncSadd, asyncSet, asyncSismember, asyncSmembers, asyncSrem };
