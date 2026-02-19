import type { ResultSetHeader } from 'mysql2/promise';
import db from '../database/connection.js';
import type {
  Collaborator,
  Director,
} from '../types/schemas/MovieRequest.schema.js';

const createDirector = async (
  data: Director,
  movieId: number,
): Promise<number> => {
  const values = { ...data, contribution: 'Director', movieId };
  const sql = `
    INSERT INTO collaborator 
    (
        gender,
        firstname,
        lastname,
        email,
        job,
        contribution,
        address,
        zipcode,
        city,
        region,
        country,
        phone,
        birthdate,
        facebook_url,
        instagram_url,
        youtube_url,
        linkedin_url,
        twitter_url,
        movie_id
    ) 
    VALUES 
    (
        :gender,
        :firstname,
        :lastname,
        :email,
        :job,
        :contribution,
        :address,
        :zipcode,
        :city,
        :region,
        :country,
        :phone,
        :birthdate,
        :facebookUrl,
        :instagramUrl,
        :youtubeUrl,
        :linkedinUrl,
        :twitterUrl,
        :movieId
    )
  `;

  const [result] = await db.execute<ResultSetHeader>(sql, values);

  return result.insertId;
};

const create = async (
  data: Collaborator[],
  movieId: number,
): Promise<number> => {
  if (!data.length) return 0;

  const values = data.map((c) => [
    c.gender,
    c.firstname,
    c.lastname,
    c.email,
    c.contribution,
    movieId,
  ]);
  const sql = `
    INSERT INTO collaborator
    (
        gender,
        firstname,
        lastname,
        email,
        contribution,
        movie_id
    )
    VALUES ?
  `;

  const [result] = await db.query<ResultSetHeader>(sql, [values]);

  return result.insertId;
};

const remove = async (movieId: number): Promise<number> => {
  const sql = 'DELETE FROM collaborator WHERE movie_id = :movieId';

  const [result] = await db.execute<ResultSetHeader>(sql, { movieId });

  return result.affectedRows;
};

const collaboratorModel = { create, createDirector, remove };

export default collaboratorModel;
