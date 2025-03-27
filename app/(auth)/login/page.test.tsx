import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { loginWithEmailAndPassword } from '@/lib/auth';
import RegisterPage from './page';

jest.mock('@/lib/auth');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true })
  }
}));

describe('登入頁面', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. 測試表單驗證
  describe('表單驗證', () => {
    test('驗證必填欄位', async () => {
      render(<RegisterPage />);
      const submitButton = screen.getByRole('button', { name: '登入' });
      
      fireEvent.click(submitButton);
      expect(await screen.findByText('請輸入電子郵件')).toBeInTheDocument();
      expect(await screen.findByText('請輸入密碼')).toBeInTheDocument();
    });
  });

  // 2. 測試登入功能
  describe('登入功能', () => {
    test('驗證登入成功處理', async () => {
      render(<RegisterPage />);
      const user = userEvent.setup();
      (loginWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ code: 'SUCCESS' });

      await userEvent.type(screen.getByPlaceholderText('請輸入E-mail'), 'test@example.com');
      await userEvent.type(screen.getByPlaceholderText('請輸入密碼'), 'password123');

      await user.click(screen.getByRole('button', { name: '登入' }));
      expect(await screen.findByText('歡迎回來')).toBeInTheDocument();
    });

    test('驗證登入失敗處理', async () => {
      render(<RegisterPage />);
      const user = userEvent.setup();
      (loginWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        code: 'ERROR',
        error: {
          code: 'auth/email-already-in-use',
          message: '登入失敗'
        }
      });

      await user.type(screen.getByPlaceholderText('請輸入E-mail'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('請輸入密碼'), 'password123');

      await user.click(screen.getByRole('button', { name: '登入' }));
      expect(await screen.findByTestId('error-msg')).toBeInTheDocument();
    });
  });
});
