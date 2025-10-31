// Em: src/pages/Index.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MatchSimulator, SimulationData } from "../components/MatchSimulator";
import { Top25Ranking } from "../components/Top25Ranking"; 
import { toast } from "sonner"; 

// --- TIPOS DE DADOS ESTRUTURAIS (Mantidos) ---
type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};
type AnalysisResult = {
  player1: string; player2: string; elo1: number; elo2: number; prob1: number; prob2: number; ev1: number; ev2: number; odds1: number; odds2: number; recommendation: string;
};

// --- FUNÇÕES DE CÁLCULO (Mantidas) ---
const calculateEloProbs = (elo1: number, elo2: number): { prob1: number, prob2: number } => {
  const eloDiff = elo1 - elo2;
  const prob1 = 1 / (1 + Math.pow(10, -eloDiff / 400));
  const prob2 = 1 - prob1;
  return { prob1: prob1, prob2: prob2 };
};
const calculateEV = (probability: number, odds: number): number => {
  return (probability * odds - 1) * 100;
};
const getRecommendation = (ev1: number, ev2: number, player1: string, player2: string): string => {
  const threshold = 5; 
  if (ev1 > threshold && ev1 > ev2) return `Aposta de VALOR identificada em ${player1}. O Expected Value positivo de ${ev1.toFixed(2)}% indica que as odds estão favoráveis.`;
  if (ev2 > threshold && ev2 > ev1) return `Aposta de VALOR identificada em ${player2}. O Expected Value positivo de ${ev2.toFixed(2)}% indica que as odds estão favoráveis.`;
  if (ev1 < 0 && ev2 < 0) return `Nenhuma aposta de valor identificada. Ambos os jogadores apresentam Expected Value negativo.`;
  const betterPlayer = ev1 > ev2 ? player1 : player2;
  const betterEV = Math.max(ev1, ev2);
  return `${betterPlayer} apresenta melhor EV (${betterEV.toFixed(2)}%), mas está abaixo do limiar ideal (${threshold}%). Considere com cautela.`;
};


// --- COMPONENTE PRINCIPAL (PÁGINA) ---
const Index = (): JSX.Element => { 
  // --- ESTADOS DE DADOS DA APLICAÇÃO ---
  const [ranking, setRanking] = useState<JogadorElo[]>([]); 
  const [simulationResult, setSimulationResult] = useState<AnalysisResult | null>(null);
  
  const [selectedPlayer1, setSelectedPlayer1] = useState<string>(''); 
  const [selectedPlayer2, setSelectedPlayer2] = useState<string>(''); 
  const [odds1, setOdds1] = useState<string>('');
  const [odds2, setOdds2] = useState<string>('');

  // ESTADOS DE CONTROLE
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [isFetchingRanking, setIsFetchingRanking] = useState<boolean>(true);


  // --- CONFIGURAÇÃO DE TEMA (DARK MODE FIXO) ---
  const backgroundClass = 'bg-gray-950 text-gray-100';
  const headerColor = 'text-white';


  // --- FETCH RANKING (Mantido) ---
  const fetchRanking = useCallback(async () => {
    setIsFetchingRanking(true);
    try {
      const response = await fetch('/api/ranking-semanal');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRanking(data.ranking || []);
    } catch (error) {
      console.error("Erro ao buscar o ranking:", error);
      toast.error("Erro ao carregar o ranking inicial. Verifique a API.");
    } finally {
      setIsFetchingRanking(false);
    }
  }, []);

  useEffect(() => {
    fetchRanking();
    document.title = "Simulador de Confrontos no Tênis (By ELo)";
  }, [fetchRanking]);

  // --- LÓGICA DE SIMULAÇÃO e BOTÃO CENTRAL (Mantidas) ---
  const handleSimulate = useCallback((data: SimulationData) => {
    setIsLoading(true);
    try {
      const { prob1, prob2 } = calculateEloProbs(data.elo1, data.elo2); 
      const ev1 = calculateEV(prob1, data.odds1);
      const ev2 = calculateEV(prob2, data.odds2);
      const recommendation = getRecommendation(ev1, ev2, data.player1, data.player2);

      setSimulationResult({
        player1: data.player1, player2: data.player2, elo1: data.elo1, elo2: data.elo2,
        prob1: prob1 * 100, prob2: prob2 * 100, ev1: ev1, ev2: ev2,
        odds1: data.odds1, odds2: data.odds2, recommendation: recommendation,
      });
      toast.success(`Análise concluída: ${data.player1} vs ${data.player2}`);

    } catch (error) {
      console.error("Erro na simulação:", error);
      toast.error("Erro ao simular a partida. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCentralButtonClick = () => {
    if (!selectedPlayer1 || !selectedPlayer2 || !odds1 || !odds2 || selectedPlayer1 === selectedPlayer2) {
        toast.error("Preencha todos os campos e selecione dois jogadores diferentes.");
        return;
    }
    const [nome1, elo1Text] = selectedPlayer1.split('|');
    const [nome2, elo2Text] = selectedPlayer2.split('|');
    const rawOdds1 = odds1.replace(',', '.');
    const rawOdds2 = odds2.replace(',', '.');
    
    handleSimulate({
        player1: nome1, elo1: parseFloat(elo1Text), odds1: parseFloat(rawOdds1),
        player2: nome2, elo2: parseFloat(elo2Text), odds2: parseFloat(rawOdds2),
    });
  };
  
  // --- FUNÇÃO PARA RENDERIZAR RESULTADOS (Mantida) ---
  const renderFloatingResults = useMemo(() => {
    if (!simulationResult) return null;

    const { ev1, ev2 } = simulationResult;
    const isPlayer1Value = ev1 > ev2; 

    const EvCard = ({ player, ev, isBest }: { player: string, ev: number, isBest: boolean }) => {
        const colorClass = ev >= 5 ? 'text-green-400' : ev > 0 ? 'text-yellow-400' : 'text-red-400';
        return (
            <div className={`p-3 rounded-lg text-center ${isBest ? 'bg-gray-700/80 border border-indigo-400' : 'bg-gray-700/50'} pointer-events-auto`}>
                <p className="text-sm font-medium text-gray-400">{player}</p>
                <p className={`text-xl font-bold ${colorClass}`}>{ev.toFixed(2)}% EV</p>
            </div>
        );
    };

    return (
        <div className="mt-8 pt-4 border-t border-gray-700 w-full">
            <h3 className="text-2xl font-bold text-center mb-4">Resultado da Análise</h3>
            <div className="flex justify-center space-x-8">
                <EvCard player={simulationResult.player1} ev={ev1} isBest={isPlayer1Value} />
                <EvCard player={simulationResult.player2} ev={ev2} isBest={!isPlayer1Value} />
            </div>
            
            <div className="mt-6 p-4 bg-indigo-900/70 border border-indigo-400 rounded-lg text-center">
                <p className="text-sm font-semibold text-indigo-200">Conclusão:</p>
                <p className="text-base text-white mt-1">{simulationResult.recommendation}</p>
                <button 
                  onClick={() => setSimulationResult(null)}
                  className="mt-2 text-sm text-indigo-300 hover:text-indigo-100 font-medium"
                >
                  (Nova Análise)
                </button>
            </div>
        </div>
    );
  }, [simulationResult]);


  // --- RENDERIZAÇÃO PRINCIPAL (O JSX) ---
  if (isFetchingRanking) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <p className="text-xl">Carregando rankings e preparando o simulador...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${backgroundClass} relative overflow-hidden flex flex-col items-center`}> 
      
      {/* Círculo de Degrade Verde (Estético) */}
      <div className="absolute top-0 left-0 w-96 h-96 blur-3xl opacity-30 z-0 pointer-events-none">
          <div className="w-full h-full rounded-full bg-green-500/50 transform translate-x-[-50%] translate-y-[-50%]"></div>
      </div>
      
      {/* Título Principal no Topo */}
      <div className="w-full text-center py-8 relative z-10">
        <h1 className={`text-4xl font-extrabold uppercase tracking-wider ${headerColor}`}>
          TENNIS MATCH PREDICTOR
        </h1>
        <p className="text-lg font-semibold text-gray-400 mt-2">
          Simulador de Confrontos no Tênis (By ELo)
        </p>
      </div>

      {/* CONTAINER PRINCIPAL: TRÊS PARTES (Tabela | Formulários | Espaço) */}
      <div className="container mx-auto py-4 relative z-10 flex items-start justify-center flex-grow max-w-6xl px-4">
        
        {/* 1. COLUNA ESQUERDA: TABELA TOP 25 (Mais Larga) */}
        {/* Usa w-1/3 do espaço disponível no container flexível */}
        <div className="flex-none w-1/3 mr-8 mt-4"> 
          {ranking.length > 0 && (
              <Top25Ranking ranking={ranking} />
          )}
        </div>

        {/* 2. COLUNA CENTRAL: FORMULÁRIOS J1 e J2 LADO A LADO */}
        {/* Ocupa o espaço central restante e mantém os dois formulários lado a lado */}
        <div className="flex-1 min-w-0 flex flex-col items-center">
            
            {/* LINHA 1: JOGADOR 1 e JOGADOR 2 LADO A LADO */}
            <div className="flex w-full justify-center space-x-8">
                
                {/* JOGADOR 1 (Esquerda) */}
                <div className="flex-none max-w-xs"> 
                  <MatchSimulator
                      ranking={ranking} isLoading={isLoading} playerNumber={1}
                      selectedPlayer={selectedPlayer1} onSelectPlayer={setSelectedPlayer1}
                      odds={odds1} onSetOdds={setOdds1} otherPlayerValue={selectedPlayer2}
                  />
                </div>

                {/* JOGADOR 2 (Direita) */}
                <div className="flex-none max-w-xs">
                  <MatchSimulator
                      ranking={ranking} isLoading={isLoading} playerNumber={2}
                      selectedPlayer={selectedPlayer2} onSelectPlayer={setSelectedPlayer2}
                      odds={odds2} onSetOdds={setOdds2} otherPlayerValue={selectedPlayer1}
                  />
                </div>
                
            </div>
            
             {/* Botão CALCULATE PROBABILITY (Centralizado abaixo das caixas) */}
            <div className="mt-8 w-full max-w-lg text-center">
                 <button
                    type="button"
                    className="w-full px-6 py-3 font-bold text-gray-900 bg-green-500 rounded-xl hover:bg-green-600 transition duration-150 ease-in-out disabled:bg-gray-700 disabled:text-gray-500 shadow-xl"
                    onClick={handleCentralButtonClick}
                    disabled={isLoading || !selectedPlayer1 || !selectedPlayer2 || !odds1 || !odds2}
                 >
                    {isLoading ? 'CALCULANDO...' : 'CALCULATE PROBABILITY'}
                 </button>
            </div>
            
            {/* Área de Resultados (Abaixo do Botão) */}
            {renderFloatingResults}
            
        </div>

        {/* 3. COLUNA DIREITA VAZIA: ESPAÇAMENTO (Mantida para Simetria e Alinhamento) */}
        <div className="flex-1 w-1/3 ml-8"> 
          {/* Espaço Vazio para Alinhamento */}
        </div>
      </div>
    </div>
  );
};

export default Index;