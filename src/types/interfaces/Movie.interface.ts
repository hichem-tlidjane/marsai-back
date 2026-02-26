import type { RowDataPacket } from 'mysql2';
import type { Languages } from '../enums/languages.enum.js';
import type { Collaborator } from '../schemas/MovieRequest.schema.js';

export default interface Movie extends RowDataPacket {
  id?: number;
  original_title: string;
  english_title: string;
  submitted_at?: Date;
  youtube_url: string;
  cover_image: string;
  duration: number;
  is_hybrid: boolean;
  language: Languages;
  original_synopsis: string;
  english_synopsis: string;
  creative_process: string;
  ia_tools: string;
  has_subs: boolean;
  srt: string | null;
  status: 'draft' | 'published' | 'archived';
  collaborators: Collaborator[];
}
