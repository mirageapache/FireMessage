"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Bounce, ToastContainer, ToastPosition } from "react-toastify";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const reduxDarkMode = useSelector((state: RootState) => state.system.userSettings.darkMode);
  const position = useSelector(
    (state: RootState) => state.system.userSettings.toastifyPosition,
  ) as ToastPosition;
  const localDarkMode = localStorage.getItem("darkMode");
  const darkMode = localDarkMode || reduxDarkMode;

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="text-[var(--text-color)]">
      {children}
      <ToastContainer
        position={position}
        theme={darkMode === "dark" ? "dark" : "light"}
        autoClose={3000}
        pauseOnFocusLoss={false}
        transition={Bounce}
        hideProgressBar
      />
    </div>
  );
}
