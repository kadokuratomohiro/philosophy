'use client';

import React, { useEffect } from 'react';
import { Box, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import { visualizeData } from '@/lib/api/visualization';
import { useAnalysis } from '@/lib/hooks/useAnalysis';
import Loading from '@/components/Common/Loading';
import TreeView from '@/components/Visualization/TreeView';
import FlowChart from '@/components/Visualization/FlowChart';
import ConceptNetwork from '@/components/Visualization/ConceptNetwork';
import LogicDiagram from '@/components/Visualization/LogicDiagram';
import Toast from '@/components/Common/Toast';

interface AnalysisViewProps {
  propositionId: string;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ propositionId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data, error, loading } = useAnalysis(propositionId);
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  useEffect(() => {
    if (error) {
      setToastMessage('分析データの取得に失敗しました。');
      setShowToast(true);
    }
  }, [error]);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return null;
  }

  const {
    logicStructure,
    conceptMap,
    validityResults,
    thoughtExperiments
  } = data;

  return (
    <Box
      component="section"
      aria-label="分析結果表示"
      sx={{
        padding: theme.spacing(2),
        width: '100%',
        minHeight: '600px',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: theme.spacing(2),
          mb: theme.spacing(3),
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: theme.spacing(2) }}
        >
          論理構造分析
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(3),
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          }}
        >
          {/* 論理構造の可視化 */}
          <Box sx={{ minHeight: '300px' }}>
            <TreeView data={logicStructure} />
          </Box>

          {/* 概念マップ */}
          <Box sx={{ minHeight: '300px' }}>
            <ConceptNetwork data={conceptMap} />
          </Box>

          {/* フローチャート */}
          <Box sx={{ minHeight: '300px' }}>
            <FlowChart data={validityResults} />
          </Box>

          {/* 論理図 */}
          <Box sx={{ minHeight: '300px' }}>
            <LogicDiagram data={thoughtExperiments} />
          </Box>
        </Box>
      </Paper>

      <Toast
        open={showToast}
        message={toastMessage}
        severity="error"
        onClose={() => setShowToast(false)}
      />
    </Box>
  );
};

// パフォーマンス最適化
export default React.memo(AnalysisView);

// 型定義
export interface AnalysisData {
  logicStructure: any; // 具体的な型は実装に応じて定義
  conceptMap: any;
  validityResults: any;
  thoughtExperiments: any;
}