import type { NextFunction, Request, RequestHandler, Response } from 'express';
import jwtService from '../services/jwt.service.js';

export const isLogged: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken as string | undefined;

  if (!token) {
    return res.status(401).send({ message: 'Token missing' });
  }

  try {
    const payload = jwtService.verify(token);
    req.user_id = payload.id;
    req.user_roles = payload.roles;
    return next();
  } catch (_) {
    return res.status(401).send({ message: 'Invalid token' });
  }
};
