import 'dotenv/config'
import mysql from 'mysql2'
import type { Pool, RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2/promise'

type QueryResult<T extends RowDataPacket[] | ResultSetHeader = RowDataPacket[]> = [T, FieldPacket[]]

const pool: Pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306
}).promise()


const query = <T extends RowDataPacket[] | ResultSetHeader = RowDataPacket[]>(
  sql: string,
  params?: unknown[]
): Promise<QueryResult<T>> => pool.query<T>(sql, params)

export default query