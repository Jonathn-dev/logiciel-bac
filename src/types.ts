export type BacSubject = 'history' | 'geography';
export type BacStream = 'all' | 'literature' | 'scientific' | 'management' | 'languages';

export type TaskCategory = 'history' | 'geography' | 'terminology' | 'methodology';
export type TaskPhase = 'focus' | 'review' | 'practice' | 'quiz';

export interface DailyTask {
  id: string;
  title: string;
  category: TaskCategory;
  categoryLabel: string;
  chapter: string;
  estimatedMinutes: number;
  timeSlot: string;
  phase: TaskPhase;
  phaseLabel: string;
  xpReward: number;
  completed: boolean;
  notes: string;
  tags: string[];
}

export type Task = DailyTask;

export interface DailyPlanResponse {
  planId: string;
  date: string;
  greeting: string;
  focusTheme: string;
  motivationalQuote: string;
  tasks: DailyTask[];
  sourcesUsed: string[];
}

export interface BacDateItem {
  id: string;
  dateStr: string;
  year: number;
  month?: number;
  day?: number;
  title: string;
  event: string;
  significance: string;
  category: 'national' | 'international';
  tags: string[];
}

export interface BacCharacterItem {
  id: string;
  name: string;
  title: string;
  role: string;
  nationality: string;
  bio: string;
  crucialAchievements: string[];
  examTips: string;
  tags: string[];
}

export interface BacTermItem {
  id: string;
  term: string;
  subject: BacSubject;
  officialDefinition: string;
  simplifiedExplanation: string;
  keywords: string[];
  commonMistakes: string;
  examFrequency: 'very_high' | 'high' | 'medium';
}

export interface QuizQuestion {
  id: string;
  subject: BacSubject;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  curriculumChapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MapLayer {
  id: string;
  name: string;
  subject: BacSubject;
  description: string;
  markers: MapMarker[];
}

export interface MapMarker {
  id: string;
  label: string;
  lat: number;
  lng: number;
  xPercent: number; // For SVG 2D rendering
  yPercent: number;
  description: string;
  historicalContext: string;
  category: string;
}

export interface EssayTopic {
  id: string;
  subject: BacSubject | string;
  title: string;
  unit?: string;
  context?: string;
  contextText?: string;
  questions?: string[];
  requiredQuestions?: string[];
  keyTerms?: string[];
  officialRubric?: any;
  suggestedPlan?: {
    introduction: string;
    part1: string[];
    part2: string[];
    conclusion: string;
  };
  scoringCriteria?: {
    introductionPoints: number;
    bodyPoints: number;
    conclusionPoints: number;
    presentationPoints: number;
  };
  [key: string]: any;
}

export interface UserProgress {
  xp: number;
  level: number;
  completedTasks: string[];
  quizStreak: number;
  essaysDrafted: number;
  mapsStudied: number;
  masteredTerms: string[];
  streakDays: number;
}

export type BacBranch =
  | 'آداب وفلسفة'
  | 'لغات أجنبية'
  | 'تسيير واقتصاد'
  | 'علوم تجريبية'
  | 'رياضيات'
  | 'تقني رياضي'
  | string;

export interface UserStats {
  name: string;
  email?: string;
  avatarUrl: string;
  level?: number;
  currentLevel?: number;
  totalXP: number;
  streakDays: number;
  strictMode: boolean;
  branch?: BacBranch;
  wilayaCode?: string;
  wilayaName?: string;
  highSchool?: string;
  completedTasks?: string[];
  essaysDrafted?: number;
  quizzesTaken?: number;
  [key: string]: any;
}

export interface AlgerianWilaya {
  code: string;
  name: string;
  nameEn?: string;
}

export interface PasswordStrengthInfo {
  score: number;
  label: string;
  color: string;
  feedback: string[];
  hasMinLength: boolean;
  hasNumber: boolean;
  hasUpper: boolean;
  hasSpecial: boolean;
}

export interface QuickAccessItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  color?: string;
  route?: string;
}

export interface FlashcardItem {
  id: string;
  category: 'history' | 'geography' | string;
  type: 'term' | 'personality' | 'date' | 'concept' | string;
  front: string;
  back: string;
  examHint?: string;
  box: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface ChronoChallengeItem {
  id: string;
  dateStr: string;
  year: number;
  order: number;
  title: string;
  description: string;
  category: string;
}

export interface MapPinItem {
  id: string;
  name: string;
  mapType: string;
  correctX: number;
  correctY: number;
  clue: string;
  historicalSignificance: string;
  keyLeaders?: string[];
  options: string[];
}

export type ProcessingStageId =
  | 'upload'
  | 'ocr'
  | 'chunking'
  | 'embedding'
  | 'vector_upsert'
  | 'gap_analysis'
  | 'mindmap_gen'
  | 'completed'
  | string;

export interface ProcessingStep {
  id: ProcessingStageId;
  label: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'success' | 'error';
  progress: number;
  details?: string;
}

export type AICompanionStatus = 'idle' | 'ready' | 'thinking' | 'answering' | 'error' | string;

export interface AIMessage {
  id: string;
  sender: 'ai' | 'student' | 'user';
  text: string;
  timestamp: string;
  citations?: string[];
  keyConcepts?: string[];
  recommendedAction?: string;
  isStrictMatch?: boolean;
}

export interface FocusModeState {
  isActive: boolean;
  pomodoroMinutes: number;
  pomodoroSeconds: number;
  isRunning: boolean;
  mode: 'study' | 'break' | string;
  ambientSound: string;
  volume: number;
}

export interface GapMetricItem {
  category: string;
  currentCount: number;
  requiredCount: number;
  coveragePercentage: number;
  color: string;
}

export interface MissingConceptItem {
  id: string;
  title: string;
  type: string;
  category: string;
  chapter: string;
  whyCritical: string;
  suggestedAction: string;
  frequency: string;
}

export interface ExtractedConceptItem {
  name: string;
  type: string;
  context?: string;
  relevanceScore?: number;
  [key: string]: any;
}

export interface ComprehensiveGapReport {
  overallScore: number;
  status: 'optimal' | 'moderate_gaps' | 'critical_gaps' | string;
  summary: string;
  metrics: GapMetricItem[];
  missingItems: MissingConceptItem[];
  matchedCount: number;
  missingCount: number;
  recommendations: string[];
  strictModeVerdict: 'PASS_OFFICIAL' | 'REQUIRES_REVISION' | 'INSUFFICIENT' | string;
}

export interface MindmapTreeNode {
  id: string;
  name: string;
  category?: string;
  type?: string;
  level?: number;
  children?: MindmapTreeNode[];
  description?: string;
  status?: string;
  [key: string]: any;
}

export interface VectorRecord {
  id: string;
  userId?: string;
  vector?: number[];
  values: number[];
  metadata: {
    userId?: string;
    text?: string;
    source?: string;
    category?: string;
    subject?: string;
    chunkIndex?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export type AuthMode = 'login' | 'register' | 'forgot-password';
export type RegisterStep = 1 | 2 | 3 | number;
export type ForgotPasswordStep = 1 | 2 | 3 | number;

export interface AuthStudentUser {
  userId: string;
  name: string;
  email: string;
  branch: BacBranch;
  wilayaCode: string;
  wilayaName: string;
  avatarUrl: string;
  role: string;
  registeredAt: string;
  lastLoginAt: string;
  phone?: string;
  highSchool?: string;
}

export interface AuthSessionResponse {
  token: string;
  tokenType: string;
  expiresIn: string;
  user: AuthStudentUser;
  success?: boolean;
}

export interface ExpandableTerm {
  id?: string;
  term: string;
  definition?: string;
  officialDefinition?: string;
  category?: string;
  examContext?: string;
  examFrequency?: string;
  associatedYear?: string;
  contextInLesson?: string;
  keywords?: string[];
  [key: string]: any;
}

export interface LessonData {
  id: string;
  title: string;
  subtitle?: string;
  subject: 'history' | 'geography' | string;
  chapter: string;
  unit: string;
  estimatedMinutes: number;
  totalXP: number;
  summary: string;
  audioNarrationSnippet?: string;
  videoData?: {
    videoUrl: string;
    poster: string;
    duration: string;
    markers: { timeSeconds: number; label: string; concept: string }[];
    transcript: { timestamp: string; speaker: string; text: string }[];
  };
  sections: {
    id: string;
    title: string;
    subheading?: string;
    content: string;
    highlightedTerms?: string[];
    checkpointQuestion?: any;
    [key: string]: any;
  }[];
  expandableTerms: ExpandableTerm[];
  interactiveMaps?: any[];
  chronology?: any[];
  quizzes?: any[];
  mapData?: any;
  [key: string]: any;
}

export interface DocumentAnalysisResult {
  title: string;
  sourceText: string;
  matchScore: number;
  entitiesFound: number;
  confidence: string;
  terms: {
    term: string;
    type: string;
    [key: string]: any;
  }[];
  [key: string]: any;
}

export interface NoteSnippet {
  id: string;
  lessonId: string;
  text: string;
  updatedAt: string;
  tags: string[];
  vectorMatches?: {
    title: string;
    text: string;
    confidence: number;
    source: string;
  }[];
}

export interface MapRegionLayer {
  id: string;
  name: string;
  description?: string;
  color?: string;
  leaders?: string[];
  coordinates?: { x: number; y: number };
  [key: string]: any;
}

export interface TimelineEventItem {
  id: string;
  year: number | string;
  dateStr: string;
  title: string;
  description: string;
  importance?: string;
  category?: string;
  [key: string]: any;
}

export type LessonContentType = 'text' | 'video' | 'map' | 'timeline';
