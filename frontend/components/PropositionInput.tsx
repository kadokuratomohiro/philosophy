'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Paper, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { useProposition } from '@/lib/hooks/useProposition';
import { submitProposition } from '@/lib/api/proposition';
import type { Proposition } from '@/types/Proposition';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.grey[900] 
    : theme.palette.grey[50],
}));

interface PropositionFormData {
  id: string;
  text: string;
}

export default function PropositionInput() {
  const theme = useTheme();
  const { propositions, setPropositions, validateProposition } = useProposition();
  const [formData, setFormData] = useState<PropositionFormData[]>([
    { id: '1', text: '' }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // リアルタイムバリデーション
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    formData.forEach((prop) => {
      if (prop.text.trim() === '') {
        newErrors[prop.id] = '命題を入力してください';
      } else if (prop.text.length > 500) {
        newErrors[prop.id] = '命題は500文字以内で入力してください';
      } else {
        const validationResult = validateProposition(prop.text);
        if (!validationResult.isValid) {
          newErrors[prop.id] = validationResult.message;
        }
      }
    });
    setErrors(newErrors);
  }, [formData, validateProposition]);

  // 命題フィールドの追加
  const handleAddProposition = () => {
    setFormData([
      ...formData,
      { id: `${formData.length + 1}`, text: '' }
    ]);
  };

  // 命題フィールドの削除
  const handleRemoveProposition = (id: string) => {
    if (formData.length > 1) {
      setFormData(formData.filter(prop => prop.id !== id));
    }
  };

  // 命題テキストの更新
  const handleTextChange = (id: string, value: string) => {
    setFormData(formData.map(prop => 
      prop.id === id ? { ...prop, text: value } : prop
    ));
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const propositionData: Partial<Proposition>[] = formData.map(prop => ({
        text: prop.text,
        concepts: [], // APIで解析される
        timestamp: new Date(),
      }));

      const response = await submitProposition(propositionData);
      setPropositions([...propositions, ...response]);
      
      // フォームのリセット
      setFormData([{ id: '1', text: '' }]);
    } catch (error) {
      console.error('Error submitting propositions:', error);
    }
  };

  return (
    <StyledPaper 
      component="form" 
      onSubmit={handleSubmit}
      elevation={2}
      role="form"
      aria-label="命題入力フォーム"
    >
      <Stack spacing={3}>
        <Typography variant="h6" component="h2">
          命題入力
        </Typography>
        
        {formData.map((prop) => (
          <Stack 
            key={prop.id} 
            direction="row" 
            spacing={2} 
            alignItems="center"
          >
            <TextField
              fullWidth
              multiline
              rows={2}
              label={`命題 ${prop.id}`}
              value={prop.text}
              onChange={(e) => handleTextChange(prop.id, e.target.value)}
              error={!!errors[prop.id]}
              helperText={errors[prop.id]}
              aria-label={`命題 ${prop.id} 入力フィールド`}
            />
            {formData.length > 1 && (
              <IconButton
                onClick={() => handleRemoveProposition(prop.id)}
                aria-label="命題を削除"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>
        ))}

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddProposition}
            variant="outlined"
            aria-label="命題を追加"
          >
            命題を追加
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            disabled={Object.keys(errors).length > 0}
            aria-label="命題を解析"
          >
            解析する
          </Button>
        </Stack>
      </Stack>
    </StyledPaper>
  );
}