// Em: src/App.tsx (CORREÇÃO FINAL DE ROTAS)

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react'; 
import Index from "./pages/Index"; 
import NotFound from "./pages/NotFound";
// CORREÇÃO: Importar a página de resultados que está na pasta pages/
import ResultsPage from "./pages/results"; 


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      <BrowserRouter>
        <Routes>
          {/* ROTA PRINCIPAL */}
          <Route path="/" element={<Index />} /> 
          
          {/* ROTA CORRIGIDA: Adiciona o caminho /results */}
          <Route path="/results" element={<ResultsPage />} /> 
          
          {/* Rota Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;