import db from '../database/connection.js';
import type { CreateEventRequest } from '../types/schemas/create-event-request.schema.js';
import type { UpdateEventRequest } from '../types/schemas/update-event-request.schema.js';
import type { Event } from '../types/interfaces/event.interface.js';
import type { ResultSetHeader } from 'mysql2';

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
    fields.push(`${key} = ?`);
    values.push(value as string | number | Date);
  }

  if (fields.length === 0) {
    return 0; // No fields to update
  }

  values.push(id); // Add id for the WHERE clause

  const [result] = await db.execute(
    `UPDATE event SET ${fields.join(', ')} WHERE id = ?`,
    values,
  );

  return (result as ResultSetHeader).affectedRows;
};

const remove = async (id: number): Promise<number> => {
  const [result] = await db.execute('DELETE FROM event WHERE id = ?', [id]);
  return (result as ResultSetHeader).affectedRows;
};

const eventModel = { create, findAll, update, remove };

export default eventModel;
