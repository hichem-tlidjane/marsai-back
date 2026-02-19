import type { RowDataPacket } from 'mysql2';

export interface Event extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  status: string;
  date: Date;
  published_at: Date;
  duration: number;
  location: string;
}
