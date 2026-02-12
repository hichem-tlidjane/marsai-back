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

const getAll = async (): Promise<Movie[]> => {
  const sql = 'SELECT * FROM movie';
  const [result] = await db.query(sql);
  return result as Movie[];
};

const movieModel = {
  create,
  getAll,
};

export default movieModel;
