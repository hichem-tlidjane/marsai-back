import type { RequestHandler } from 'express';
import newsletterService from '../services/newsletter.service.js';

const create: RequestHandler = async (req, res, next) => {
  try {
    await newsletterService.create(req.body);
    res.send();
  } catch (e) {
    next(e);
  }
};

const newsletterController = { create };

export default newsletterController;
