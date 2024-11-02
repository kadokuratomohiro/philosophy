'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import nlp from 'compromise';
import CryptoJS from 'crypto-js';
import { styled } from '@mui/material/styles';
import {
  TextField,
  Paper,
  Typography,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { submitProposition } from '@/lib/api/proposition';
import { useCustomDictionary } from '@/hooks/useCustomDictionary';
import { useSecureStorage } from '@/hooks/useSecureStorage';
import { sanitizeInput } from '@/utils/security';
import { Proposition, ValidationResult } from '@/types';

// スタイル付きコンポーネント
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const PropositionInput: React.FC = () => {
  const { t } = useTranslation('common');
  const [input, setInput] = useState<string>('');
  const [analysis, setAnalysis] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { dictionary, addToDictionary } = useCustomDictionary();
  const { encryptData, decryptData } = useSecureStorage();

  // 自然言語処理の初期設定
  useEffect(() => {
    // カスタム辞書の登録
    nlp.extend(dictionary);
  }, [dictionary]);

  // 入力の暗号化処理
  const encryptInput = (text: string): string => {
    return CryptoJS.AES.encrypt(text, process.env.NEXT_PUBLIC_ENCRYPTION_KEY!).toString();
  };

  // 入力のバリデーションと解析
  const analyzeProposition = async (text: string) => {
    try {
      setLoading(true);
      setError(null);

      // XSS対策
      const sanitizedText = sanitizeInput(text);
      
      // 自然言語処理
      const doc = nlp(sanitizedText);
      const terms = doc.terms().out('array');
      
      // 暗号化
      const encryptedText = encryptInput(sanitizedText);

      // APIリクエスト
      const response = await submitProposition({
        text: encryptedText,
        structure: {
          subject: terms[0] || '',
          predicate: terms[terms.length - 1] || '',
          modifiers: terms.slice(1, -1),
          relations: [],
        },
        concepts: [],
        _csrf: document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content
      });

      setAnalysis(response.validity);
    } catch (err) {
      setError(t('errors.analysisError'));
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 入力変更ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
  };

  // 入力確定ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await analyzeProposition(input);
    }
  };

  return (
    <StyledPaper elevation={3}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            {t('proposition.input.title')}
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            value={input}
            onChange={handleInputChange}
            label={t('proposition.input.label')}
            placeholder={t('proposition.input.placeholder')}
            variant="outlined"
            disabled={loading}
            aria-label={t('proposition.input.ariaLabel')}
          />

          {loading && (
            <CircularProgress size={24} />
          )}

          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          {analysis && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {analysis.issues.map((issue, index) => (
                <Chip
                  key={index}
                  label={issue}
                  color="warning"
                  size="small"
                />
              ))}
            </Stack>
          )}
        </Stack>
      </form>
    </StyledPaper>
  );
};

export default PropositionInput;