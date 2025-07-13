'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'プロフィールの更新に失敗しました');
      }

      setSuccess('プロフィールを更新しました');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロフィールの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('新しいパスワードが一致しません');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('パスワードは6文字以上である必要があります');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'パスワードの変更に失敗しました');
      }

      setSuccess('パスワードを変更しました');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'パスワードの変更に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography component="h1" variant="h4">
            プロフィール
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleUpdateProfile}>
          <Typography variant="h6" gutterBottom>
            基本情報
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="名前"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            label="メールアドレス"
            value={formData.email}
            disabled
            helperText="メールアドレスは変更できません"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            プロフィールを更新
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box component="form" onSubmit={handleChangePassword}>
          <Typography variant="h6" gutterBottom>
            パスワード変更
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="現在のパスワード"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            label="新しいパスワード"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            label="新しいパスワード（確認）"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
          >
            パスワードを変更
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}