'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('認証トークンが提供されていません');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error);
        }
      } catch {
        setStatus('error');
        setMessage('メール認証中にエラーが発生しました');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
          {status === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5">
                メールアドレスを確認中...
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                メール認証完了
              </Typography>
              <Alert severity="success" sx={{ mt: 2, mb: 3 }}>
                {message}
              </Alert>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/auth/signin')}
              >
                ログインページへ
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                認証エラー
              </Typography>
              <Alert severity="error" sx={{ mt: 2, mb: 3 }}>
                {message}
              </Alert>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/auth/signup')}
              >
                新規登録ページへ
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}