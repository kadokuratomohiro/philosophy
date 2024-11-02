'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import nlp from 'compromise';
import CryptoJS from 'crypto-js';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getExperiment } from '@/lib/api/experiment';
import { sanitizeHtml } from '@/utils/security';
import { useCustomDictionary } from '@/hooks/useCustomDictionary';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { ExperimentType } from '@/types/experiment';

// CSRFトークンの取得
const getCsrfToken = () => document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

interface ExperimentViewProps {
  experimentId: string;
  locale?: string;
}

const ExperimentView: React.FC<ExperimentViewProps> = ({ experimentId, locale = 'en' }) => {
  const { t } = useTranslation('experiment');
  const theme = useTheme();
  const [experiment, setExperiment] = useState<ExperimentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { dictionary, addToDictionary } = useCustomDictionary();
  const { db } = useIndexedDB('experiments');

  // 暗号化キー
  const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  // 実験データの取得と処理
  useEffect(() => {
    const fetchExperiment = async () => {
      try {
        setLoading(true);
        const response = await getExperiment(experimentId, {
          headers: {
            'X-CSRF-Token': getCsrfToken() || '',
            'Accept-Language': locale,
          }
        });

        // データの復号化
        const decryptedData = CryptoJS.AES.decrypt(
          response.data,
          ENCRYPTION_KEY as string
        ).toString(CryptoJS.enc.Utf8);

        const experimentData = JSON.parse(decryptedData);

        // 自然言語処理の最適化
        const doc = nlp(experimentData.description);
        const processedDescription = doc.normalize().out('text');

        // カスタム辞書の適用
        const enrichedDescription = dictionary.reduce((desc, term) => {
          return desc.replace(new RegExp(term.word, 'gi'), term.definition);
        }, processedDescription);

        setExperiment({
          ...experimentData,
          description: enrichedDescription,
        });

        // IndexedDBへの保存
        await db?.put('experiments', {
          id: experimentId,
          data: experimentData,
          timestamp: Date.now(),
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiment();
  }, [experimentId, locale, dictionary, db]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{t('error.loading')}: {error}</Typography>
      </Box>
    );
  }

  if (!experiment) {
    return (
      <Box p={3}>
        <Typography>{t('error.notFound')}</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        m: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {sanitizeHtml(experiment.title)}
      </Typography>

      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {t('author')}: {sanitizeHtml(experiment.author)}
      </Typography>

      <Box my={3}>
        <Typography variant="body1" component="div">
          {sanitizeHtml(experiment.description)}
        </Typography>
      </Box>

      {experiment.conclusions && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            {t('conclusions')}
          </Typography>
          <Typography variant="body1">
            {sanitizeHtml(experiment.conclusions)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ExperimentView;