import { useState, useCallback } from 'react';
import { AIMessage, AICompanionStatus, LessonData } from '../types';
import { aiProxyClient } from '../services/aiProxyClient';

export function useAICompanion(lesson: LessonData, strictMode: boolean = true) {
  const [status, setStatus] = useState<AICompanionStatus>('idle');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `مرحباً بك! أنا رفيقك البيداغوجي الذكي لوحدة **«${lesson.title}»**.
يمكنك سؤالي عن التواريخ، المقارنات المنهجية، المفاهيم المرجعية، أو كيفية صياغة مقال تاريخي/جغرافي نموذجي.`,
      timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      citations: ['الإطار المرجعي الوطني للامتحان الموحد'],
      keyConcepts: lesson.expandableTerms.slice(0, 3).map((t) => t.term),
      isStrictMatch: true,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeConceptHighlight, setActiveConceptHighlight] = useState<string | null>(null);

  const askAI = useCallback(
    async (questionText: string, activeNotesSnippet?: string) => {
      if (!questionText.trim()) return;

      const userMsg: AIMessage = {
        id: `user-${Date.now()}`,
        sender: 'student',
        text: questionText,
        timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setStatus('thinking');

      try {
        const payload = {
          question: questionText,
          subject: lesson.subject as 'history' | 'geography',
          strictMode: strictMode,
          lessonContext: {
            id: lesson.id,
            title: lesson.title,
            subject: lesson.subject,
            chapter: lesson.chapter,
            terms: lesson.expandableTerms.map((t) => t.term),
            notesSnippet: activeNotesSnippet || '',
          },
          notebookId: 'active-notebook',
        };

        const data = await aiProxyClient.askQuestion(payload);

        const aiReply: AIMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer || 'تمت معالجة السؤال بنجاح.',
          timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
          citations: data.citations || [],
          keyConcepts: data.keyConcepts || [],
          recommendedAction: data.recommendedAction,
          isStrictMatch: data.isStrictMatch,
        };

        setMessages((prev) => [...prev, aiReply]);
        setStatus('ready');

        // Return back to idle after a brief ready feedback
        setTimeout(() => {
          setStatus('idle');
        }, 4000);
      } catch (err: any) {
        console.error('AI Companion Error:', err);
        setStatus('error');
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text: err.message || 'تعذر الاتصال بالمساعد حالياً. يرجى المحاولة مرة أخرى.',
            timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      }
    },
    [lesson, strictMode]
  );

  const clearHistory = useCallback(() => {
    setMessages([
      {
        id: 'welcome-reinit',
        sender: 'ai',
        text: 'تم بدء محادثة جديدة. اسألني أي سؤال يخص الإطار المرجعي.',
        timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  return {
    status,
    messages,
    isOpen,
    setIsOpen,
    askAI,
    clearHistory,
    activeConceptHighlight,
    setActiveConceptHighlight,
  };
}
