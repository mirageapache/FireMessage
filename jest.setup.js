/* eslint-disable no-undef */
import '@testing-library/jest-dom';

// 模擬 Firebase
jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/database');

// 模擬 next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// 模擬 next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// 模擬 Redux store
jest.mock('@/store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector) => {
    const mockState = {
      chat: {
        chatList: [],
        activeChatRoom: null,
      },
      organization: {
        organizationList: [],
      },
      sys: {
        unReadMessageCount: 0,
      },
    };
    return selector(mockState);
  },
}));
