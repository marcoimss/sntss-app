import React, { createContext, useState, useContext } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: typeof darkTheme;
}

// 🌙 MODO OSCURO 
const darkTheme = {
    background: 'rgba(20, 40, 60, 0.9)', 
    textPrimary: '#ffffff',
    textSecondary: '#e0f2fe',
    card: 'rgba(35, 55, 75, 0.85)', 
    cardAccent: '#003c82',
    circle1: '#003c82',
    circle2: '#00a8ff',
    circle3: '#1B476A',
    // bottomTab: '#1e3a5f', // BARRA INFERIOR OSCURO
    bottomTab: 'rgba(30, 58, 95, 0.7)', // BARRA INFERIOR TRANSPARENTE
    tabLabel: '#ffffff',
     tabIcon: '#ffffff', // ICON BLANCO
    tabLabelActive: '#ffffff',
    centerTab: '#003c82',
    avatarBorder: '#ffffff',
    particleColors: ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc'],
};


// ☀️ MODO CLARO 
const lightTheme = {
    background: 'hsla(220, 23%, 98%, 0.95)',
    textPrimary: '#1B476A',
    textSecondary: '#003c82',
    card: 'rgba(255, 255, 255, 0.7)', // TRANSLÚCIDO PERFECTO
    cardAccent: '#003c82',
    circle1: '#003c82',
    circle2: '#00a8ff',
    circle3: '#1B476A',
   // bottomTab: '#d4e0f0', // BARRA INFERIOR  CLARO
    bottomTab: 'rgba(212, 224, 240, 0.7)', // BARRA INFERIOR TRANSPARENTE
    tabIcon: '#1B476A',
    tabLabel: '#4a6fa5',
    tabLabelActive: '#003c82',
    centerTab: '#003c82',
    avatarBorder: '#003c82',
    particleColors: ['#1B476A', '#003c82', '#00a8ff', '#4a6fa5'],
};

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => {},
    colors: darkTheme,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('dark');

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const colors = theme === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);