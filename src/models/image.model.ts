import type { ResultSetHeader } from 'mysql2';
import db from '../database/connection.js';

const insertMultiple = async (paths: string[], movieId: number) => {
  if (!paths.length) return;

  const values = paths.map((path) => [path, movieId]);
  await db.query<ResultSetHeader>(
    'INSERT INTO image (path, movie_id) VALUES ?',
    [values],
  );
};

const imageModel = { insertMultiple };

export default imageModel;
