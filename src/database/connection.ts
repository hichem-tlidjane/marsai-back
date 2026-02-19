import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  //   host: 'marsai-db',
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  namedPlaceholders: true,
});

export default db;
