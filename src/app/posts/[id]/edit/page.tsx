'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { AppBar, Toolbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const categories = [
  { value: 'general', label: '一般' },
  { value: 'tech', label: 'テクノロジー' },
  { value: 'business', label: 'ビジネス' },
  { value: 'lifestyle', label: 'ライフスタイル' },
  { value: 'other', label: 'その他' },
];

interface Post {
  _id: string;
  name: string;
  title: string;
  content: string;
  category: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: PageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    category: 'general',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      const { id } = await params;
      fetchPost(id);
    };
    loadPost();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`);
      
      if (!response.ok) {
        throw new Error('投稿の取得に失敗しました');
      }

      const data = await response.json();
      const post: Post = data.data;
      setFormData({
        name: post.name,
        title: post.title,
        content: post.content,
        category: post.category,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { id } = await params;
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('投稿の更新に失敗しました');
      }

      router.push(`/posts/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の更新に失敗しました');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button
            onClick={async () => {
              const { id } = await params;
              router.push(`/posts/${id}`);
            }}
            startIcon={<ArrowBackIcon />}
            color="inherit"
          >
            詳細に戻る
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            投稿を編集
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          投稿を編集
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
            rows={6}
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

          <Box display="flex" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              fullWidth
            >
              {submitting ? '更新中...' : '更新する'}
            </Button>
            <Button
              onClick={async () => {
                const { id } = await params;
                router.push(`/posts/${id}`);
              }}
              variant="outlined"
              fullWidth
              disabled={submitting}
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
    </>
  );
}