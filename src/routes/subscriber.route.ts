import express from 'express';
import { validate } from '../middlewares/validate.js';
import subscriberController from '../controllers/subscriber.controller.js';
import { SubscriberRequestSchema } from '../types/schemas/subscriber.schema.js';

const subscriberRouter = express.Router();

subscriberRouter.post(
  '/',
  validate(SubscriberRequestSchema),
  subscriberController.subscribe,
);

subscriberRouter.delete(
  '/',
  validate(SubscriberRequestSchema),
  subscriberController.unsubscribe,
);

export default subscriberRouter;
