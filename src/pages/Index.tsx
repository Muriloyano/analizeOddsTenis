// Em: src/pages/Index.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
// Importamos os componentes que agora estão no novo layout
import { MatchSimulator, SimulationData } from "../components/MatchSimulator";
// O MatchResult será simplificado ou removido, então o Index usa a lógica diretamente.
import { TennisCourt } from "../components/TennisCourt";
import { toast } from "sonner"; // Mantido para as mensagens

// --- TIPOS DE DADOS ESTRUTURAIS ---
type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};

// Estrutura completa do resultado final da análise
type AnalysisResult = {
  player1: string;
  player2: string;
  elo1: number;
  elo2: number;
  prob1: number; // Probabilidade (0-100%)
  prob2: number; // Probabilidade (0-100%)
  ev1: number;   // Expected Value (EV)
  ev2: number;   // Expected Value (EV)
  odds1: number;
  odds2: number;
  recommendation: string;
};


// --- FUNÇÕES DE CÁLCULO (Mantidas aqui, pois são a lógica central) ---
const calculateEloProbs = (elo1: number, elo2: number): { prob1: number, prob2: number } => {
  const eloDiff = elo1 - elo2;
  // Fórmula padrão de Elo: 1 / (1 + 10^((R2 - R1) / 400))
  const prob1 = 1 / (1 + Math.pow(10, -eloDiff / 400));
  const prob2 = 1 - prob1;
  // Retorna como fração (0 a 1) para o cálculo do EV
  return { prob1: prob1, prob2: prob2 };
};

const calculateEV = (probability: number, odds: number): number => {
  // Probabilidade deve ser em fração (0 a 1)
  return (probability * odds - 1) * 100; // Retorna em porcentagem
};

const getRecommendation = (ev1: number, ev2: number, player1: string, player2: string): string => {
  const threshold = 5; 
  
  if (ev1 > threshold && ev1 > ev2) {
    return `Aposta de VALOR identificada em ${player1}. O Expected Value positivo de ${ev1.toFixed(2)}% indica que as odds estão favoráveis.`;
  } else if (ev2 > threshold && ev2 > ev1) {
    return `Aposta de VALOR identificada em ${player2}. O Expected Value positivo de ${ev2.toFixed(2)}% indica que as odds estão favoráveis.`;
  } else if (ev1 < 0 && ev2 < 0) {
    return `Nenhuma aposta de valor identificada. Ambos os jogadores apresentam Expected Value negativo.`;
  } else {
    const betterPlayer = ev1 > ev2 ? player1 : player2;
    const betterEV = Math.max(ev1, ev2);
    return `${betterPlayer} apresenta melhor EV (${betterEV.toFixed(2)}%), mas está abaixo do limiar ideal (${threshold}%). Considere com cautela.`;
  }
};
// --- FIM DAS FUNÇÕES DE CÁLCULO ---


// --- COMPONENTE PRINCIPAL (PÁGINA) ---
const Index = () => {
  // --- ESTADOS DE DADOS DA APLICAÇÃO ---
  const [ranking, setRanking] = useState<JogadorElo[]>([]); // Ranking vindo da API
  const [simulationResult, setSimulationResult] = useState<AnalysisResult | null>(null);
  
  // ESTADOS QUE SÃO PASSADOS PARA O MATCHSIMULATOR (BUG FIX)
  const [selectedPlayer1, setSelectedPlayer1] = useState<string>(''); 
  const [selectedPlayer2, setSelectedPlayer2] = useState<string>(''); 
  const [odds1, setOdds1] = useState<string>('');
  const [odds2, setOdds2] = useState<string>('');

  // ESTADOS DE CONTROLE
  const [isLoading, setIsLoading] = useState<boolean>(false); // Para o cálculo
  const [isFetchingRanking, setIsFetchingRanking] = useState<boolean>(true);

  // --- FETCH RANKING (Mantém) ---
  const fetchRanking = useCallback(async () => {
    setIsFetchingRanking(true);
    try {
      const response = await fetch('/api/ranking-semanal');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRanking(data.ranking || []); // Assume que a API retorna { ranking: [...] }
    } catch (error) {
      console.error("Erro ao buscar o ranking:", error);
      toast.error("Erro ao carregar o ranking inicial. Verifique a API.");
    } finally {
      setIsFetchingRanking(false);
    }
  }, []);

  useEffect(() => {
    fetchRanking();
    document.title = "Tennis Match Predictor | Elo Advisor";
  }, [fetchRanking]);

  // --- HANDLE SIMULATE (LÓGICA DE CÁLCULO) ---
  const handleSimulate = useCallback((data: SimulationData) => {
    setIsLoading(true);
    try {
      // 1. Cálculo das Probabilidades (em fração 0-1)
      const { prob1, prob2 } = calculateEloProbs(data.elo1, data.elo2); 
      
      // 2. Cálculo do Expected Value (EV)
      const ev1 = calculateEV(prob1, data.odds1);
      const ev2 = calculateEV(prob2, data.odds2);

      // 3. Geração da Recomendação
      const recommendation = getRecommendation(ev1, ev2, data.player1, data.player2);

      // 4. Salvar o Resultado (Convertendo Probs para %)
      setSimulationResult({
        player1: data.player1,
        player2: data.player2,
        elo1: data.elo1,
        elo2: data.elo2,
        prob1: prob1 * 100, // Salva como %
        prob2: prob2 * 100, // Salva como %
        ev1: ev1,
        ev2: ev2,
        odds1: data.odds1,
        odds2: data.odds2,
        recommendation: recommendation,
      });

      toast.success(`Análise concluída: ${data.player1} vs ${data.player2}`);

    } catch (error) {
      console.error("Erro na simulação:", error);
      toast.error("Erro ao simular a partida. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- FUNÇÃO DO BOTÃO CENTRAL ---
  const handleCentralButtonClick = () => {
    if (!selectedPlayer1 || !selectedPlayer2 || !odds1 || !odds2 || selectedPlayer1 === selectedPlayer2) {
        toast.error("Preencha todos os campos e selecione dois jogadores diferentes.");
        return;
    }
    
    // O Combobox retorna "Nome|Elo". Precisamos desestruturar e limpar:
    const [nome1, elo1Text] = selectedPlayer1.split('|');
    const [nome2, elo2Text] = selectedPlayer2.split('|');
    
    // Limpeza de Odds (ponto/vírgula)
    const rawOdds1 = odds1.replace(',', '.');
    const rawOdds2 = odds2.replace(',', '.');
    
    // Chamada final da simulação
    handleSimulate({
        player1: nome1,
        elo1: parseFloat(elo1Text),
        odds1: parseFloat(rawOdds1),
        player2: nome2,
        elo2: parseFloat(elo2Text),
        odds2: parseFloat(rawOdds2),
    });
  };
  
  // --- FUNÇÃO PARA RENDERIZAR RESULTADOS FLUTUANTES ---
  const renderFloatingResults = useMemo(() => {
    if (!simulationResult) return null;

    const { prob1, prob2, ev1, ev2 } = simulationResult;
    const isPlayer1Value = ev1 > ev2; // Quem tem o melhor EV?

    const EvCard = ({ player, ev, isBest }: { player: string, ev: number, isBest: boolean }) => {
        const colorClass = ev >= 5 ? 'text-green-400' : ev > 0 ? 'text-yellow-400' : 'text-red-400';
        return (
            <div className={`p-3 rounded-lg text-center ${isBest ? 'bg-gray-700/80 border border-indigo-400' : 'bg-gray-700/50'}`}>
                <p className="text-sm font-medium text-gray-400">{player}</p>
                <p className={`text-xl font-bold ${colorClass}`}>{ev.toFixed(2)}% EV</p>
            </div>
        );
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            {/* Resultados de EV Flutuando (Superior Esquerdo e Direito) */}
            <div className="absolute top-20 left-10">
                <EvCard player={simulationResult.player1} ev={ev1} isBest={isPlayer1Value} />
            </div>
            <div className="absolute top-20 right-10">
                <EvCard player={simulationResult.player2} ev={ev2} isBest={!isPlayer1Value} />
            </div>

            {/* Recomendação Final Flutuando no Meio */}
            <div className="absolute bottom-10 w-3/4 max-w-sm p-4 bg-indigo-900/70 border border-indigo-400 rounded-lg pointer-events-auto">
                <p className="text-sm font-semibold text-indigo-200">Recomendação:</p>
                <p className="text-base text-white mt-1">{simulationResult.recommendation}</p>
                <button 
                  onClick={() => setSimulationResult(null)}
                  className="mt-2 text-xs text-indigo-300 hover:text-indigo-100 font-medium"
                >
                  (Nova Análise)
                </button>
            </div>
        </div>
    );
  }, [simulationResult]);


  // --- RENDERIZAÇÃO PRINCIPAL ---
  if (isFetchingRanking) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <p className="text-xl">Carregando rankings e preparando a quadra...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden flex flex-col items-center"> 
      
      {/* Círculo de Degrade Verde (Mantém) */}
      <div className="absolute top-0 left-0 w-96 h-96 blur-3xl opacity-30 z-0 pointer-events-none">
          <div className="w-full h-full rounded-full bg-green-500/50 transform translate-x-[-50%] translate-y-[-50%]"></div>
      </div>
      
      {/* Título Principal no Topo */}
      <div className="w-full text-center py-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-white uppercase tracking-wider">
          Tennis Match Predictor
        </h1>
      </div>

      {/* Container Principal: Jogadores + Quadra */}
      <div className="container max-w-6xl mx-auto px-4 py-4 relative z-10 flex items-start justify-center flex-grow">
        
        {/* Coluna da Esquerda (Simulador Jogador 1) */}
        <div className="flex-1 min-w-0 mr-8 mt-12 self-start"> 
           <MatchSimulator
              ranking={ranking}
              isLoading={isLoading}
              playerNumber={1}
              selectedPlayer={selectedPlayer1}
              onSelectPlayer={setSelectedPlayer1}
              odds={odds1}
              onSetOdds={setOdds1}
              otherPlayerValue={selectedPlayer2}
           />
        </div>

        {/* Quadra de Tênis no Centro (com Resultados) */}
        <div className="flex-shrink-0 relative w-full max-w-2xl">
          
          <TennisCourt />
          
          {/* Barra de Probabilidade (Posicionada na Quadra) */}
          {simulationResult && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5">
              <h4 className="text-lg font-semibold text-gray-300 mb-2 text-center">
                Probabilidade de Vitória (Elo)
              </h4>
              <div className="flex w-full h-8 rounded-lg overflow-hidden shadow-inner">
                {/* Barra do Jogador 1 */}
                <div 
                  style={{ width: `${simulationResult.prob1}%` }} 
                  className="h-full bg-green-500 flex items-center justify-center transition-all duration-700"
                >
                  <span className="text-xs font-bold text-gray-900">{simulationResult.prob1.toFixed(1)}%</span>
                </div>
                {/* Barra do Jogador 2 */}
                <div 
                  style={{ width: `${simulationResult.prob2}%` }} 
                  className="h-full bg-blue-500 flex items-center justify-center transition-all duration-700"
                >
                  <span className="text-xs font-bold text-gray-900">{simulationResult.prob2.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Botão CALCULATE PROBABILITY (Posição central inferior) */}
          <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 z-20"> 
             <button
                type="button"
                className="w-72 px-6 py-3 font-bold text-gray-900 bg-green-500 rounded-full hover:bg-green-600 transition duration-150 ease-in-out disabled:bg-gray-700 disabled:text-gray-500 shadow-xl"
                onClick={handleCentralButtonClick}
                disabled={isLoading || !selectedPlayer1 || !selectedPlayer2 || !odds1 || !odds2}
             >
                {isLoading ? 'CALCULANDO...' : 'CALCULATE PROBABILITY'}
             </button>
          </div>
          
        </div>

        {/* Coluna da Direita (Simulador Jogador 2) */}
        <div className="flex-1 min-w-0 ml-8 mt-12 self-start">
          <MatchSimulator
              ranking={ranking}
              isLoading={isLoading}
              playerNumber={2}
              selectedPlayer={selectedPlayer2}
              onSelectPlayer={setSelectedPlayer2}
              odds={odds2}
              onSetOdds={setOdds2}
              otherPlayerValue={selectedPlayer1}
          />
        </div>

      </div>
      
      {/* Resultados Flutuantes (EV e Recomendação) */}
      {renderFloatingResults}

    </div>
  );
};

export default Index;