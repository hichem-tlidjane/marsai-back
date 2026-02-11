import db from '../database/connection.js';
import type Subscriber from '../types/interfaces/subsciber.interface.js';

const findAll = async (): Promise<Subscriber[]> => {
  const [rows] = await db.query('SELECT * FROM subscriber');
  return rows as Subscriber[];
};

const subscriberModel = { findAll };

export default subscriberModel;
