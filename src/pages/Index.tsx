// Em: src/pages/Index.tsx (CÓDIGO FINAL COM MENU HAMBURGER E TEMA DINÂMICO)

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MatchSimulator, SimulationData } from "../components/MatchSimulator";
import { Top25Ranking } from "../components/Top25Ranking"; 
import { toast } from "sonner"; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // NOVO: Importa useAuth para Logout
import { useTheme } from '../contexts/ThemeContext'; // NOVO: Importa useTheme para a troca de tema

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
  const navigate = useNavigate();
  const { logout } = useAuth(); // NOVO: Função para Logout
  const { theme, toggleTheme } = useTheme(); // NOVO: Tema e função de toggle

  // --- ESTADOS DE DADOS DA APLICAÇÃO ---
  const [ranking, setRanking] = useState<JogadorElo[]>([]); 
  const [simulationResult, setSimulationResult] = useState<AnalysisResult | null>(null);
  const [selectedPlayer1, setSelectedPlayer1] = useState<string>(''); 
  const [selectedPlayer2, setSelectedPlayer2] = useState<string>(''); 
  const [odds1, setOdds1] = useState<string>('');
  const [odds2, setOdds2] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [isFetchingRanking, setIsFetchingRanking] = useState<boolean>(true);
  
  // NOVO: Estado para abrir/fechar o menu hamburger
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  // --- CONFIGURAÇÃO DE TEMA DINÂMICA ---
  // Define classes de fundo e texto com base no tema atual
  const backgroundClass = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900';
  const headerColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const menuButtonClass = theme === 'dark' 
    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
    : 'bg-gray-200 hover:bg-gray-300 text-gray-800';
  const dropdownBg = theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300';
  const itemHover = theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100';


  // --- FUNÇÕES DE LÓGICA (Mantidas) ---
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

  const handleSimulate = useCallback((data: SimulationData) => {
    setIsLoading(true);
    try {
      const { prob1, prob2 } = calculateEloProbs(data.elo1, data.elo2); 
      const ev1 = calculateEV(prob1, data.odds1);
      const ev2 = calculateEV(prob2, data.odds2);
      const recommendation = getRecommendation(ev1, ev2, data.player1, data.player2);

      const result: AnalysisResult = {
        player1: data.player1, player2: data.player2, elo1: data.elo1, elo2: data.elo2,
        prob1: prob1 * 100, prob2: prob2 * 100, ev1: ev1, ev2: ev2,
        odds1: data.odds1, odds2: data.odds2, recommendation: recommendation,
      };

      navigate('/results', { state: { result } });

    } catch (error) {
      console.error("Erro na simulação:", error);
      toast.error("Erro ao simular a partida. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

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
  
  // ... (renderFloatingResults mantido) ...
  const renderFloatingResults = useMemo(() => {
    if (!simulationResult) return null;

    const { ev1, ev2 } = simulationResult;
    const isPlayer1Value = ev1 > ev2; 

    const EvCard = ({ player, ev, isBest }: { player: string, ev: number, isBest: boolean }) => {
        const colorClass = ev >= 5 ? 'text-green-400' : ev > 0 ? 'text-yellow-400' : 'text-red-400';
        // Adapta o card de resultado para o tema claro/escuro
        const cardBg = theme === 'dark' ? 'bg-gray-700/80 border-indigo-400' : 'bg-indigo-50/80 border-indigo-400 text-gray-900';
        const cardBgBest = theme === 'dark' ? 'bg-gray-700/80 border border-indigo-400' : 'bg-indigo-100/80 border border-indigo-600 text-gray-900';

        return (
            <div className={`p-3 rounded-lg text-center ${isBest ? cardBgBest : cardBg} pointer-events-auto`}>
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
  }, [simulationResult, theme]);


  // --- RENDERIZAÇÃO PRINCIPAL (O JSX) ---
  if (isFetchingRanking) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <p className="text-xl">Carregando rankings e preparando o simulador...</p>
      </div>
    );
  }

  return (
    // Usa a classe de fundo dinâmica
    <div className={`min-h-screen ${backgroundClass} relative overflow-hidden flex flex-col items-center`}> 
      
      {/* Círculo de Degrade Verde (Estético) */}
      <div className="absolute top-0 left-0 w-96 h-96 blur-3xl opacity-30 z-0 pointer-events-none">
          <div className="w-full h-full rounded-full bg-green-500/50 transform translate-x-[-50%] translate-y-[-50%]"></div>
      </div>
      
      {/* NOVO: Botão de Menu (Hamburger) no Canto Superior Direito */}
      <div className="absolute top-6 right-6 z-50">
          <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-3 rounded-full shadow-lg ${menuButtonClass} focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150`}
          >
              {isMenuOpen ? '✕' : '☰'} 
          </button>
          
          {/* Menu Dropdown */}
          {isMenuOpen && (
              <div 
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${dropdownBg}`}
              >
                  {/* Item 1: Troca de Tema */}
                  <button
                      onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                      className={`flex items-center w-full px-4 py-2 text-sm text-left ${itemHover}`}
                  >
                      {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
                  </button>
                  
                  {/* Separador */}
                  <div className={`h-px my-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  
                  {/* Item 2: Logout */}
                  <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className={`flex items-center w-full px-4 py-2 text-sm text-left font-semibold 
                          ${theme === 'dark' ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                  >
                      Sair (Logout)
                  </button>
              </div>
          )}
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

      {/* CONTAINER PRINCIPAL: FLEX BOX DE 2 COLUNAS */}
      <div className="container mx-auto py-4 relative z-10 flex items-start justify-center flex-grow max-w-6xl px-4 space-x-12">
        
        {/* 1. COLUNA ESQUERDA: TABELA TOP 25 */}
        <div className="flex-none w-[400px] mt-4"> 
            {ranking.length > 0 && (
            <Top25Ranking ranking={ranking} theme={theme} />
            )}
        </div>

        {/* 2. COLUNA DIREITA: FORMULÁRIOS J1 e J2 LADO A LADO + BOTÃO */}
        <div className="flex-1 flex flex-col items-center mt-4 w-full">
            
            {/* LINHA 1: JOGADOR 1 e JOGADOR 2 LADO A LADO */}
            <div className="flex w-full justify-between space-x-8">
                
                {/* JOGADOR 1 (Esquerda) */}
                <div className="flex-1 w-full"> 
                  <MatchSimulator
                      ranking={ranking} isLoading={isLoading} playerNumber={1}
                      selectedPlayer={selectedPlayer1} onSelectPlayer={setSelectedPlayer1}
                      odds={odds1} onSetOdds={setOdds1} otherPlayerValue={selectedPlayer2}
                      theme={theme} // Passa o tema para o MatchSimulator
                  />
                </div>

                {/* JOGADOR 2 (Direita) */}
                <div className="flex-1 w-full">
                  <MatchSimulator
                      ranking={ranking} isLoading={isLoading} playerNumber={2}
                      selectedPlayer={selectedPlayer2} onSelectPlayer={setSelectedPlayer2}
                      odds={odds2} onSetOdds={setOdds2} otherPlayerValue={selectedPlayer1}
                      theme={theme} // Passa o tema para o MatchSimulator
                  />
                </div>
                
            </div>
            
             {/* Botão CALCULATE PROBABILITY */}
            <div className="mt-8 w-full max-w-md text-center">
                 <button
                    type="button"
                    className="w-full px-6 py-3 font-bold text-gray-900 bg-green-500 rounded-xl hover:bg-green-600 transition duration-150 ease-in-out disabled:bg-gray-700 disabled:text-gray-500 shadow-xl"
                    onClick={handleCentralButtonClick}
                    disabled={isLoading || !selectedPlayer1 || !selectedPlayer2 || !odds1 || !odds2}
                 >
                    {isLoading ? 'CALCULANDO...' : 'CALCULATE PROBABILITY'}
                 </button>
            </div>
            
            {/* Área de Resultados */}
            {renderFloatingResults}
            
        </div>
      </div>
    </div>
  );
};

export default Index;