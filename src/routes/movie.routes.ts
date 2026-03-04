import express from 'express';
import movieController from '../controllers/movie.controller.js';
import { isLogged } from '../middlewares/is-logged.js';
import { isAdmin } from '../middlewares/is-admin.js';
import { validate } from '../middlewares/validate.js';
import { MovieRequestSchema } from '../types/schemas/MovieRequest.schema.js';
import { upload } from '../middlewares/upload.js';

const movieRouter = express.Router();

movieRouter.get('/', movieController.getAll);
movieRouter.get('/sort', movieController.getAllSorted);
movieRouter.post(
  '/',
  upload,
  validate(MovieRequestSchema),
  movieController.create,
);
movieRouter.post(
  '/movies/:movieId/rate',
  isLogged,
  movieController.ratingsPost,
);
movieRouter.delete('/:id', movieController.remove);
movieRouter.put('/:id', isLogged, isAdmin, movieController.update);
movieRouter.get('/:slug', movieController.getBySlug);

export default movieRouter;
