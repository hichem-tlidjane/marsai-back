import type { RowDataPacket } from 'mysql2/promise';
import type { Role } from '../enums/role.enum.js';

export default interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  roles: Role[];
  created_at: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  roles: Role[];
  created_at: Date;
}
