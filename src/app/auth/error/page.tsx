'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return 'サーバーの設定に問題があります。管理者に連絡してください。';
      case 'AccessDenied':
        return 'アクセスが拒否されました。';
      case 'Verification':
        return 'メールアドレスの確認が必要です。';
      case 'Default':
      default:
        return 'ログイン中にエラーが発生しました。もう一度お試しください。';
    }
  };

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
          <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 3 }} />
          <Typography component="h1" variant="h5" gutterBottom>
            認証エラー
          </Typography>
          
          <Alert severity="error" sx={{ mt: 2, mb: 3 }}>
            {getErrorMessage()}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              component={Link}
              href="/auth/signin"
            >
              ログインページへ
            </Button>
            <Button
              variant="outlined"
              component={Link}
              href="/auth/signup"
            >
              新規登録
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}