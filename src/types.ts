export interface Chapter {
  id: string;
  number?: number;
  title: string;
  subtitle?: string;
  startPage: number;
  endPage: number;
  estimatedMinutes: number;
  category: 'Introducción' | 'Neuroquímica y Biología' | 'Relaciones y Sociedad' | 'Mente y Emociones' | 'Toma de Decisiones' | 'Crecimiento y Acción' | 'Epílogo';
  keywords: string[];
  summary: string;
  paragraphs: string[];
}

export interface BookInfo {
  title: string;
  subtitle: string;
  authorTagline: string;
  pagesCount: number;
  chaptersCount: number;
  estimatedTotalMinutes: number;
  coverImage: string;
  description: string;
}

export type ThemeMode = 'dark' | 'light' | 'sepia' | 'oled';
export type FontFamily = 'serif' | 'sans' | 'mono';

export interface ReadingSettings {
  fontSize: number; // in px: 14 to 28
  lineHeight: number; // 1.4 to 2.2
  fontFamily: FontFamily;
  theme: ThemeMode;
  textAlign: 'left' | 'justify';
  autoScrollSpeed: number; // 0 = off, 1-5
  keepScreenAwake: boolean;
}

export interface Bookmark {
  id: string;
  chapterId: string;
  chapterTitle: string;
  paragraphIndex: number;
  previewText: string;
  createdAt: string;
}

export interface SearchResult {
  chapterId: string;
  chapterTitle: string;
  paragraphIndex: number;
  snippet: string;
  matchCount: number;
}

export type DownloadFormat = 'pdf' | 'epub' | 'txt' | 'html';
