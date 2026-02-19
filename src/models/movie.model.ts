import type { ResultSetHeader } from 'mysql2';
import db from '../database/connection.js';
import type { MovieRequest } from '../types/schemas/MovieRequest.schema.js';
import type Movie from '../types/interfaces/Movie.interface.js';

const create = async (newMovie: MovieRequest): Promise<number> => {
  const sql = `
    INSERT INTO movie 
    (original_title, english_title, cover_path, duration, is_hybrid, language, original_synopsis, english_synopsis, creative_process, ai_tools, has_subs, video_path) 
    VALUES 
    (:originalTitle, :englishTitle, :coverPath, :duration, :isHybrid, :language, :originalSynopsis, :englishSynopsis, :creativeProcess, :aiTools, :hasSubs, :videoPath)
  `;

  const [result] = await db.execute<ResultSetHeader>(sql, newMovie);

  return result.insertId;
};
const getAll = async (page: number): Promise<Movie[]> => {
  const offset: number = (page - 1) * 20;

  const sql =
    'SELECT m.*, \
                    JSON_OBJECT( \
                        "gender", c.gender,\
                        "firstname", c.firstname,\
                        "lastname", c.lastname\
                      )  AS director\
              FROM movie m \
              INNER JOIN collaborator c ON m.id = c.movie_id \
              WHERE c.contribution = "Director"\
              LIMIT 20 OFFSET ?';

  const [result] = await db.query<Movie[]>(sql, [offset]);
  return result as Movie[];
};

const getById = async (id: number): Promise<Movie | null> => {
  const sql = 'SELECT * FROM movie where id = ?';
  const [result] = await db.query<Movie[]>(sql, [id]);
  return result[0] ?? null;
};

const remove = async (id: number): Promise<number> => {
  const sql = 'DELETE FROM movie WHERE id = :id';

  const [result] = await db.execute<ResultSetHeader>(sql, { id });

  return result.affectedRows;
};

const movieModel = {
  create,
  getAll,
  getById,
  remove,
};

export default movieModel;
