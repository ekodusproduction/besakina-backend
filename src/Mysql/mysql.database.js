import knex from 'knex';
import dotenv from 'dotenv';
import config from '../../knexfile.js';

// Load environment variables from .env file
dotenv.config();

// Determine the environment (development, production, etc.)
const environment = process.env.NODE_ENV || 'development';

// Ensure that the environment configuration exists in the knexfile
if (!config[environment]) {
    throw new Error(`Environment '${environment}' not found in knexfile.js`);
}

// Create a Knex instance with the appropriate configuration
const pool = knex(config[environment]);

export default pool;
