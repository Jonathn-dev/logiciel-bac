import { useState, useCallback } from 'react';
import { defaultRAGEngine, RAGQueryResponse } from '../services/ragEngine';

export function useRAG(userId: string = 'student-bac-2026') {
  const [isQuerying, setIsQuerying] = useState(false);
  const [lastResponse, setLastResponse] = useState<RAGQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ragMode, setRagMode] = useState<'strict' | 'blended'>('strict');

  const ask = useCallback(
    async (
      question: string,
      modeOverride?: 'strict' | 'blended',
      lessonContext?: any
    ): Promise<RAGQueryResponse | null> => {
      if (!question.trim()) return null;

      setIsQuerying(true);
      setError(null);
      const effectiveMode = modeOverride || ragMode;

      try {
        const response = await defaultRAGEngine.query(
          question,
          userId,
          effectiveMode,
          lessonContext
        );
        setLastResponse(response);
        return response;
      } catch (err: any) {
        console.error('RAG Hook Ask Error:', err);
        setError(err.message || 'فشل في استرجاع الإجابة من محرك RAG');
        return null;
      } finally {
        setIsQuerying(false);
      }
    },
    [userId, ragMode]
  );

  const toggleMode = useCallback(() => {
    setRagMode((prev) => (prev === 'strict' ? 'blended' : 'strict'));
  }, []);

  return {
    ask,
    isQuerying,
    lastResponse,
    error,
    ragMode,
    setRagMode,
    toggleMode,
  };
}
