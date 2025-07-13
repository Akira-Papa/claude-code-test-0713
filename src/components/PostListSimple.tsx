'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface Post {
  _id: string;
  name: string;
  title: string;
  content: string;
  category: '質問' | '雑談' | 'その他';
  createdAt: string;
}

interface PostListProps {
  posts: Post[];
}

const categoryColors = {
  '質問': 'primary' as const,
  '雑談': 'success' as const,
  'その他': 'default' as const,
};

export default function PostListSimple({ posts }: PostListProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Box>
      <Tabs value={selectedCategory} onChange={handleCategoryChange} sx={{ mb: 3 }}>
        <Tab label="すべて" value="all" />
        <Tab label="質問" value="質問" />
        <Tab label="雑談" value="雑談" />
        <Tab label="その他" value="その他" />
      </Tabs>

      {sortedPosts.length === 0 ? (
        <Alert severity="info">投稿がありません</Alert>
      ) : (
        sortedPosts.map((post) => (
          <Card key={post._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" component="h6">
                  {post.title}
                </Typography>
                <Chip 
                  label={post.category} 
                  size="small" 
                  color={categoryColors[post.category]}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                投稿者: {post.name} | {format(new Date(post.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
              </Typography>
              
              <Typography variant="body1" sx={{ mt: 2 }}>
                {post.content}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}