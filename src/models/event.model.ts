import db from '../database/connection.js';
import type { CreateEventRequest } from '../types/schemas/create-event-request.schema.js';
import type { UpdateEventRequest } from '../types/schemas/update-event-request.schema.js';
import type { Event } from '../types/interfaces/event.interface.js';
import type { ResultSetHeader } from 'mysql2';
import { toSnakeCase } from '../helpers/string-utils.js';

const create = async (event: CreateEventRequest): Promise<void> => {
  await db.execute(
    `INSERT INTO event (title, description, status, date, published_at, duration, location)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      event.title,
      event.description,
      'upcoming',
      event.date,
      event.publishedAt,
      event.duration,
      event.location,
    ],
  );
  return;
};

const findAll = async (): Promise<Event[]> => {
  const [rows] = await db.query('SELECT * FROM event');
  return rows as Event[];
};

const update = async (
  id: number,
  event: UpdateEventRequest,
): Promise<number> => {
  const fields: string[] = [];
  const values: (string | number | Date)[] = [];

  for (const [key, value] of Object.entries(event)) {
    fields.push(`${toSnakeCase(key)} = ?`);
    values.push(value as string | number | Date);
  }

  if (fields.length === 0) {
    return 0; // No fields to update
  }

  values.push(id); // Add id for the WHERE clause

  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE event SET ${fields.join(', ')} WHERE id = ?`,
    values,
  );

  return result.affectedRows;
};

const remove = async (id: number): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    'DELETE FROM event WHERE id = ?',
    [id],
  );
  return result.affectedRows;
};

const findById = async (id: number): Promise<Event | null> => {
  const [rows] = await db.query<Event[]>('SELECT * FROM event WHERE id = ?', [
    id,
  ]);
  return rows[0] ?? null;
};

const eventModel = { create, findAll, update, remove, findById };

export default eventModel;
