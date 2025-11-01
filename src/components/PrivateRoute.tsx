// Em: src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // CORRIGIDO: O caminho agora está certo

export const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    
    // Se não estiver autenticado, redireciona para a página de login
    // 'replace' evita que o usuário volte para a rota protegida pelo botão "Voltar"
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
