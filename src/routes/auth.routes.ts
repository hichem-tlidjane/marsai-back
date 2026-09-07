import express from 'express';
import authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { AuthRequestSchema } from '../types/schemas/auth-request.schema.js';
import { isLogged } from '../middlewares/is-logged.js';
import { loginRateLimit } from '../middlewares/rate-limit.js';

const authRouter = express.Router();

authRouter.post('/login', loginRateLimit, validate(AuthRequestSchema), authController.login);
authRouter.get('/logout', isLogged, authController.logout);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.get('/me', isLogged, authController.getMe);

export default authRouter;
