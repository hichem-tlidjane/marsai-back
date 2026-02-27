import db from '../database/connection.js';
import type User from '../types/interfaces/user.interface.js';

const findByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.execute<User[]>(
    'SELECT u.*, JSON_ARRAYAGG(r.name) as roles FROM user u JOIN role_user ru ON ru.user_id = u.id JOIN role r ON r.id = ru.role_id WHERE u.email = ? GROUP BY u.id LIMIT 1',
    [email],
  );
  return rows[0] ?? null;
};

const findById = async (id: number): Promise<User | null> => {
  const [rows] = await db.execute<User[]>(
    'SELECT u.id, u.email, JSON_ARRAYAGG(r.name) as roles FROM user u JOIN role_user ru ON ru.user_id = u.id JOIN role r ON r.id = ru.role_id WHERE u.id = ? GROUP BY u.id LIMIT 1',
    [id],
  );
  return rows[0] ?? null;
};

const userModel = {
  findByEmail,
  findById,
};

export default userModel;
