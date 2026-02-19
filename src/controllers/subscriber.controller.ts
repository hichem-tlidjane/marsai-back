import type { RequestHandler } from 'express';
import subscriberService from '../services/subscriber.service.js';

const subscribe: RequestHandler = async (req, res, next) => {
  try {
    await subscriberService.subscribe(req.body);
    res.send();
  } catch (e) {
    next(e);
  }
};

const unsubscribe: RequestHandler = async (req, res, next) => {
  try {
    await subscriberService.unsubscribe(req.body);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

const subscriberController = { subscribe, unsubscribe };

export default subscriberController;
