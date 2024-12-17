'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { useAppDispatch } from '@/store/hooks';
import { setUser, setLoading } from '@/store/authSlice';

// 客戶端元件：監聽 Firebase 認證狀態
function AuthStateListener({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(setUser(currentUser));
      dispatch(setLoading(false));
    });

    // 取消訂閱
    return () => unsubscribe();
  }, [dispatch]);

  return children;
}

// Providers 元件
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthStateListener>{children}</AuthStateListener>
      </PersistGate>
    </Provider>
  );
}
