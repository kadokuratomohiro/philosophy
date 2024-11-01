import { useState, useCallback, useMemo } from 'react';
import { fetchVisualizationData, updateVisualizationLayout } from '../api/visualization';
import { useToast } from './useToast';

interface VisualizationNode {
  id: string;
  label: string;
  type: 'concept' | 'proposition' | 'experiment';
  data?: any;
}

interface VisualizationEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface VisualizationLayout {
  nodes: VisualizationNode[];
  edges: VisualizationEdge[];
}

interface UseVisualizationOptions {
  initialLayout?: VisualizationLayout;
  autoLayout?: boolean;
  layoutType?: 'tree' | 'force' | 'dagre';
}

export const useVisualization = (options: UseVisualizationOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [layout, setLayout] = useState<VisualizationLayout>(
    options.initialLayout || { nodes: [], edges: [] }
  );
  const { showToast } = useToast();

  // レイアウトの更新を処理
  const updateLayout = useCallback(async (newLayout: VisualizationLayout) => {
    try {
      setLoading(true);
      const updatedLayout = await updateVisualizationLayout(newLayout);
      setLayout(updatedLayout);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update layout'));
      showToast({ type: 'error', message: 'Failed to update visualization layout' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // 新しいノードの追加
  const addNode = useCallback((node: VisualizationNode) => {
    setLayout(prev => ({
      ...prev,
      nodes: [...prev.nodes, node]
    }));
  }, []);

  // ノードの削除
  const removeNode = useCallback((nodeId: string) => {
    setLayout(prev => ({
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      edges: prev.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    }));
  }, []);

  // エッジの追加
  const addEdge = useCallback((edge: VisualizationEdge) => {
    setLayout(prev => ({
      ...prev,
      edges: [...prev.edges, edge]
    }));
  }, []);

  // エッジの削除
  const removeEdge = useCallback((edgeId: string) => {
    setLayout(prev => ({
      ...prev,
      edges: prev.edges.filter(e => e.id !== edgeId)
    }));
  }, []);

  // レイアウトデータの取得
  const fetchLayout = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      const data = await fetchVisualizationData(params);
      setLayout(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch visualization data'));
      showToast({ type: 'error', message: 'Failed to fetch visualization data' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // メモ化された統計情報
  const statistics = useMemo(() => ({
    nodeCount: layout.nodes.length,
    edgeCount: layout.edges.length,
    density: layout.edges.length / (layout.nodes.length * (layout.nodes.length - 1))
  }), [layout]);

  // エクスポート用のデータ整形
  const exportData = useCallback(() => {
    return JSON.stringify(layout, null, 2);
  }, [layout]);

  return {
    loading,
    error,
    layout,
    statistics,
    updateLayout,
    addNode,
    removeNode,
    addEdge,
    removeEdge,
    fetchLayout,
    exportData
  };
};

export type UseVisualizationType = ReturnType<typeof useVisualization>;