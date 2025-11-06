import { useState, useEffect } from 'react';

// Define the theme type
type Theme = 'light' | 'dark';

export const ThemeToggle = () => {
    // 1. Get initial theme from localStorage or OS preference
    const getInitialTheme = (): Theme => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedPrefs = window.localStorage.getItem('theme');
            if (typeof storedPrefs === 'string') {
                return storedPrefs as Theme;
            }

            const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
            if (userMedia.matches) {
                return 'dark';
            }
        }
        return 'light'; // default
    };

    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    // 2. Handle theme changes
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // 3. Apply theme to <html> tag and save to localStorage
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove old theme and add new one
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);

        // Set data-theme attribute for SCSS override
        root.setAttribute('data-theme', theme);

        // Save preference to localStorage
        window.localStorage.setItem('theme', theme);
    }, [theme]);

    // Use Bulma classes for the button
    return (
        <button
            className="button is-primary is-outlined"
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
        >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
    );
};