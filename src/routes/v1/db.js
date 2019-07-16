
import 'dotenv/config';
import { Pool } from 'pg';
import config from '../../config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
    console.log('connected to the db');
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1)
});

export default pool
