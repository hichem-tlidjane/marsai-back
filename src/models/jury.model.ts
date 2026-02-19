import type { ResultSetHeader } from 'mysql2';
import db from '../database/connection.js';
import type User from '../types/interfaces/user.interface.js';
import type Jury from '../types/interfaces/jury.interface.js';

const create = async (juries: string[][]): Promise<number> => {
  try {
    await db.beginTransaction();

    const [res] = await db.query<ResultSetHeader>(
      'INSERT INTO user (email, firstname, lastname, password) VALUES ?',
      [juries],
    );

    const emails = juries.map((j) => j[0] as string);

    const [inserted] = await db.query<User[]>(
      'SELECT id FROM user WHERE email IN (?)',
      [emails],
    );

    const juryRoleId = 2;
    const userRoleToInsert = inserted.map((user) => [user.id, juryRoleId]);

    await db.query('INSERT INTO role_user (user_id, role_id) VALUES ?', [
      userRoleToInsert,
    ]);

    await db.commit();

    return res.insertId;
  } catch (e) {
    await db.rollback();
    throw e;
  }
};

const findAll = async (): Promise<Jury[]> => {
  const sql =
    'SELECT u.id, u.email, u.firstname, u.lastname FROM user u JOIN role_user ru ON ru.user_id = u.id WHERE ru.role_id = 2';
  const [juries] = await db.query<Jury[]>(sql);
  return juries;
};

const juryModel = { create, findAll };
export default juryModel;
