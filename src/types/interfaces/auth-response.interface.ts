import type { UserResponse } from './user.interface.js';

export default interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}
