'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Divider,
} from '@mui/material';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    const reset = searchParams.get('reset');
    const callbackUrl = searchParams.get('callbackUrl');
    
    if (reset === 'success') {
      setInfo('パスワードが正常にリセットされました。新しいパスワードでログインしてください。');
    }
    
    if (callbackUrl) {
      setInfo('続行するにはログインが必要です。');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        const callbackUrl = searchParams.get('callbackUrl') || '/';
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('ログインに失敗しました');
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
            ログイン
          </Typography>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {info && <Alert severity="info" sx={{ mt: 2 }}>{info}</Alert>}

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
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'ログイン'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Link href="/auth/forgot-password" passHref>
                <Typography variant="body2" component="a" sx={{ cursor: 'pointer' }}>
                  パスワードを忘れた方はこちら
                </Typography>
              </Link>
            </Box>

            <Divider sx={{ my: 2 }}>または</Divider>

            <Box textAlign="center">
              <Link href="/auth/signup" passHref>
                <Typography variant="body2" component="a" sx={{ cursor: 'pointer' }}>
                  新規登録はこちら
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}