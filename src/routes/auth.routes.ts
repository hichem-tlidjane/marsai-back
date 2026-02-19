import express from 'express';
import authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { AuthRequestSchema } from '../types/schemas/auth-request.schema.js';

const authRouter = express.Router();

authRouter.post('/login', validate(AuthRequestSchema), authController.login);
authRouter.post('/refresh-token', authController.refreshToken);

export default authRouter;
