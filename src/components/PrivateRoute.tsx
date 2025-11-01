// Em: src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    
    // Se não estiver autenticado, redireciona para a página de login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};