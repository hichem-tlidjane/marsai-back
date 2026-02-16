import db from '../database/connection.js';
import type { ResultSetHeader } from 'mysql2';
import type Booking from '../types/interfaces/booking.interface.js';

const create = async (
  eventId: number,
  participantId: number,
): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO booking (event_id, participant_id) VALUES (?, ?)',
    [eventId, participantId],
  );
  return result.insertId;
};

const findByParticipantAndEvent = async (
  participantId: number,
  eventId: number,
): Promise<Booking | null> => {
  const [rows] = await db.query<Booking[]>(
    'SELECT * FROM booking WHERE participant_id = ? AND event_id = ?',
    [participantId, eventId],
  );
  return rows[0] ?? null;
};

const bookingModel = { create, findByParticipantAndEvent };

export default bookingModel;
