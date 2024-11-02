import { useState, useCallback, useEffect } from 'react';
import { 
  getProposition, 
  createProposition, 
  updateProposition, 
  deleteProposition 
} from '../api/proposition';
import { Proposition, ValidationResult } from '../../types';

interface UsePropositionReturn {
  proposition: Proposition | null;
  loading: boolean;
  error: Error | null;
  createNewProposition: (text: string) => Promise<void>;
  updateExistingProposition: (id: string, updates: Partial<Proposition>) => Promise<void>;
  removeProposition: (id: string) => Promise<void>;
  validateProposition: (text: string) => Promise<ValidationResult>;
}

/**
 * カスタムフック: 命題の管理と操作を行う
 * @param initialId - 初期表示する命題のID (オプション)
 * @returns 命題関連の状態と操作メソッド
 */
export const useProposition = (initialId?: string): UsePropositionReturn => {
  const [proposition, setProposition] = useState<Proposition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 命題の取得
  const fetchProposition = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const data = await getProposition(id);
      setProposition(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch proposition'));
      setProposition(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初期IDが与えられた場合の初期読み込み
  useEffect(() => {
    if (initialId) {
      fetchProposition(initialId);
    }
  }, [initialId, fetchProposition]);

  // 新規命題の作成
  const createNewProposition = async (text: string) => {
    try {
      setLoading(true);
      const newProposition = await createProposition({ text });
      setProposition(newProposition);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create proposition'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 命題の更新
  const updateExistingProposition = async (id: string, updates: Partial<Proposition>) => {
    try {
      setLoading(true);
      const updatedProposition = await updateProposition(id, updates);
      setProposition(updatedProposition);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update proposition'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 命題の削除
  const removeProposition = async (id: string) => {
    try {
      setLoading(true);
      await deleteProposition(id);
      setProposition(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete proposition'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 命題の妥当性検証
  const validateProposition = async (text: string): Promise<ValidationResult> => {
    try {
      setLoading(true);
      // Note: この部分は実際のAPIエンドポイントに合わせて実装する必要があります
      const validation: ValidationResult = {
        isValid: true,
        issues: [],
        suggestions: []
      };
      return validation;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to validate proposition'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    proposition,
    loading,
    error,
    createNewProposition,
    updateExistingProposition,
    removeProposition,
    validateProposition
  };
};
const {
  proposition,
  loading,
  error,
  createNewProposition
} = useProposition();

// 新しい命題を作成
await createNewProposition("すべての人間は死すべき存在である");