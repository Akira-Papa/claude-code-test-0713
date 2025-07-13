'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
}

const categoryLabels: Record<string, string> = {
  general: '一般',
  tech: 'テクノロジー',
  business: 'ビジネス',
  lifestyle: 'ライフスタイル',
  other: 'その他',
};

interface PostListProps {
  refreshTrigger: number;
}

export default function PostList({ refreshTrigger }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger, selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPosts = async () => {
    setLoading(true);
    setError('');

    try {
      const query = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const response = await fetch(`/api/posts${query}`);
      
      if (!response.ok) {
        throw new Error('投稿の取得に失敗しました');
      }

      const data = await response.json();
      setPosts(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const handleDeleteClick = (postId: string) => {
    setDeleteTargetId(postId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const response = await fetch(`/api/posts/${deleteTargetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('投稿の削除に失敗しました');
      }

      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の削除に失敗しました');
    }
    setDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Tabs
        value={selectedCategory}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        <Tab label="すべて" value="all" />
        <Tab label="一般" value="general" />
        <Tab label="テクノロジー" value="tech" />
        <Tab label="ビジネス" value="business" />
        <Tab label="ライフスタイル" value="lifestyle" />
        <Tab label="その他" value="other" />
      </Tabs>

      {posts.length === 0 ? (
        <Alert severity="info">投稿がありません</Alert>
      ) : (
        posts.map((post) => (
          <Card key={post._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                <Typography variant="h6" component="h3">
                  {post.title}
                </Typography>
                <Chip
                  label={categoryLabels[post.category]}
                  size="small"
                  color="primary"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                投稿者: {post.name} | {format(new Date(post.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 2, 
                  whiteSpace: 'pre-wrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {post.content}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
              <Button
                component={Link}
                href={`/posts/${post._id}`}
                size="small"
                startIcon={<VisibilityIcon />}
              >
                詳細
              </Button>
              <IconButton
                component={Link}
                href={`/posts/${post._id}/edit`}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(post._id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))
      )}

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
    </Box>
  );
}