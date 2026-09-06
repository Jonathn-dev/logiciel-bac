import { VectorRecord } from '../types';

export interface VectorQueryOptions {
  vector: number[];
  topK?: number;
  filter?: {
    userId?: string;
    source?: string;
    category?: string;
  };
  minScore?: number;
}

export interface QueryMatch {
  id: string;
  score: number;
  metadata: VectorRecord['metadata'];
}

/**
 * High-performance Client-side & In-Memory Vector Store
 * Supports Cosine Similarity, Top-K matching, chunk persistence and filtering
 */
export class VectorStore {
  private records: Map<string, VectorRecord> = new Map();
  private storageKey = 'atlas_bac_vector_store_v2';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed: VectorRecord[] = JSON.parse(saved);
        parsed.forEach((rec) => this.records.set(rec.id, rec));
      }
    } catch (e) {
      console.warn('Could not load vector store from storage:', e);
    }
  }

  private persistToStorage() {
    try {
      const array = Array.from(this.records.values());
      // Save top 100 recent vectors to avoid quota issues
      const sliceToPersist = array.slice(-100);
      localStorage.setItem(this.storageKey, JSON.stringify(sliceToPersist));
    } catch (e) {
      console.warn('Could not persist vectors to localStorage:', e);
    }
  }

  /**
   * Upsert vectors into the vector database
   */
  async upsert(params: { userId: string; vectors: VectorRecord[] }): Promise<{ count: number }> {
    for (const vec of params.vectors) {
      this.records.set(vec.id, {
        ...vec,
        userId: params.userId,
      });
    }
    this.persistToStorage();
    return { count: params.vectors.length };
  }

  /**
   * Perform Cosine Similarity Search
   */
  async query(options: VectorQueryOptions): Promise<QueryMatch[]> {
    const { vector, topK = 5, filter, minScore = 0.0 } = options;
    const matches: QueryMatch[] = [];

    for (const record of this.records.values()) {
      // Apply filters
      if (filter?.userId && record.userId !== filter.userId) continue;
      if (filter?.source && record.metadata.source !== filter.source) continue;

      const score = this.cosineSimilarity(vector, record.values);
      if (score >= minScore) {
        matches.push({
          id: record.id,
          score,
          metadata: record.metadata,
        });
      }
    }

    // Sort by descending similarity score and take topK
    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, topK);
  }

  /**
   * Delete vectors by source or ID
   */
  async deleteBySource(source: string): Promise<number> {
    let deleted = 0;
    for (const [id, record] of this.records.entries()) {
      if (record.metadata.source === source) {
        this.records.delete(id);
        deleted++;
      }
    }
    this.persistToStorage();
    return deleted;
  }

  /**
   * Clear all records
   */
  async clear(): Promise<void> {
    this.records.clear();
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Get total vector count
   */
  getCount(): number {
    return this.records.size;
  }

  /**
   * Get all stored vectors
   */
  getAll(): VectorRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Compute Cosine Similarity between two numeric embedding vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
    const len = Math.min(vecA.length, vecB.length);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < len; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const defaultVectorStore = new VectorStore();
