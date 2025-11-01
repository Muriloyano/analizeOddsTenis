// Em: src/App.tsx (CÓDIGO FINAL DE ROTEADOR E AUTENTICAÇÃO)

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react'; 

// Importa componentes de Autenticação e Rotas
import { AuthProvider } from "./contexts/AuthContext"; // <- Importa o provedor de autenticação
import { PrivateRoute } from "./components/PrivateRoute"; // <- Importa o protetor de rotas
import Index from "./pages/Index"; 
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";      // <- Agora este arquivo existe
import Cadastro from "./pages/Cadastro";  // <- Agora este arquivo existe
import ResultsPage from "./pages/results"; // <- A página de resultados

const queryClient = new QueryClient();

// O componente principal da aplicação, responsável pelo contexto e roteamento
const App = () => (
  // 1. O AuthProvider deve envolver toda a aplicação
  <AuthProvider> 
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <BrowserRouter>
          <Routes>
            {/* --- ROTAS PÚBLICAS (Acesso sem Login) --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            
            {/* --- ROTAS PROTEGIDAS (Simulador - Exige Login) --- */}
            {/* O PrivateRoute verifica se o usuário está autenticado antes de renderizar os filhos */}
            <Route element={<PrivateRoute />}>
               <Route path="/" element={<Index />} /> 
               <Route path="/results" element={<ResultsPage />} /> 
            </Route>
            
            {/* Rota Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;