import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
}).promise();

const query = async (sql, params) => pool.query(sql, params)

query('SELECT 1')
  .then(() => console.log('DB OK:', process.env.MYSQL_HOST))
  .catch(e => console.error('DB FAIL:', e.message));

export default query