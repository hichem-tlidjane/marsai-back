import type { ResultSetHeader } from 'mysql2';
import db from '../database/connection.js';

const insertMultiple = async (
  paths: string[],
  movieId: number,
): Promise<void> => {
  if (!paths.length) return;

  const values = paths.map((path) => [path, movieId]);
  await db.query<ResultSetHeader>(
    'INSERT INTO image (path, movie_id) VALUES ?',
    [values],
  );
};

const remove = async (movieId: number): Promise<number> => {
  const sql = 'DELETE FROM image WHERE movie_id = :movieId';

  const [result] = await db.execute<ResultSetHeader>(sql, { movieId });

  return result.affectedRows;
};

const imageModel = { insertMultiple, remove };

export default imageModel;
