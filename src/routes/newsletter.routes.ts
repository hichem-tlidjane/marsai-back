import express from 'express';
import { validate } from '../middlewares/validate.js';
import newsletterController from '../controllers/newsletter.controller.js';
import { NewsletterRequestSchema } from '../types/schemas/newsletter.schema.js';

const newsletterRouter = express.Router();

newsletterRouter.post(
  '/',
  validate(NewsletterRequestSchema),
  newsletterController.create,
);

export default newsletterRouter;
