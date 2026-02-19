import type { RowDataPacket } from 'mysql2';
export default interface Booking extends RowDataPacket {
  id: number;
  participant_id: number;
  event_id: number;
  created_at: Date;
  cancelled_at: Date | null;
}
