'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { AppBar, Toolbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Post {
  _id: string;
  name: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const categoryLabels: Record<string, string> = {
  general: '一般',
  tech: 'テクノロジー',
  business: 'ビジネス',
  lifestyle: 'ライフスタイル',
  other: 'その他',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
      setPost(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('投稿の削除に失敗しました');
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の削除に失敗しました');
    }
    setDeleteDialogOpen(false);
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

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || '投稿が見つかりません'}</Alert>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          一覧に戻る
        </Button>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackIcon />}
            color="inherit"
          >
            一覧に戻る
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            投稿詳細
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div></div>
        <Box>
          <Button
            component={Link}
            href={`/posts/${post._id}/edit`}
            startIcon={<EditIcon />}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            編集
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
          >
            削除
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Typography variant="h4" component="h1">
            {post.title}
          </Typography>
          <Chip
            label={categoryLabels[post.category]}
            color="primary"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          投稿者: {post.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          投稿日: {format(new Date(post.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
        </Typography>
        {post.updatedAt !== post.createdAt && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            更新日: {format(new Date(post.updatedAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
          </Typography>
        )}

        <Box mt={3}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.content}
          </Typography>
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>投稿を削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この操作は取り消せません。本当に削除してもよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
}