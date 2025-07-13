'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'パスワードリセットに失敗しました');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'パスワードリセットに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center">
            パスワードリセット
          </Typography>

          {!success && (
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              登録されているメールアドレスを入力してください。
              パスワードリセットリンクをお送りします。
            </Typography>
          )}

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          
          {success ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              メールアドレスが登録されている場合、パスワードリセットメールを送信しました。
              メールをご確認ください。
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="メールアドレス"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'リセットリンクを送信'}
              </Button>
            </Box>
          )}

          <Box textAlign="center" sx={{ mt: 2 }}>
            <Link href="/auth/signin" passHref>
              <Button startIcon={<ArrowBackIcon />} size="small">
                ログインページに戻る
              </Button>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}