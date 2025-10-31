// Em: src/pages/Index.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MatchSimulator, SimulationData } from "../components/MatchSimulator";
// Importamos o componente da quadra
import { TennisCourt } from "../components/TennisCourt";
import { toast } from "sonner"; 

// --- TIPOS DE DADOS ESTRUTURAIS (Mantenha) ---
type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};
type AnalysisResult = {
  player1: string; player2: string; elo1: number; elo2: number; prob1: number; prob2: number; ev1: number; ev2: number; odds1: number; odds2: number; recommendation: string;
};

// --- FUNÇÕES DE CÁLCULO (Mantenha) ---
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
const Index = () => {
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

  // --- FETCH RANKING (Mantém) ---
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
    document.title = "Tennis Match Predictor | Elo Advisor";
  }, [fetchRanking]);

  // --- LÓGICA DE SIMULAÇÃO (Mantém) ---
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

  // --- FUNÇÃO DO BOTÃO CENTRAL ---
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
  };}