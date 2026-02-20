import type TokenPayload from '../types/interfaces/token-payload.interface.js';
import jwt from 'jsonwebtoken';

const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    { id: payload.id, roles: payload.roles },
    process.env.JWT_SECRET,
    {
      expiresIn: '4h',
    },
  );
};
const signSubscribeEventToken = (payload: { id: number }): string => {
  return jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(
    { id: payload.id, roles: payload.roles },
    process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );
};

const verify = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
};

const signPair = (
  payload: TokenPayload,
): { accessToken: string; refreshToken: string } => {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

const jwtService = {
  signAccessToken,
  signRefreshToken,
  verify,
  signPair,
  signSubscribeEventToken,
};

export default jwtService;
