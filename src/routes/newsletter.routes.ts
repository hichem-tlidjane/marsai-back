import express from 'express';
import { validate } from '../middlewares/validate.js';
import newsletterController from '../controllers/newsletter.controller.js';
import { NewsletterRequestSchema } from '../types/schemas/newsletter.schema.js';
import { isAdmin } from '../middlewares/is-admin.js';
import { isLogged } from '../middlewares/is-logged.js';

const newsletterRouter = express.Router();

newsletterRouter.post(
  '/',
  isLogged,
  isAdmin,
  validate(NewsletterRequestSchema),
  newsletterController.create,
);

newsletterRouter.get('/', isLogged, isAdmin, newsletterController.findAll);

export default newsletterRouter;
