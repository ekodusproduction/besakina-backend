import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const knexConfig = {
    client: 'mysql',
    connection: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE || 'besakina',
    },
    pool: {
        min: 0,
        max: 100,
    },
};

const pool = knex(knexConfig);

export default pool;
