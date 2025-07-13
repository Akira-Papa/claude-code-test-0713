import { render, screen } from '@testing-library/react';
import PostForm from '../PostForm';

describe('PostForm', () => {
  const mockOnPostCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('フォームが正しくレンダリングされる', () => {
    render(<PostForm onPostCreated={mockOnPostCreated} />);
    
    // ヘッダーが表示される
    expect(screen.getByText('新規投稿')).toBeInTheDocument();
    
    // 入力フィールドが存在する（日本語のラベルで確認）
    expect(screen.getByRole('textbox', { name: 'お名前' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'タイトル' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '本文' })).toBeInTheDocument();
    
    // カテゴリー選択が存在する
    expect(screen.getByRole('combobox', { name: 'カテゴリー' })).toBeInTheDocument();
    
    // 投稿ボタンが存在する
    expect(screen.getByRole('button', { name: '投稿する' })).toBeInTheDocument();
  });
});