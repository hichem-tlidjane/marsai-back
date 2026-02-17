import type { Languages } from "../enums/languages.enum.js";

export default interface Movie {
  id?: number;
  originalTitle: string;
  englishTitle: string;
  submittedAt?: Date;
  youtubeUrl: string;
  coverImage: string;
  duration: number;
  isHybrid: boolean;
  language: Languages;
  originalSynopsis: string;
  englishSynopsis: string;
  creativeProcess: string;
  iaTools: string;
  hasSubs: boolean;
  srt: string | null;
  status: 'draft' | 'published' | 'archived';
}
