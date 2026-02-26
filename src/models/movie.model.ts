import type { ResultSetHeader } from 'mysql2';
import db from '../database/connection.js';
import type { MovieRequest } from '../types/schemas/MovieRequest.schema.js';
import type Movie from '../types/interfaces/Movie.interface.js';
import type { MovieFindAllResponse } from '../types/interfaces/MovieFindAllResponse.interface.js';
import type { MovieCount } from '../types/interfaces/MovieFindAllResponse.interface.js';
import { toSnakeCase } from '../helpers/string-utils.js';

const create = async (newMovie: MovieRequest): Promise<number> => {
  const sql = `
  INSERT INTO movie 
  (original_title, english_title, slug, cover_path, duration, is_hybrid, language, original_synopsis, english_synopsis, creative_process, ai_tools, has_subs, video_path) 
  VALUES 
  (:originalTitle, :englishTitle, :slug, :coverUrl, :duration, :isHybrid, :language, :originalSynopsis, :englishSynopsis, :creativeProcess, :aiTools, :hasSubs, :videoUrl)
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
              WHERE c.contribution = "Director"\
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
  const sql = 'SELECT * FROM movie where id = ?';
  const [result] = await db.query<Movie[]>(sql, [id]);
  return result[0] ?? null;
};

const getBySlug = async (slug: string): Promise<Movie | null> => {
  const sql = 'SELECT * FROM movie where slug = ?';
  const [result] = await db.query<Movie[]>(sql, [slug]);
  return result[0] ?? null;
};

const remove = async (id: number): Promise<number> => {
  const sql = 'DELETE FROM movie WHERE id = :id';

  const [result] = await db.execute<ResultSetHeader>(sql, { id });

  return result.affectedRows;
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
  getBySlug,
  remove,
  update,
};

export default movieModel;
