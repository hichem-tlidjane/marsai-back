import rateLimit from 'express-rate-limit';

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Trop de tentatives de connexion, réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});