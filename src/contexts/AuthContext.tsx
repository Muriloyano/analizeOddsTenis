// Em: src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    user: { id: string, name: string } | null; 
    login: (userData: { id: string, name: string }) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Estado de autenticação (usamos 'false' como padrão)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ id: string, name: string } | null>(null);

    const login = (userData: { id: string, name: string }) => {
        setIsAuthenticated(true);
        setUser(userData);
        // Lógica futura: salvar token no localStorage
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        // Lógica futura: remover token do localStorage
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};