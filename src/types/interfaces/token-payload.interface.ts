import type { Role } from '../enums/role.enum.js';

export default interface TokenPayload {
  id: number;
  roles: Role[];
}
