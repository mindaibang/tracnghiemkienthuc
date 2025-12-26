
export enum Language {
  VI = 'VI',
  EN = 'EN'
}

export enum Mode {
  PRACTICE = 'practice',
  EXAM = 'exam',
  FLASHCARD = 'flashcard'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface Question {
  id: number;
  text: string;
  options: {
    id: string; // A, B, C, D
    text: string;
  }[];
  correctAnswer: string; // A, B, C, or D
  explanation: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export interface QuizConfig {
  dataSource: string;
  isUrl: boolean;
  mode: Mode;
  language: Language;
  numberOfQuestions: number;
  difficulty: Difficulty;
}

export interface QuizState {
  questions: Question[];
  flashcards: Flashcard[];
  currentQuestionIndex: number;
  userAnswers: Record<number, string>;
  isFinished: boolean;
  isLoading: boolean;
  error: string | null;
}
