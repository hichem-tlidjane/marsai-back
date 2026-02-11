import type { RequestHandler } from 'express';
import movieService from '../services/movie.service.js';
import { removeUploads } from '../helpers/remove-uploads.js';

const create: RequestHandler = async (req, res, next) => {
  try {
    const response = await movieService.create(req.body);
    return res.send(response);
  } catch (e) {
    removeUploads(req);
    next(e);
  }
};

const getAll: RequestHandler = async (_req, res, next) => {
  try {
    const response = await movieService.getAll();
    return res.send(response);
  } catch (e) {
    next(e);
  }
};
const movieController = { getAll, create };

export default movieController;
