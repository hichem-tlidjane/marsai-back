import type { Response } from 'express';

export const setTokensInCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
): void => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    path: '/auth/refresh-token',
  });
};
