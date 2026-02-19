import type { RowDataPacket } from 'mysql2';

export default interface Jury extends RowDataPacket {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}
