import type { ResultSetHeader } from 'mysql2';
import db from '../database/connection.js';
import type Subscriber from '../types/interfaces/subsciber.interface.js';
import type { SubscriberRequest } from '../types/schemas/subscriber.schema.js';

const findAll = async (): Promise<Subscriber[]> => {
  const [rows] = await db.query('SELECT * FROM subscriber');
  return rows as Subscriber[];
};

const findByEmail = async (email: string): Promise<Subscriber | null> => {
  const [rows] = await db.query<Subscriber[]>(
    'SELECT * FROM subscriber WHERE email = ? LIMIT 1',
    [email],
  );
  return rows[0] ?? null;
};

const create = async (sub: SubscriberRequest): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO subscriber (email) VALUES (:email)',
    sub,
  );
  return result.insertId;
};

const remove = async (sub: SubscriberRequest): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    'DELETE FROM subscriber where email = :email',
    sub,
  );
  return result.affectedRows;
};

const subscriberModel = { findAll, findByEmail, create, remove };

export default subscriberModel;
