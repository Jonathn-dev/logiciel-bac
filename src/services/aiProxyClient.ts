import {
  AskRequestPayload,
  AskResponsePayload,
  GenerateQuizRequestPayload,
  GenerateQuizResponsePayload,
  GenerateFlashcardsRequestPayload,
  GenerateFlashcardsResponsePayload,
} from '../../server/types';

// Store client JWT token in localStorage for persistence
const JWT_STORAGE_KEY = 'bac_jwt_token';

export const aiProxyClient = {
  /**
   * Get cached JWT token or fetch a new one from the proxy
   */
  async getAuthToken(studentId = 'student-marouane-2026'): Promise<string> {
    try {
      const cached = localStorage.getItem(JWT_STORAGE_KEY);
      if (cached) return cached;

      const res = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: studentId,
          name: 'مروان - طالب بكالوريا 2026',
          branch: 'آداب وفلسفة',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem(JWT_STORAGE_KEY, data.token);
          return data.token;
        }
      }
    } catch (e) {
      console.warn('[AIProxyClient] Could not fetch auth token:', e);
    }
    return '';
  },

  /**
   * 1. POST /api/ai/ask (RAG Strict Mode Q&A)
   */
  async askQuestion(payload: AskRequestPayload): Promise<AskResponsePayload> {
    const token = await this.getAuthToken();
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 429) {
      const err = await res.json();
      throw new Error(err.message || 'تم تجاوز حد الطلبات (5 طلبات في الدقيقة). يرجى الانتظار.');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `خطأ في الخادم (${res.status})`);
    }

    return res.json();
  },

  /**
   * 2. POST /api/ai/generate-quiz (Generate Quiz from Student Summary)
   */
  async generateQuiz(payload: GenerateQuizRequestPayload): Promise<GenerateQuizResponsePayload> {
    const token = await this.getAuthToken();
    const res = await fetch('/api/ai/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 429) {
      const err = await res.json();
      throw new Error(err.message || 'تم تجاوز حد الطلبات (5 طلبات في الدقيقة). يرجى الانتظار.');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `خطأ في الخادم (${res.status})`);
    }

    return res.json();
  },

  /**
   * 3. POST /api/ai/generate-flashcards (Generate Flashcards from Student Summary)
   */
  async generateFlashcards(
    payload: GenerateFlashcardsRequestPayload
  ): Promise<GenerateFlashcardsResponsePayload> {
    const token = await this.getAuthToken();
    const res = await fetch('/api/ai/generate-flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 429) {
      const err = await res.json();
      throw new Error(err.message || 'تم تجاوز حد الطلبات (5 طلبات في الدقيقة). يرجى الانتظار.');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `خطأ في الخادم (${res.status})`);
    }

    return res.json();
  },

  /**
   * 4. POST /api/vectors/upsert (Upsert summary chunks to Pinecone)
   */
  async upsertChunks(
    chunks: {
      id?: string;
      title: string;
      text: string;
      subject?: string;
      notebookId?: string;
      tags?: string[];
    }[]
  ): Promise<{ success: boolean; insertedCount: number }> {
    const token = await this.getAuthToken();
    const res = await fetch('/api/vectors/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ chunks }),
    });

    if (!res.ok) {
      throw new Error('فشلت عملية فهرسة المتجهات في Pinecone.');
    }

    return res.json();
  },
};
