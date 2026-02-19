import type { RowDataPacket } from 'mysql2';

export default interface Subscriber extends RowDataPacket {
  id: number;
  email: string;
}
