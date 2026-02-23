import type { RowDataPacket } from 'mysql2';
import type Movie from './Movie.interface.js';

declare interface MovieFindAllResponse {
  total: number;
  data: Movie[];
}

declare interface MovieCount extends RowDataPacket {
  total: number;
}

export type { MovieFindAllResponse, MovieCount };
