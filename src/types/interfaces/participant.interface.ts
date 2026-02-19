import type { RowDataPacket } from 'mysql2';

export default interface Participant extends RowDataPacket {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}
