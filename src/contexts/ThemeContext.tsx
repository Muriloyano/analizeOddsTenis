// Em: src/contexts/ThemeContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Theme = 'dark' | 'light';

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Inicializa o tema lendo o localStorage ou definindo 'dark' como padrão
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('app-theme') as Theme | null;
        return savedTheme || 'dark'; // Dark Mode é o padrão
    });

    // Efeito para salvar o tema no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};