'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Alert,
} from '@mui/material';

const categories = [
  { value: 'general', label: '一般' },
  { value: 'tech', label: 'テクノロジー' },
  { value: 'business', label: 'ビジネス' },
  { value: 'lifestyle', label: 'ライフスタイル' },
  { value: 'other', label: 'その他' },
];

interface PostFormProps {
  onPostCreated: () => void;
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    category: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('投稿に失敗しました');
      }

      setSuccess(true);
      setFormData({
        name: '',
        title: '',
        content: '',
        category: 'general',
      });
      onPostCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        新規投稿
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>投稿が完了しました！</Alert>}
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="お名前"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          margin="normal"
          inputProps={{ maxLength: 60 }}
        />
        
        <TextField
          fullWidth
          label="タイトル"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          margin="normal"
          inputProps={{ maxLength: 200 }}
        />
        
        <TextField
          fullWidth
          label="本文"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          multiline
          rows={4}
          margin="normal"
          inputProps={{ maxLength: 2000 }}
        />
        
        <TextField
          fullWidth
          select
          label="カテゴリー"
          name="category"
          value={formData.category}
          onChange={handleChange}
          margin="normal"
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </Button>
      </Box>
    </Paper>
  );
}