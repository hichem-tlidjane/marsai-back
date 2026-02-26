import type MovieResponse from '../types/interfaces/MovieResponse.interface.js';
import movieModel from '../models/movie.model.js';
import type { MovieRequest } from '../types/schemas/MovieRequest.schema.js';
import { slugify } from '../helpers/string-utils.js';
import type Movie from '../types/interfaces/Movie.interface.js';
import db from '../database/connection.js';
import collaboratorModel from '../models/collaborator.model.js';
import imageModel from '../models/image.model.js';
import AppError from '../helpers/AppError.js';
import type { MovieFindAllResponse } from '../types/interfaces/MovieFindAllResponse.interface.js';

const create = async (movieRequest: MovieRequest): Promise<MovieResponse> => {
  try {
    await db.beginTransaction();
    const slug = slugify(movieRequest.originalTitle);
    const movieId = await movieModel.create({ ...movieRequest, slug });
    await collaboratorModel.createDirector(movieRequest.director, movieId);
    await collaboratorModel.create(movieRequest.collaborators, movieId);
    await imageModel.insertMultiple(movieRequest.stillsUrls, movieId);
    await db.commit();
    const response: MovieResponse = {
      movieId: movieId,
    };
    return response;
  } catch (err) {
    console.error(err);
    await db.rollback();
    throw err;
  }
};

const getAll = async (
  page: number,
  type: string,
  search: string,
): Promise<MovieFindAllResponse> => {
  return await movieModel.getAll(page, type, search);
};

const getById = async (id: number): Promise<Movie> => {
  const movie = await movieModel.getById(id);
  if (!movie) throw new AppError(404, 'film not found');
  return movie;
};

const getBySlug = async (slug: string): Promise<Movie> => {
  const movie = await movieModel.getBySlug(slug);
  if (!movie) throw new AppError(404, 'film not found');
  return movie;
};

const remove = async (id: number): Promise<void> => {
  try {
    await db.beginTransaction();
    await collaboratorModel.remove(id);
    await imageModel.remove(id);

    const affectedRows = await movieModel.remove(id);

    if (affectedRows === 0) {
      throw new AppError(404, 'film not found');
    }

    await db.commit();
  } catch (err) {
    console.error(err);
    await db.rollback();
    throw err;
  }
};
const update = async (
  id: number,
  movieRequest: MovieRequest,
): Promise<number> => {
  if (movieRequest.originalTitle) {
    const slug = slugify(movieRequest.originalTitle);
    movieRequest.slug = slug;
  }
  const affectedRows = await movieModel.update(id, movieRequest);
  if (affectedRows === 0) {
    throw new AppError(404, `movie not found`);
  }
  return affectedRows;
};

const movieService = {
  create,
  getAll,
  getById,
  getBySlug,
  remove,
  update,
};

export default movieService;
