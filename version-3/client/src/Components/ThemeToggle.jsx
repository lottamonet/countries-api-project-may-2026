import React from "react";
import { useTheme } from "./ThemeContext";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(prev => !prev)}
      />
      <span className="slider round"></span>
    </label>
  );
}

export default ThemeToggle;
