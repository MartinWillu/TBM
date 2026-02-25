import { useEffect, useState } from "react";
import { type Theme, Themes } from "../types";
import "./Styles/ThemeToggle.css";

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem("theme");
        return (saved === Themes.Light) ? Themes.Light : Themes.Dark;
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === Themes.Dark ? Themes.Light : Themes.Dark));
    };

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            title={theme === Themes.Dark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {theme === Themes.Dark ? "☀" : "⏾"}
        </button>
    );
}
