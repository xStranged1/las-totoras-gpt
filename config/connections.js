import dotenv from 'dotenv'
dotenv.config()
import pkg from 'pg';
const { Pool } = pkg;

export const POSTGRES_DB_HOST = process.env.POSTGRES_DB_HOST
export const POSTGRES_DB_USER = process.env.POSTGRES_DB_USER
export const POSTGRES_DB_PASSWORD = process.env.POSTGRES_DB_PASSWORD
export const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME
export const POSTGRES_DB_PORT = process.env.POSTGRES_DB_PORT

export const COHERE_API_KEY = process.env.COHERE_API_KEY

export const pool = new Pool({
    host: POSTGRES_DB_HOST,
    port: POSTGRES_DB_PORT,
    user: POSTGRES_DB_USER,
    password: POSTGRES_DB_PASSWORD,
    database: POSTGRES_DB_NAME,
});