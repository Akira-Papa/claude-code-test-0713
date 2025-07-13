'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import PostForm from '@/components/PostForm';
import PostList from '@/components/PostList';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            みんなの掲示板
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            自由に投稿してください
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <PostForm onPostCreated={handlePostCreated} />
          <PostList refreshTrigger={refreshTrigger} />
        </Box>
      </Container>
    </>
  );
}