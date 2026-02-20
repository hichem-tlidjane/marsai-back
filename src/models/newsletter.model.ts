import type { ResultSetHeader } from 'mysql2';
import db from '../database/connection.js';
import type { NewsletterRequest } from '../types/schemas/newsletter.schema.js';
import type Newsletter from '../types/interfaces/newsletter.interface.js';

const create = async (letter: NewsletterRequest): Promise<number> => {
  const sql = `
    INSERT INTO newsletter 
    (
        object,
        content,
        send_at
    ) 
    VALUES 
    (
        :object,
        :content,
        :sendAt
    )
  `;

  const [result] = await db.execute<ResultSetHeader>(sql, letter);

  return result.insertId;
};

const findAllToSend = async (): Promise<Newsletter[]> => {
  const now = new Date();
  const [rows] = await db.query(
    'SELECT id, object, content, created_at AS createdAt, send_at AS sendAt, sent FROM newsletter WHERE send_at <= NOW() AND sent = 0 OR send_at IS NULL AND sent = 0',
    [now],
  );
  return rows as Newsletter[];
};

const setIsSent = async (id: number): Promise<void> => {
  await db.query('UPDATE newsletter SET sent = true WHERE id = ?', [id]);
};

const findAll = async (): Promise<Newsletter[]> => {
  const [rows] = await db.query(
    'SELECT id, object, content, created_at AS createdAt, send_at AS sendAt, sent FROM newsletter',
  );
  return rows as Newsletter[];
};

const newsletterModel = {
  create,
  findAllToSend,
  setIsSent,
  findAll,
};

export default newsletterModel;
