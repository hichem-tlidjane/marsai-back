import type { ResultSetHeader } from 'mysql2';
import db from '../database/connection.js';
import type { MovieRequest } from '../types/schemas/MovieRequest.schema.js';
import type Movie from '../types/interfaces/Movie.interface.js';
import type Rate from '../types/interfaces/rate.interface.js';
import type { MovieFindAllResponse } from '../types/interfaces/MovieFindAllResponse.interface.js';
import type { MovieCount } from '../types/interfaces/MovieFindAllResponse.interface.js';
import { toSnakeCase } from '../helpers/string-utils.js';

const create = async (newMovie: MovieRequest): Promise<number> => {
  const sql = `
  INSERT INTO movie 
  (original_title, english_title, cover_path, duration, is_hybrid, language, original_synopsis, english_synopsis, creative_process, ai_tools, has_subs, video_path) 
  VALUES 
  (:originalTitle, :englishTitle, :coverUrl, :duration, :isHybrid, :language, :originalSynopsis, :englishSynopsis, :creativeProcess, :aiTools, :hasSubs, :videoUrl)
  `;
  const [result] = await db.execute<ResultSetHeader>(sql, newMovie);

  return result.insertId;
};

const getAll = async (
  page: number,
  type: string,
  search: string,
): Promise<MovieFindAllResponse> => {
  const offset: number = (page - 1) * 20;
  const isHybridFirst: number = type === 'hybrid' ? 1 : 0;
  const isHybridSecond: number = type === 'hybrid' || type === 'all' ? 1 : 0;

  const sqlCount =
    'SELECT COUNT(m.id) AS total \
                    FROM movie m \
                    INNER JOIN collaborator c ON m.id = c.movie_id \
                    WHERE c.contribution = "Director"\
                    AND m.english_title LIKE ? \
                    AND( m.is_hybrid = ? OR m.is_hybrid = ? )';
  const sqlData =
    'SELECT m.*, \
                    JSON_OBJECT( \
                        "gender", c.gender,\
                        "firstname", c.firstname,\
                        "lastname", c.lastname\
                      )  AS director\
              FROM movie m \
              INNER JOIN collaborator c ON m.id = c.movie_id \
              WHERE c.is_director = true\
              AND m.english_title LIKE ? \
              AND( m.is_hybrid = ? OR m.is_hybrid = ? )\
              LIMIT 20 OFFSET ?';

  search = '%' + search + '%';
  const [data] = await db.query<Movie[]>(sqlData, [
    search,
    isHybridFirst,
    isHybridSecond,
    offset,
  ]);
  const count = await db.query<MovieCount[]>(sqlCount, [
    search,
    isHybridFirst,
    isHybridSecond,
    offset,
  ]);
  const resCount: number = count[0][0]!.total;

  return { total: resCount, data } as MovieFindAllResponse;
};

const getById = async (id: number): Promise<Movie | null> => {
  const sql =
    'SELECT m.*, \
    JSON_OBJECT( \
        "gender", dir.gender,\
        "firstname", dir.firstname,\
        "lastname", dir.lastname,\
        "contribution", dir.contribution,\
        "email", dir.email,\
        "job", dir.job,\
        "address", dir.address,\
        "zipcode", dir.zipcode,\
        "city", dir.city,\
        "region", dir.region,\
        "country", dir.country,\
        "phone", dir.phone,\
        "birthdate", dir.birthdate,\
        "facebook_url", dir.facebook_url,\
        "instagram_url", dir.instagram_url,\
        "youtube_url", dir.youtube_url,\
        "linkedin_url", dir.linkedin_url,\
        "twitter_url", dir.twitter_url\
            ) AS director, \
    JSON_ARRAYAGG( \
        JSON_OBJECT( \
            "gender", c.gender,\
            "firstname", c.firstname,\
            "lastname", c.lastname,\
            "contribution", c.contribution,\
            "email", c.email\
    )) AS collaborators \
    FROM movie m \
    LEFT JOIN collaborator c ON m.id = c.movie_id AND c.is_director = false\
    INNER JOIN collaborator dir ON m.id = dir.movie_id AND dir.is_director = true\
    WHERE m.id = ? \
    GROUP BY dir.id';

  const [result] = await db.query<Movie[]>(sql, [id]);
  const movie = (result[0] as Movie) ?? null;
  if (movie && movie.collaborators[0]?.email === null) {
    movie.collaborators = [];
  }
  return movie;
};

const remove = async (id: number): Promise<number> => {
  const sql = 'DELETE FROM movie WHERE id = :id';

  const [result] = await db.execute<ResultSetHeader>(sql, { id });

  return result.affectedRows;
};

const getRateByMovieIdAndJuryId = async (
  juryId: number,
  movieId: number,
): Promise<Rate[]> => {
  const [result] = await db.execute(
    'SELECT id FROM ratings WHERE jury_id = ? AND movie_id = ?',
    [juryId, movieId],
  );

  return result as Rate[];
};

const updateRateByMovieIdAndJuryId = async (
  juryId: number,
  movieId: number,
  rate: number,
): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    'UPDATE ratings SET rating = ? WHERE jury_id = ? AND movie_id = ?',
    [rate, juryId, movieId],
  );

  return result.affectedRows;
};

const createRate = async (
  juryId: number,
  movieId: number,
  rating: number,
): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO ratings (rating, jury_id, movie_id) VALUES (?, ?, ?)',
    [rating, juryId, movieId],
  );
  return result.insertId;
};
const update = async (id: number, movie: MovieRequest): Promise<number> => {
  const fields: string[] = [];
  const values: (string | number | Date | boolean)[] = [];

  for (const [key, value] of Object.entries(movie)) {
    fields.push(`${toSnakeCase(key)} = ?`);
    values.push(value as string | number | Date | boolean);
  }

  if (fields.length === 0) {
    return 0; // No fields to update
  }

  values.push(id); // Add id for the WHERE clause

  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE movie SET ${fields.join(', ')} WHERE id = ?`,
    values,
  );

  return result.affectedRows;
};

const movieModel = {
  create,
  getAll,
  getById,
  remove,
  getRateByMovieIdAndJuryId,
  updateRateByMovieIdAndJuryId,
  createRate,
  update,
};

export default movieModel;
