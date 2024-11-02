import { useState, useEffect, useCallback } from 'react';
import { createExperiment, getExperiment, updateExperiment, deleteExperiment, listExperiments } from '../api/experiment';

export interface Experiment {
  id: string;
  title: string;
  description: string;
  scenario: string;
  variables: {
    name: string;
    value: string;
  }[];
  conclusions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperimentInput {
  title: string;
  description: string;
  scenario: string;
  variables: {
    name: string;
    value: string;
  }[];
}

interface UseExperimentReturn {
  experiments: Experiment[];
  currentExperiment: Experiment | null;
  isLoading: boolean;
  error: Error | null;
  createNewExperiment: (input: ExperimentInput) => Promise<Experiment>;
  fetchExperiment: (id: string) => Promise<void>;
  updateExistingExperiment: (id: string, input: ExperimentInput) => Promise<Experiment>;
  removeExperiment: (id: string) => Promise<void>;
  refreshExperiments: () => Promise<void>;
}

export function useExperiment(): UseExperimentReturn {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 実験一覧を取得
  const refreshExperiments = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await listExperiments();
      setExperiments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch experiments'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初回マウント時に実験一覧を取得
  useEffect(() => {
    refreshExperiments();
  }, [refreshExperiments]);

  // 新規実験を作成
  const createNewExperiment = async (input: ExperimentInput): Promise<Experiment> => {
    try {
      setIsLoading(true);
      const newExperiment = await createExperiment(input);
      setExperiments(prev => [...prev, newExperiment]);
      return newExperiment;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create experiment');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 特定の実験を取得
  const fetchExperiment = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      const experiment = await getExperiment(id);
      setCurrentExperiment(experiment);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch experiment'));
    } finally {
      setIsLoading(false);
    }
  };

  // 実験を更新
  const updateExistingExperiment = async (id: string, input: ExperimentInput): Promise<Experiment> => {
    try {
      setIsLoading(true);
      const updatedExperiment = await updateExperiment(id, input);
      setExperiments(prev => 
        prev.map(exp => exp.id === id ? updatedExperiment : exp)
      );
      if (currentExperiment?.id === id) {
        setCurrentExperiment(updatedExperiment);
      }
      return updatedExperiment;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update experiment');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 実験を削除
  const removeExperiment = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      await deleteExperiment(id);
      setExperiments(prev => prev.filter(exp => exp.id !== id));
      if (currentExperiment?.id === id) {
        setCurrentExperiment(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete experiment'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    experiments,
    currentExperiment,
    isLoading,
    error,
    createNewExperiment,
    fetchExperiment,
    updateExistingExperiment,
    removeExperiment,
    refreshExperiments,
  };
}