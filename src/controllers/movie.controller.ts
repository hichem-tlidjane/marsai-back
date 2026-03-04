import type { RequestHandler } from 'express';
import movieService from '../services/movie.service.js';
import { removeUploads } from '../helpers/remove-uploads.js';
import AppError from '../helpers/AppError.js';

const create: RequestHandler = async (req, res, next) => {
  try {
    const response = await movieService.create(req.body);
    return res.status(201).send(response);
  } catch (e) {
    await removeUploads(req);
    next(e);
  }
};

const ratingsPost: RequestHandler = async (req, res, next) => {
  try {
    await movieService.ratingPost(req.body, req.user_id);

    return res.status(201).send();
  } catch (e) {
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

const getById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idAsInt = parseInt(id as string);
    if (isNaN(idAsInt) || idAsInt <= 0) {
      throw new AppError(400, 'Wrong query params');
    }
    const response = await movieService.getById(idAsInt);
    return res.send(response);
  } catch (e) {
    next(e);
  }
};

const getBySlug: RequestHandler = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const response = await movieService.getBySlug(slug as string);
    return res.send(response);
  } catch (e) {
    next(e);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await movieService.update(
      parseInt(id as string),
      req.body,
    );
    return res.status(200).send(response);
  } catch (e) {
    next(e);
  }
};

const getAllSorted: RequestHandler = async (req, res, next) => {
  try {
    const { page, sort, order, onlyDrafts, search } = req.query;
    const pageAsInt = parseInt(page as string);
    console.info("in contro");
    console.info("page: " + page);
    console.info("sort: " + sort);
    console.info("order: " + order);
    console.info("onlyDrafts: " + onlyDrafts);
    console.info("search: " + search);
    if (
      isNaN(pageAsInt) ||
      pageAsInt <= 0 ||
      ((order as string) !== 'ASC' &&
        (order as string) !== 'DESC') ||
        ((sort as string) !== 'id' &&
        (sort as string) !== 'english_title' &&
        (sort as string) !== 'submitted_at' &&
        (sort as string) !== 'status') ||
        ((onlyDrafts as string) !== "true" &&
          (onlyDrafts as string) !== "false")
    ) {
      throw new AppError(400, 'Wrong query params');
    }
    const onlyDraftsAsBool: boolean = onlyDrafts === "true" ? true : false;
    const response = await movieService.getAllSorted(
      pageAsInt,
      sort as string,
      order as string,
      onlyDraftsAsBool,
      search as string
    );
    return res.send(response);
  } catch (e) {
    next(e);
  }
};


const movieController = {
  getAll,
  getById,
  getBySlug,
  create,
  remove,
  update,
  ratingsPost,
  getAllSorted
};

export default movieController;
