// Em: src/App.tsx (CÓDIGO FINAL DE ROTEADOR E AUTENTICAÇÃO COM TEMA)

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react'; 

// Importa contextos e componentes de rotas
import { AuthProvider } from "./contexts/AuthContext"; 
import { ThemeProvider } from "./contexts/ThemeContext"; // <- Importa o provedor de tema
import { PrivateRoute } from "./components/PrivateRoute"; 
import Index from "./pages/Index"; 
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";      
import Cadastro from "./pages/Cadastro";  
import ResultsPage from "./pages/results"; 

const queryClient = new QueryClient();

// O componente principal da aplicação
const App = () => (
  // 1. AuthProvider e ThemeProvider envolvem tudo
  <AuthProvider> 
    <ThemeProvider> {/* ADICIONADO: Provedor de Tema */}
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <Routes>
              {/* --- ROTAS PÚBLICAS --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              
              {/* --- ROTAS PROTEGIDAS (Simulador) --- */}
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
    </ThemeProvider> {/* FECHAMENTO ADICIONADO */}
  </AuthProvider>
);

export default App;