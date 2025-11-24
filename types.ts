
export interface Comment {
  id: string;
  user: string;
  avatar: string; // URL
  content: string;
  timestamp: string;
  likes: number;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string[]; // Array of paragraphs
  comments: Comment[];
}

export interface TOCItem {
  number: number;
  title: string;
  url?: string;
}

export interface UserStats {
  booksFinished: number;
  readingStreak: number; // days
  totalReadTime: number; // minutes
  chaptersRead: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0 to 100
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  isGuest: boolean;
  bio?: string;
  stats: UserStats;
  achievements: Achievement[];
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  tags: string[];
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  totalChapters: number;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  isDefault?: boolean;
}

export interface LibraryEntry extends Novel {
  lastReadChapter: number; // 0 if never read
  readChapters: number[]; // List of chapter numbers read
  bookmarkedChapters: number[];
  categoryId: string;
  customTitle?: string;
  customCoverUrl?: string;
  sourceUrl?: string;
}

export enum FontFamily {
  SERIF = 'font-serif',
  SANS = 'font-sans',
  MONO = 'font-mono',
  LORA = 'font-lora',
}

export type ThemeId = 'dark' | 'midnight' | 'sepia' | 'light';

export interface ThemeColors {
  id: ThemeId;
  name: string;
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
}

export interface ReaderSettings {
  fontSize: number; // in pixels
  lineHeight: number; // generic unit
  paragraphSpacing: number; // in rem
  maxWidth: number; // max-width in px
  fontFamily: FontFamily;
  textAlign: 'left' | 'justify';
  theme: ThemeId;
}

export const THEMES: Record<ThemeId, ThemeColors> = {
  dark: {
    id: 'dark',
    name: 'Dark',
    bg: '#0f0f12',
    surface: '#18181b',
    text: '#e4e4e7',
    textMuted: '#a1a1aa',
    accent: '#6366f1',
    border: 'rgba(255,255,255,0.1)'
  },
  midnight: {
    id: 'midnight',
    name: 'OLED',
    bg: '#000000',
    surface: '#121212',
    text: '#d4d4d8',
    textMuted: '#71717a',
    accent: '#818cf8',
    border: 'rgba(255,255,255,0.15)'
  },
  sepia: {
    id: 'sepia',
    name: 'Sepia',
    bg: '#f5e6d0',
    surface: '#eaddc5',
    text: '#433422',
    textMuted: '#7c6a53',
    accent: '#8b5cf6',
    border: 'rgba(67, 52, 34, 0.1)'
  },
  light: {
    id: 'light',
    name: 'Light',
    bg: '#ffffff',
    surface: '#f4f4f5',
    text: '#18181b',
    textMuted: '#52525b',
    accent: '#4f46e5',
    border: 'rgba(0,0,0,0.08)'
  }
};

export const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: 18,
  lineHeight: 1.8,
  paragraphSpacing: 1.5,
  maxWidth: 800,
  fontFamily: FontFamily.LORA,
  textAlign: 'left',
  theme: 'dark'
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'reading', name: 'Reading', sortOrder: 0, isDefault: true },
  { id: 'plan', name: 'Plan to Read', sortOrder: 1, isDefault: true },
  { id: 'completed', name: 'Completed', sortOrder: 2, isDefault: true },
  { id: 'dropped', name: 'Dropped', sortOrder: 3, isDefault: true },
];
