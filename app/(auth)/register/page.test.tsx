import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { registerWithEmailAndPassword } from '@/lib/auth';
import Swal from 'sweetalert2';
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
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

describe('註冊頁面', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. 測試表單驗證
  describe('表單驗證', () => {
    test('驗證必填欄位', async () => {
      render(<RegisterPage />);
      const submitButton = screen.getByRole('button', { name: '註冊' });

      // 直接提交空表單
      fireEvent.click(submitButton);

      // 檢查錯誤訊息
      expect(await screen.findByText('請輸入電子郵件')).toBeInTheDocument();
      expect(await screen.findByText('請輸入密碼')).toBeInTheDocument();
      expect(await screen.findByText('請輸入確認密碼')).toBeInTheDocument();
      expect(await screen.findByText('請輸入名稱')).toBeInTheDocument();
    });

    test('驗證密碼匹配', async () => {
      render(<RegisterPage />);
      const passwordInput = screen.getByPlaceholderText('請輸入密碼');
      const confirmPasswordInput = screen.getByPlaceholderText('請輸入確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      // 輸入不匹配的密碼
      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'password456');
      fireEvent.click(submitButton);

      expect(await screen.findByText('與密碼不一致')).toBeInTheDocument();
    });
  });

  // 2. 測試註冊功能
  describe('註冊功能', () => {
    test('驗證註冊成功處理', async () => {
      render(<RegisterPage />);
      (registerWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ code: 'SUCCESS' });

      await userEvent.type(screen.getByPlaceholderText('請輸入E-mail'), 'test@example.com');
      await userEvent.type(screen.getByPlaceholderText('請輸入密碼'), 'password123');
      await userEvent.type(screen.getByPlaceholderText('請輸入確認密碼'), 'password123');
      await userEvent.type(screen.getByPlaceholderText('請輸入名稱'), 'TestUser');

      fireEvent.click(screen.getByRole('button', { name: '註冊' }));
      await waitFor(() => {
        expect(registerWithEmailAndPassword).toHaveBeenCalledWith(
          'test@example.com',
          'password123',
          'TestUser',
        );
      });
    });

    test('驗證註冊失敗處理', async () => {
      render(<RegisterPage />);
      const user = userEvent.setup();

      // 模擬註冊失敗
      (registerWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        code: 'ERROR',
        error: {
          code: 'auth/email-already-in-use',
          message: '註冊失敗',
        },
      });

      await user.type(screen.getByPlaceholderText('請輸入E-mail'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('請輸入密碼'), 'password123');
      await user.type(screen.getByPlaceholderText('請輸入確認密碼'), 'password123');
      await user.type(screen.getByPlaceholderText('請輸入名稱'), 'TestUser');

      await user.click(screen.getByRole('button', { name: '註冊' }));
      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith(
          expect.objectContaining({
            icon: 'error',
            confirmButtonText: '確定',
          }),
        );
      });
    });
  });
});
