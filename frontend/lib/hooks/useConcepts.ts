import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { useState, useCallback } from 'react';

// 型定義
export interface Concept {
  id: string;
  name: string;
  definition: string;
  context: string;
  relatedConcepts: string[];
}

interface UseConceptsReturn {
  concepts: Concept[] | undefined;
  isLoading: boolean;
  error: Error | null;
  createConcept: (conceptData: Omit<Concept, 'id'>) => Promise<Concept>;
  updateConcept: (id: string, conceptData: Partial<Concept>) => Promise<Concept>;
  deleteConcept: (id: string) => Promise<void>;
  getConceptById: (id: string) => Concept | undefined;
  searchConcepts: (query: string) => Concept[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CONCEPTS_ENDPOINT = `${API_URL}/api/concepts`;

export function useConcepts(): UseConceptsReturn {
  const [error, setError] = useState<Error | null>(null);

  // SWRを使用してコンセプトデータをフェッチ
  const { data: concepts, error: fetchError, isLoading } = useSWR<Concept[]>(
    CONCEPTS_ENDPOINT,
    async (url) => {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (err) {
        throw new Error('Failed to fetch concepts');
      }
    }
  );

  // 新しいコンセプトを作成
  const createConcept = useCallback(async (conceptData: Omit<Concept, 'id'>): Promise<Concept> => {
    try {
      const response = await axios.post<Concept>(CONCEPTS_ENDPOINT, conceptData);
      await mutate(CONCEPTS_ENDPOINT); // キャッシュを更新
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // 既存のコンセプトを更新
  const updateConcept = useCallback(async (id: string, conceptData: Partial<Concept>): Promise<Concept> => {
    try {
      const response = await axios.put<Concept>(`${CONCEPTS_ENDPOINT}/${id}`, conceptData);
      await mutate(CONCEPTS_ENDPOINT); // キャッシュを更新
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // コンセプトを削除
  const deleteConcept = useCallback(async (id: string): Promise<void> => {
    try {
      await axios.delete(`${CONCEPTS_ENDPOINT}/${id}`);
      await mutate(CONCEPTS_ENDPOINT); // キャッシュを更新
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // IDによるコンセプトの取得
  const getConceptById = useCallback((id: string): Concept | undefined => {
    return concepts?.find(concept => concept.id === id);
  }, [concepts]);

  // コンセプトの検索
  const searchConcepts = useCallback((query: string): Concept[] => {
    if (!concepts) return [];
    const lowercaseQuery = query.toLowerCase();
    return concepts.filter(concept => 
      concept.name.toLowerCase().includes(lowercaseQuery) ||
      concept.definition.toLowerCase().includes(lowercaseQuery)
    );
  }, [concepts]);

  // エラーハンドリング
  if (fetchError) {
    setError(fetchError);
  }

  return {
    concepts,
    isLoading,
    error,
    createConcept,
    updateConcept,
    deleteConcept,
    getConceptById,
    searchConcepts
  };
}