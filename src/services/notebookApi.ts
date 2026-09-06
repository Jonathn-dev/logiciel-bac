import { NotebookItem } from '../store/settingsStore';

export const notebookApi = {
  // Index new notebook file or raw text
  async indexNotebook(
    title: string,
    subject: 'history' | 'geography' | 'all',
    content: string,
    tags: string[] = []
  ): Promise<{ success: boolean; notebook?: NotebookItem; error?: string }> {
    try {
      // Simulate indexing delay and vector chunking
      await new Promise((resolve) => setTimeout(resolve, 600));

      const words = content.split(/\s+/).filter(Boolean);
      const vectorCount = Math.max(12, Math.round(words.length / 35));
      const sizeBytes = new Blob([content]).size;

      const newNotebook: NotebookItem = {
        id: `nb-${Date.now()}`,
        title,
        subject,
        vectorCount,
        lastUpdated: new Date().toISOString().split('T')[0],
        sizeBytes,
        summary: content.slice(0, 160) + (content.length > 160 ? '...' : ''),
        status: 'indexed',
        tags: tags.length > 0 ? tags : [subject === 'history' ? 'تاريخ' : 'جغرافيا', 'ملخص_2026'],
      };

      return {
        success: true,
        notebook: newNotebook,
      };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'حدث خطأ أثناء فهرسة الملف',
      };
    }
  },

  // Delete notebook
  async deleteNotebook(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 200));
    return true;
  },

  // Re-index / optimize vector database
  async optimizeVectors(notebookId: string): Promise<{ success: boolean; optimizedCount: number }> {
    await new Promise((res) => setTimeout(res, 500));
    return {
      success: true,
      optimizedCount: 140,
    };
  },
};
