import { useState, useCallback, useEffect } from 'react';
import { getProposition, createProposition, updateProposition, deleteProposition } from '../api/proposition';
import { Proposition } from '../../types';

interface UsePropositionReturn {
  proposition: Proposition | null;
  loading: boolean;
  error: Error | null;
  createNewProposition: (text: string, concepts: string[]) => Promise<void>;
  updateExistingProposition: (id: string, updates: Partial<Proposition>) => Promise<void>;
  deleteExistingProposition: (id: string) => Promise<void>;
  fetchProposition: (id: string) => Promise<void>;
  clearProposition: () => void;
}

/**
 * 命題に関連する操作を管理するカスタムフック
 * @returns {UsePropositionReturn} 命題関連の状態と操作メソッド
 */
export const useProposition = (): UsePropositionReturn => {
  const [proposition, setProposition] = useState<Proposition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * エラーハンドリングのためのユーティリティ関数
   */
  const handleError = useCallback((error: any) => {
    setError(error instanceof Error ? error : new Error(String(error)));
    setLoading(false);
  }, []);

  /**
   * 命題を取得する
   */
  const fetchProposition = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProposition(id);
      setProposition(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * 新しい命題を作成する
   */
  const createNewProposition = useCallback(async (text: string, concepts: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const newProposition = await createProposition({
        text,
        concepts,
        structure: {},
        validity: {},
        timestamp: new Date(),
      });
      setProposition(newProposition);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * 既存の命題を更新する
   */
  const updateExistingProposition = useCallback(async (id: string, updates: Partial<Proposition>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProposition = await updateProposition(id, updates);
      setProposition(updatedProposition);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * 命題を削除する
   */
  const deleteExistingProposition = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteProposition(id);
      setProposition(null);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * 命題の状態をクリアする
   */
  const clearProposition = useCallback(() => {
    setProposition(null);
    setError(null);
    setLoading(false);
  }, []);

  // クリーンアップ処理
  useEffect(() => {
    return () => {
      clearProposition();
    };
  }, [clearProposition]);

  return {
    proposition,
    loading,
    error,
    createNewProposition,
    updateExistingProposition,
    deleteExistingProposition,
    fetchProposition,
    clearProposition,
  };
};

export default useProposition;
const MyComponent = () => {
  const {
    proposition,
    loading,
    error,
    fetchProposition
  } = useProposition();

  useEffect(() => {
    fetchProposition('some-id');
  }, [fetchProposition]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!proposition) return <div>No proposition found</div>;

  return <div>{proposition.text}</div>;
};