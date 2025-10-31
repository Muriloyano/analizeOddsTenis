// Em: src/pages/results.tsx (VERSÃO FINAL COM PROBABILIDADE EXPLÍCITA)

import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Replicar o tipo AnalysisResult do Index.tsx
type AnalysisResult = {
  player1: string; player2: string; elo1: number; elo2: number; prob1: number; prob2: number; ev1: number; ev2: number; odds1: number; odds2: number; recommendation: string;
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  // Obtém o resultado do 'state' da navegação
  const analysisResult: AnalysisResult | null = useMemo(() => {
    if (location.state && location.state.result) {
      return location.state.result as AnalysisResult;
    }
    return null;
  }, [location.state]);

  if (!analysisResult) {
    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center flex-col">
          <p className="text-xl mb-4">Carregando resultados ou nenhum resultado encontrado.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 font-bold text-gray-900 bg-green-500 rounded-xl hover:bg-green-600 transition duration-150 ease-in-out shadow-xl"
          >
            Voltar para o Simulador
          </button>
        </div>
      );
  }

  const { player1, player2, elo1, elo2, prob1, prob2, ev1, ev2, odds1, odds2, recommendation } = analysisResult;
  const isPlayer1Value = ev1 > ev2;
  const backgroundClass = 'bg-gray-950 text-gray-100';

  // --- COMPONENTE CARD DE RESULTADO (MODIFICADO) ---
  const ResultCard = ({ player, elo, prob, ev, odds, isBest }: { 
    player: string; elo: number; prob: number; ev: number; odds: number; isBest: boolean 
  }) => {
    const evColorClass = ev >= 5 ? 'text-green-400' : ev > 0 ? 'text-yellow-400' : 'text-red-400';
    return (
      <div className={`p-4 rounded-xl text-center ${isBest ? 'bg-gray-700/80 border border-indigo-400' : 'bg-gray-700/50'} w-full space-y-3`}>
        
        <p className="text-xl font-bold text-white uppercase">{player}</p>
        <p className="text-sm font-medium text-gray-400">ELO: {elo.toFixed(0)} | Odds: {odds}</p>
        
        <div className="pt-2 border-t border-gray-600">
            {/* NOVO: Probabilidade de Vitória (Mais Destacado) */}
            <p className="text-sm font-medium text-gray-300">Probabilidade de Vitória</p>
            <p className="text-3xl font-extrabold text-green-300">{prob.toFixed(2)}%</p>
        </div>
        
        {/* Expected Value */}
        <div>
            <p className="text-sm font-medium text-gray-400">Expected Value (EV)</p>
            <p className={`text-2xl font-bold ${evColorClass}`}>{ev.toFixed(2)}%</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`min-h-screen ${backgroundClass} relative overflow-hidden flex flex-col items-center`}>
      <div className="absolute top-0 left-0 w-96 h-96 blur-3xl opacity-30 z-0 pointer-events-none">
        <div className="w-full h-full rounded-full bg-green-500/50 transform translate-x-[-50%] translate-y-[-50%]"></div>
      </div>

      <div className="w-full text-center py-8 relative z-10">
        <h1 className="text-4xl font-extrabold uppercase tracking-wider text-white">
          ANÁLISE DA PARTIDA
        </h1>
        <p className="text-lg font-semibold text-gray-400 mt-2">
          {player1} vs {player2}
        </p>
      </div>

      <div className="container mx-auto py-8 relative z-10 flex flex-col items-center max-w-4xl px-4 flex-grow">
        <div className="bg-gray-800/90 p-8 rounded-xl border border-gray-700 shadow-2xl space-y-6 w-full">
          
          {/* CARDS DE RESULTADO */}
          <div className="flex justify-center space-x-8">
            <ResultCard player={player1} elo={elo1} prob={prob1} ev={ev1} odds={odds1} isBest={isPlayer1Value} />
            <ResultCard player={player2} elo={elo2} prob={prob2} ev={ev2} odds={odds2} isBest={!isPlayer1Value} />
          </div>

          {/* CONCLUSÃO DA ANÁLISE */}
          <div className="mt-8 p-6 bg-indigo-900/70 border border-indigo-400 rounded-lg text-center">
            <p className="text-xl font-semibold text-indigo-200 mb-2">Conclusão da Análise:</p>
            <p className="text-lg text-white mt-1">{recommendation}</p>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 font-bold text-gray-900 bg-green-500 rounded-xl hover:bg-green-600 transition duration-150 ease-in-out shadow-xl text-xl"
            >
              Realizar Nova Análise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;