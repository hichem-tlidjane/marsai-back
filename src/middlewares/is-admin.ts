import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { Role } from '../types/enums/role.enum.js';

/**
 * Must be preceded by isLogged middleware
 */
export const isAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user_roles.includes(Role.Admin)) {
    return res.status(403).send({ message: 'Must be an admin' });
  }
  next();
};
