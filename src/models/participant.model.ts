import db from '../database/connection.js';
import type { ResultSetHeader } from 'mysql2';
import type Participant from '../types/interfaces/participant.interface.js';
import type { CreateParticipantRequest } from '../types/schemas/create-participant-request-schema.js';

const create = async (
  participant: CreateParticipantRequest,
): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO participant (firstname, lastname, email) VALUES (?, ?, ?)',
    [participant.firstname, participant.lastname, participant.email],
  );
  return result.insertId;
};

const findByEmail = async (email: string): Promise<Participant | null> => {
  const [rows] = await db.query<Participant[]>(
    'SELECT * FROM participant WHERE email = ?',
    [email],
  );
  return rows[0] ?? null;
};

const findById = async (id: number): Promise<Participant | null> => {
  const [rows] = await db.query<Participant[]>(
    'SELECT * FROM participant WHERE id = ?',
    [id],
  );
  return rows[0] ?? null;
};

const participantModel = { create, findByEmail, findById };

export default participantModel;
