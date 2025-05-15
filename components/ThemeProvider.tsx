"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Bounce, ToastContainer, ToastPosition } from "react-toastify";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const reduxDarkMode = useSelector((state: RootState) => state.system.userSettings.darkMode);
  const localDarkMode = localStorage.getItem("darkMode");
  const darkMode = localDarkMode || reduxDarkMode;
  const reduxPosition = useSelector(
    (state: RootState) => state.system.userSettings.toastifyPosition,
  ) as ToastPosition;
  const localPosition = localStorage.getItem("toastifyPosition") as ToastPosition;
  const position = localPosition || reduxPosition;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <div className="text-[var(--text-color)]">
      {children}
      <ToastContainer
        position={isMobile ? "top-center" : position}
        theme={darkMode === "dark" ? "dark" : "light"}
        autoClose={3000}
        pauseOnFocusLoss={false}
        transition={Bounce}
        hideProgressBar
      />
    </div>
  );
}
