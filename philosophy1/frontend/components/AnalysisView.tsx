'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'next-i18next';
import nlp from 'compromise';
import CryptoJS from 'crypto-js';
import { LogicTree } from './LogicTree';
import { ConceptMap } from './ConceptMap';
import { ValidityChecker } from './ValidityChecker';
import { Loading } from './Common/Loading';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { useSanitizer } from '../hooks/useSanitizer';
import { useEncryption } from '../hooks/useEncryption';

// 型定義
interface Proposition {
  id: string;
  text: string;
  structure: LogicalStructure;
  concepts: Concept[];
  validity: ValidationResult;
}

interface LogicalStructure {
  subject: string;
  predicate: string;
  modifiers: string[];
  relations: Relation[];
}

interface Concept {
  id: string;
  name: string;
  definition: string;
  relatedConcepts: string[];
  userDefined: boolean;
}

interface ValidationResult {
  isValid: boolean;
  issues: Issue[];
  suggestions: string[];
}

interface AnalysisViewProps {
  propositionId: string;
  initialData?: Proposition;
  customDictionary?: Record<string, string>;
  onAnalysisComplete?: (result: ValidationResult) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({
  propositionId,
  initialData,
  customDictionary,
  onAnalysisComplete,
}) => {
  const theme = useTheme();
  const { t } = useTranslation('analysis');
  const { sanitizeHtml } = useSanitizer();
  const { encryptData, decryptData } = useEncryption();
  const { getItem, setItem } = useIndexedDB('analysis-results');

  const [proposition, setProposition] = useState<Proposition | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  // カスタム辞書の初期化
  useEffect(() => {
    if (customDictionary) {
      nlp.extend((Doc, world) => {
        world.addWords(customDictionary);
      });
    }
  }, [customDictionary]);

  // 分析データの取得
  const fetchAnalysisData = useCallback(async () => {
    try {
      setLoading(true);
      // IndexedDBからの暗号化されたデータの取得
      const encryptedData = await getItem(propositionId);
      if (encryptedData) {
        const decryptedData = decryptData(encryptedData);
        setProposition(JSON.parse(decryptedData));
      } else {
        // APIからのデータ取得
        const response = await fetch(`/api/analysis/${propositionId}`, {
          headers: {
            'CSRF-Token': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
          },
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch analysis data');
        
        const data = await response.json();
        const sanitizedData = sanitizeHtml(data);
        setProposition(sanitizedData);
        
        // 暗号化してIndexedDBに保存
        const encryptedResult = encryptData(JSON.stringify(sanitizedData));
        await setItem(propositionId, encryptedResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [propositionId, getItem, setItem, encryptData, decryptData, sanitizeHtml]);

  useEffect(() => {
    fetchAnalysisData();
  }, [fetchAnalysisData]);

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!proposition) return <Typography>{t('no_data_found')}</Typography>;

  return (
    <Box
      component="section"
      sx={{
        padding: theme.spacing(3),
        display: 'grid',
        gap: theme.spacing(3),
        gridTemplateColumns: {
          xs: '1fr',
          md: '1fr 1fr',
          lg: '2fr 1fr 1fr',
        },
      }}
    >
      <Paper
        elevation={2}
        sx={{ padding: theme.spacing(2) }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {t('logical_structure')}
        </Typography>
        <LogicTree structure={proposition.structure} />
      </Paper>

      <Paper
        elevation={2}
        sx={{ padding: theme.spacing(2) }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {t('concept_map')}
        </Typography>
        <ConceptMap concepts={proposition.concepts} />
      </Paper>

      <Paper
        elevation={2}
        sx={{ padding: theme.spacing(2) }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {t('validity_analysis')}
        </Typography>
        <ValidityChecker
          validity={proposition.validity}
          onValidationComplete={onAnalysisComplete}
        />
      </Paper>
    </Box>
  );
};

export default AnalysisView;