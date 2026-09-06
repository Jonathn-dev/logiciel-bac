import { useState } from 'react';
import { useSettingsStore, NotebookItem } from '../store/settingsStore';
import { notebookApi } from '../services/notebookApi';

export function useNotebookManager() {
  const {
    notebooks,
    activeNotebookId,
    strictMode,
    ragTemperature,
    addNotebook,
    removeNotebook,
    setActiveNotebook,
    toggleStrictMode,
    setRAGTemperature,
  } = useSettingsStore();

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId) || notebooks[0] || null;

  const handleCreateNotebook = async (
    title: string,
    subject: 'history' | 'geography' | 'all',
    content: string,
    tags: string[] = []
  ) => {
    setIsUploading(true);
    setError(null);
    try {
      const res = await notebookApi.indexNotebook(title, subject, content, tags);
      if (res.success && res.notebook) {
        addNotebook(res.notebook);
        setActiveNotebook(res.notebook.id);
        return res.notebook;
      } else {
        throw new Error(res.error || 'فشلت الفهرسة');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع أثناء إضافة الملخص');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteNotebook = async (id: string) => {
    await notebookApi.deleteNotebook(id);
    removeNotebook(id);
  };

  return {
    notebooks,
    activeNotebook,
    activeNotebookId,
    strictMode,
    ragTemperature,
    isUploading,
    error,
    createNotebook: handleCreateNotebook,
    deleteNotebook: handleDeleteNotebook,
    setActiveNotebook,
    toggleStrictMode,
    setRAGTemperature,
  };
}
