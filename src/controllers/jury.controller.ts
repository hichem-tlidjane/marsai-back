import type { RequestHandler } from 'express';
import juryService from '../services/jury.service.js';

const create: RequestHandler = async (req, res, next) => {
  try {
    await juryService.addJuries(req.body);
    res.send();
  } catch (e) {
    next(e);
  }
};

const findAll: RequestHandler = async (_req, res, next) => {
  try {
    const juries = await juryService.findAll();
    res.send(juries);
  } catch (e) {
    next(e);
  }
};

const juryController = { create, findAll };

export default juryController;
