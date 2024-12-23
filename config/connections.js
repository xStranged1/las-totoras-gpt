require('dotenv').config();
const { Pool } = require('pg');

const POSTGRES_DB_HOST = process.env.POSTGRES_DB_HOST
const POSTGRES_DB_USER = process.env.POSTGRES_DB_USER
const POSTGRES_DB_PASSWORD = process.env.POSTGRES_DB_PASSWORD
const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME
const POSTGRES_DB_PORT = process.env.POSTGRES_DB_PORT

const COHERE_API_KEY = process.env.COHERE_API_KEY

const pool = new Pool({
    host: POSTGRES_DB_HOST,
    port: POSTGRES_DB_PORT,
    user: POSTGRES_DB_USER,
    password: POSTGRES_DB_PASSWORD,
    database: POSTGRES_DB_NAME,
});

module.exports = {
    POSTGRES_DB_HOST,
    POSTGRES_DB_USER,
    POSTGRES_DB_PASSWORD,
    POSTGRES_DB_NAME,
    POSTGRES_DB_PORT,
    COHERE_API_KEY,
    pool
};

