import type AuthResponse from '../types/interfaces/auth-response.interface.js';
import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import type { AuthRequest } from '../types/schemas/auth-request.schema.js';
import jwtService from './jwt.service.js';

const login = async (
  authRequest: AuthRequest,
): Promise<AuthResponse | null> => {
  const user = await userModel.findByEmail(authRequest.email);
  if (!user) {
    return null;
  }
  const { password, ...userWithoutPassword } = user;
  const isMatch = await bcrypt.compare(authRequest.password, password);

  if (!isMatch) return null;

  const { accessToken, refreshToken } = jwtService.signPair(user);

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const authService = {
  login,
};

export default authService;
