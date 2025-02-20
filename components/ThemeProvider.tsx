'use client';

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ToastContainer } from "react-toastify";

export default function ThemeProvider({
  darkMode, children,
}: {
  darkMode: string, children: React.ReactNode
}) {
  const reduxDarkMode = useSelector((state: RootState) => state.system.userSettings.darkMode);
  const templateDarkMode = darkMode === reduxDarkMode ? darkMode : reduxDarkMode;

  useEffect(() => {
    if (templateDarkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [templateDarkMode]);

  return (
    <div className="text-[var(--text-color)]">
      {children}
      <ToastContainer
        position="top-center"
        theme={darkMode === 'dark' ? 'dark' : 'light'}
        autoClose={3000}
      />
    </div>
  );
}
