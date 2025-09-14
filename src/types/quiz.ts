export interface Question {
  id: number;
  question: string;
  options?: string[];
  correctAnswers?: number[];
  correctCode?: string;
  type: "single" | "multiple" | "coding";
  category: string;
  language?: string;
  placeholder?: string;
  scoringCriteria?: {
    requiredKeywords?: string[];
    requiredPatterns?: string[];
    minScore?: number;
  };
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: { [questionId: number]: number[] };
  codeAnswers: { [questionId: number]: string };
  isCompleted: boolean;
  score: number;
  totalQuestions: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  detailedResults?: {
    questionId: number;
    question: string;
    category: string;
    type: string;
    isCorrect: boolean;
    userAnswer?: string;
    correctAnswer?: string;
    codeScore?: {
      score: number;
      feedback: string;
      matchedKeywords: string[];
      missingKeywords: string[];
    };
  }[];
}
