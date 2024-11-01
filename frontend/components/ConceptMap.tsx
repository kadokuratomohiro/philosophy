'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
} from 'react-flow-renderer';
import dagre from 'dagre';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useConcepts } from '@/lib/hooks/useConcepts';
import Loading from '@/components/Common/Loading';
import { Concept } from '@/types/concept';

// スタイル付きコンポーネント
const ConceptMapWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '600px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: {
    height: '800px',
  },
}));

// ノードの配置を計算するための設定
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 200;
const nodeHeight = 100;

// ノードとエッジの配置を計算する関数
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  dagreGraph.setGraph({ rankdir: 'TB' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const ConceptMap: React.FC = () => {
  const theme = useTheme();
  const { concepts, isLoading, error } = useConcepts();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 概念データからノードとエッジを生成
  const createGraphElements = useCallback((concepts: Concept[]) => {
    const nodes = concepts.map((concept) => ({
      id: concept.id,
      type: 'default',
      data: { label: concept.name },
      position: { x: 0, y: 0 },
    }));

    const edges = concepts.flatMap((concept) =>
      concept.relatedConcepts.map((relatedId) => ({
        id: `${concept.id}-${relatedId}`,
        source: concept.id,
        target: relatedId,
        type: 'smoothstep',
      }))
    );

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

  useEffect(() => {
    if (concepts) {
      createGraphElements(concepts);
    }
  }, [concepts, createGraphElements]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading concepts</div>;

  return (
    <ConceptMapWrapper>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionMode={ConnectionMode.STRICT}
        fitView
        attributionPosition="bottom-right"
      >
        <Background
          color={theme.palette.text.secondary}
          gap={16}
          size={1}
        />
        <Controls />
      </ReactFlow>
    </ConceptMapWrapper>
  );
};

export default ConceptMap;
// 親コンポーネントでの使用例
import ConceptMap from '@/components/ConceptMap';

const ConceptPage = () => {
  return (
    <div>
      <h1>Concept Map</h1>
      <ConceptMap />
    </div>
  );
};