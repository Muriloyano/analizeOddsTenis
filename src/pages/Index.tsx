// Em: src/pages/Index.tsx
import { useState, useEffect } from "react";
// Nossos componentes
import { MatchSimulator, SimulationData } from "@/components/MatchSimulator";
import { MatchResult, AnalysisResult } from "@/components/MatchResult";
// Ferramentas
import { toast } from "sonner";

// Define o tipo de dados vindo da API
type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};

// --- Funções de Cálculo (Mantemos sua lógica aqui) ---
const calculateEloProbs = (elo1: number, elo2: number) => {
  const eloDiff = elo1 - elo2;
  const prob1 = 1 / (1 + Math.pow(10, -eloDiff / 400));
  const prob2 = 1 - prob1;
  return { prob1: prob1 * 100, prob2: prob2 * 100 };
};

const calculateEV = (probability: number, odds: number) => {
  return ((probability / 100) * odds - 1) * 100;
};

const getRecommendation = (ev1: number, ev2: number, player1: string, player2: string) => {
  const threshold = 5; // 5% EV threshold
  
  if (ev1 > threshold && ev1 > ev2) {
    return `✓ Aposta de VALOR identificada em ${player1}. O Expected Value positivo de ${ev1.toFixed(2)}% indica que as odds estão favoráveis.`;
  } else if (ev2 > threshold && ev2 > ev1) {
    return `✓ Aposta de VALOR identificada em ${player2}. O Expected Value positivo de ${ev2.toFixed(2)}% indica que as odds estão favoráveis.`;
  } else if (ev1 < 0 && ev2 < 0) {
    return `✗ Nenhuma aposta de valor identificada. Ambos os jogadores apresentam Expected Value negativo.`;
  } else {
    const betterPlayer = ev1 > ev2 ? player1 : player2;
    const betterEV = Math.max(ev1, ev2);
    return `${betterPlayer} apresenta melhor EV (${betterEV.toFixed(2)}%), mas está abaixo do limiar ideal (${threshold}%). Considere com cautela.`;
  }
};
// --- Fim das Funções de Cálculo ---


// --- Componente Principal da Página ---
const Index = () => {
  // --- Estados ---
  const [ranking, setRanking] = useState<JogadorElo[]>([]); // Guarda o ranking da API
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  const [isLoadingData, setIsLoadingData] = useState(true); // "Carregando ranking..."
  const [isCalculating, setIsCalculating] = useState(false); // "Calculando aposta..."
  const [error, setError] = useState<string | null>(null);

  // --- Efeito para buscar o Ranking da API (Roda 1 vez) ---
  useEffect(() => {
    async function fetchRanking() {
      try {
        setError(null);
        // Chama nossa API de web scraping!
        const response = await fetch('/api/ranking-semanal');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Falha ao carregar ranking da API');
        }
        
        setRanking(data.ranking); // Salva a lista de jogadores no estado
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoadingData(false); // Para de carregar
      }
    }

    fetchRanking();
  }, []); // O array vazio [] faz isso rodar só uma vez

  // --- Função que o Simulador vai chamar ---
  // Note como ela é mais simples: não lê mais arquivos!
  const handleSimulate = (data: SimulationData) => {
    setIsCalculating(true);
    setResult(null);

    try {
      // Pega os dados que o MatchSimulator já enviou
      const { prob1, prob2 } = calculateEloProbs(data.elo1, data.elo2);
      const ev1 = calculateEV(prob1, data.odds1);
      const ev2 = calculateEV(prob2, data.odds2);

      const analysisResult: AnalysisResult = {
        player1: data.player1,
        player2: data.player2,
        elo1: data.elo1,
        elo2: data.elo2,
        prob1,
        prob2,
        ev1,
        ev2,
        odds1: data.odds1,
        odds2: data.odds2,
        recommendation: getRecommendation(ev1, ev2, data.player1, data.player2),
      };

      setResult(analysisResult);
      toast.success("Análise (com Elo automático) concluída!");

    } catch (error: any) {
      toast.error(error.message || "Erro desconhecido na simulação.");
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  const handleBack = () => {
    setResult(null);
  };

  // --- Renderização ---
  
  // Função helper para decidir o que mostrar
  const renderContent = () => {
    if (isLoadingData) {
      return <div className="p-4 text-center text-white">Carregando ranking de jogadores...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-400">Erro ao carregar dados: {error}</div>;
    }
    
    // Se não tiver resultado, mostra o Simulador
    if (!result) {
      return (
        <MatchSimulator 
          onSimulate={handleSimulate} 
          ranking={ranking} // Passa o ranking da API para o simulador
          isLoading={isCalculating}
        />
      );
    }

    // Se tiver resultado, mostra o Resultado
    return (
      <MatchResult result={result} onBack={handleBack} />
    );
  };

  return (
    // 1. Fundo Global: Usar bg-gray-950 (quase preto)
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden"> 
      
      {/* 2. Círculo de Degrade Verde no Canto Superior Esquerdo */}
      <div className="absolute top-0 left-0 w-96 h-96 blur-3xl opacity-30 z-0 pointer-events-none">
          <div className="w-full h-full rounded-full bg-green-500/50 transform translate-x-[-50%] translate-y-[-50%]"></div>
      </div>
      
      {/* 3. Container Principal (z-10 para ficar acima do degrade) */}
      <div className="container max-w-2xl mx-auto px-4 py-8 md:py-12 relative z-10">
        {renderContent()}
      </div>
      
      {/* 4. Decorative elements antigos (pode remover, se quiser) */}
      {/* ... (decorative elements antigos) ... */}

    </div>
  );
};

export default Index;