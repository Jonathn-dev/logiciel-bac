export interface JwtUserPayload {
  userId: string;
  name?: string;
  role?: string;
  branch?: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export interface StudentNotebookChunk {
  id: string;
  studentId: string;
  notebookId: string;
  title: string;
  text: string;
  subject: 'history' | 'geography' | 'general';
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  text: string;
  title: string;
  notebookId: string;
  subject: string;
  tags: string[];
}

export interface AskRequestPayload {
  question: string;
  notebookId?: string;
  subject?: 'history' | 'geography' | 'general';
  strictMode?: boolean; // RAG Strict Mode
  topK?: number;
  lessonContext?: {
    id?: string;
    title?: string;
    chapter?: string;
  };
}

export interface AskResponsePayload {
  answer: string;
  citations: string[];
  keyConcepts: string[];
  recommendedAction?: string;
  retrievedContextCount: number;
  isStrictMatch: boolean;
  strictModeEnforced: boolean;
  confidenceScore: number;
  sources: {
    id: string;
    title: string;
    score: number;
    snippet: string;
  }[];
  timestamp: string;
}

export interface GenerateQuizRequestPayload {
  topic?: string;
  notebookId?: string;
  subject?: 'history' | 'geography' | 'general';
  difficulty?: 'easy' | 'medium' | 'hard' | 'bac_exam';
  questionCount?: number;
  strictMode?: boolean;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  bacYearReference?: string;
  sourceCitation?: string;
}

export interface GenerateQuizResponsePayload {
  quizId: string;
  topic: string;
  subject: string;
  questions: QuizQuestionItem[];
  generatedFromSummary: boolean;
  sourcesUsed: string[];
  timestamp: string;
}

export interface GenerateFlashcardsRequestPayload {
  topic?: string;
  notebookId?: string;
  subject?: 'history' | 'geography' | 'general';
  count?: number;
  strictMode?: boolean;
}

export interface FlashcardItem {
  id: string;
  front: string; // Question or Concept or Date
  back: string; // Definition or Event details
  category: 'date' | 'definition' | 'personality' | 'concept' | 'map';
  importance: 'critical' | 'high' | 'medium';
  bacExamTip?: string;
}

export interface GenerateFlashcardsResponsePayload {
  deckId: string;
  topic: string;
  subject: string;
  cards: FlashcardItem[];
  generatedFromSummary: boolean;
  sourcesUsed: string[];
  timestamp: string;
}
