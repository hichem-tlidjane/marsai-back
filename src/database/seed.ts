import type { ResultSetHeader } from 'mysql2/promise';
import type User from '../types/interfaces/user.interface.js';
import db from './connection.js';
import bcrypt from 'bcrypt';

const seed = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('❌ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env');
      process.exit(1);
    }

    const [rows] = await db.execute<User[]>(
      'SELECT * FROM user WHERE email = ?',
      [email],
    );

    if (rows.length > 0) {
      console.info('ℹ️ Admin account already exists. Skipping creation.');
      process.exit(0);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO user (email, password) VALUES (?, ?)',
      [email, passwordHash],
    );

    const newUserId = result.insertId;

    await db.query('INSERT INTO role_user (user_id, role_id) VALUES (?, ?)', [
      newUserId,
      1,
    ]);

    console.info('✅ Admin account created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

await seed();
