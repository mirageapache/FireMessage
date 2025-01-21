'use client';

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ToastContainer } from "react-toastify";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useSelector((state: RootState) => state.system.userSettings.darkMode);
  useEffect(() => {
    if (darkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="dark">
      {children}
      <ToastContainer
        position="top-center"
        theme={darkMode === 'dark' ? 'dark' : 'light'}
        autoClose={3000}
      />
    </div>
  );
}
