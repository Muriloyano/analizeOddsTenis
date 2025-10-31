// Em: src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react'; // Garante que o React está importado
// IMPORTANTE: Esta linha importa o Index que exportamos como 'export default Index'
import Index from "./pages/Index"; 
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

// O componente principal da aplicação, responsável pelo contexto e roteamento
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toasters de notificação (sonner e react-hot-toast, se estiver usando ambos) */}
      <Toaster />
      <Sonner />
      
      <BrowserRouter>
        <Routes>
          {/* Rota principal que carrega o componente Index.tsx */}
          <Route path="/" element={<Index />} /> 
          {/* Catch-all para rotas não encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;