import type { RequestHandler } from 'express';
import movieService from '../services/movie.service.js';
import { removeUploads } from '../helpers/remove-uploads.js';
import AppError from '../helpers/AppError.js';

const create: RequestHandler = async (req, res, next) => {
  try {
    const response = await movieService.create(req.body);
    return res.status(201).send(response);
  } catch (e) {
    removeUploads(req);
    next(e);
  }
};

const getAll: RequestHandler = async (req, res, next) => {
  try {
    const { page, type, search } = req.query;
    const pageAsInt = parseInt(page as string);
    if (
      isNaN(pageAsInt) ||
      pageAsInt <= 0 ||
      ((type as string) !== 'fullai' &&
        (type as string) !== 'hybrid' &&
        (type as string) !== 'all')
    ) {
      throw new AppError(400, 'Wrong query params');
    }
    const response = await movieService.getAll(
      pageAsInt,
      type as string,
      search as string,
    );
    return res.send(response);
  } catch (e) {
    next(e);
  }
};

const remove: RequestHandler = async (req, res, next) => {
  try {
    const movieId = Number(req.params.id);
    await movieService.remove(movieId);

    return res.status(204).json({ message: 'film delete with success.' });
  } catch (e) {
    next(e);
  }
};

const getById: RequestHandler = async (_req, res, next) => {
  try {
    const { id } = _req.params;
    const response = await movieService.getById(parseInt(id as string));
    return res.send(response);
  } catch (e) {
    next(e);
  }
};

const movieController = { getAll, getById, create, remove };

export default movieController;
