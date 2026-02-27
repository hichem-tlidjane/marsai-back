import db from '../database/connection.js';
import type { CreateEventRequest } from '../types/schemas/create-event-request.schema.js';
import type { UpdateEventRequest } from '../types/schemas/update-event-request.schema.js';
import type { Event } from '../types/interfaces/event.interface.js';
import type { ResultSetHeader } from 'mysql2';
import { toSnakeCase } from '../helpers/string-utils.js';

const create = async (event: CreateEventRequest): Promise<void> => {
  await db.execute(
    `INSERT INTO event (title, slug, description, status, date, published_at, duration, location, is_bookable, capacity, lang)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event.title,
      event.slug,
      event.description,
      'draft',
      event.date,
      event.publishedAt,
      event.duration,
      event.location,
      event.isBookable,
      event.capacity,
      event.lang,
    ],
  );
  return;
};

const findAll = async (lang = 'FR'): Promise<Event[]> => {
  const [rows] = await db.query('SELECT * FROM event WHERE lang = ?', [lang]);
  return rows as Event[];
};

const update = async (
  id: number,
  event: UpdateEventRequest,
): Promise<number> => {
  const fields: string[] = [];
  const values: (string | number | Date | boolean)[] = [];

  for (const [key, value] of Object.entries(event)) {
    fields.push(`${toSnakeCase(key)} = ?`);
    values.push(value as string | number | Date | boolean);
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

const findBySlug = async (slug: string): Promise<Event | null> => {
  const [rows] = await db.query<Event[]>('SELECT * FROM event WHERE slug = ?', [
    slug,
  ]);
  return rows[0] ?? null;
};

const findRelatedIds = async (id: number): Promise<number[]> => {
  const event = await findById(id);
  if (!event) return [];
  const [rows] = await db.query<Event[]>(
    'SELECT id FROM event WHERE date = ? AND location = ?',
    [event.date, event.location],
  );
  return rows.map((row) => row.id);
};

const eventModel = {
  create,
  findAll,
  update,
  remove,
  findById,
  findBySlug,
  findRelatedIds,
};

export default eventModel;
