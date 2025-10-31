// Em: src/components/MatchSimulator.tsx

import React, { useState, useMemo } from 'react';
import { ComboboxSearch } from './ComboboxSearch'; // Assume que você tem o ComboboxSearch.tsx
import { toast } from 'sonner'; // Para exibir mensagens de erro, se necessário

// --- TIPOS DE DADOS ESTRUTURAIS ---
type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};
export type SimulationData = {
  player1: string;
  elo1: number;
  odds1: number;
  player2: string;
  elo2: number;
  odds2: number;
};

// --- NOVAS PROPS PARA O SIMULATOR ---
type SimulatorProps = {
  ranking: JogadorElo[];
  isLoading: boolean;
  
  playerNumber: 1 | 2; // Qual jogador é este componente?
  selectedPlayer: string;
  onSelectPlayer: (value: string) => void; // setState do Jogador
  odds: string;
  onSetOdds: (value: string) => void;       // setState das Odds
  otherPlayerValue: string; // Valor do outro jogador para desabilitar
};


// --- FUNÇÃO DE FILTRO (essencial para evitar o bug de foco) ---
const filterOddsValue = (value: string) => value.replace(/[^0-9.,]/g, '');

// --- INPUT PADRÃO (Corrigido com type="tel" e React.memo) ---
const InputDark = React.memo((props: { value: string, onChange: (e: any) => void, placeholder: string, label: string }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e); // Apenas repassa o evento, a filtragem acontece no componente pai.
    };
    
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">{props.label}</label>
            <input
                type="tel" 
                inputMode="decimal" 
                value={props.value}
                onChange={handleChange} 
                placeholder={props.placeholder}
                className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                required
            />
        </div>
    );
});


// --- COMPONENTE MATCH SIMULATOR (ADAPTADO) ---
export function MatchSimulator({ 
  ranking, 
  isLoading,
  playerNumber,
  selectedPlayer,
  onSelectPlayer,
  odds,
  onSetOdds,
  otherPlayerValue,
}: SimulatorProps) {
  
  // Prepara a lista de jogadores no formato que o Combobox entende
  const playerItems = useMemo(() => ranking.map(jogador => ({
    value: `${jogador.nome}|${jogador.elo}`,
    label: `${jogador.rank}. ${jogador.nome} (${jogador.elo} Elo)`,
  })), [ranking]);


  // Lógica para desabilitar o jogador já selecionado no outro Combobox
  const filteredPlayerItems = useMemo(() => {
    return playerItems.map(item => ({
      ...item,
      disabled: item.value === otherPlayerValue
    }));
  }, [playerItems, otherPlayerValue, playerItems]);


  // Extrair o Elo do jogador selecionado para exibição
  const eloDisplay = useMemo(() => {
    if (selectedPlayer) {
      const parts = selectedPlayer.split('|');
      return parts.length > 1 ? `ELO: ${parts[1]}` : 'ELO: ????';
    }
    return 'ELO: ????';
  }, [selectedPlayer]);


  const playerTitle = playerNumber === 1 ? 'JOGADOR 1' : 'JOGADOR 2';
  const playerColor = playerNumber === 1 ? 'text-green-500' : 'text-indigo-400';

  return (
    <div className="p-4 rounded-xl border border-gray-700 text-gray-100 shadow-lg space-y-5 bg-gray-800/80"> 
      
      {/* Título do Jogador */}
      <h3 className={`text-xl font-extrabold text-center uppercase tracking-wide ${playerColor}`}>
        {playerTitle}
      </h3>

      {/* Combobox de Seleção de Jogador */}
      <ComboboxSearch
          label="NOME DO JOGADOR"
          items={filteredPlayerItems}
          selectedValue={selectedPlayer}
          onSelect={onSelectPlayer}
      />
      
      {/* Input de Odds */}
      <InputDark 
          value={odds} 
          // O setOdds chama a função de filtro
          onChange={(e) => onSetOdds(filterOddsValue(e.target.value))} 
          placeholder="Ex: 1.85" 
          label="ODDS DA APOSTA"
      />

      {/* Exibição do ELO */}
      <div className="text-center pt-2 text-gray-400 font-bold text-sm border-t border-gray-700">
        {eloDisplay}
      </div>

      {/* Exibição do Loading (opcional) */}
      {isLoading && (
          <div className="text-center text-sm text-yellow-400">
              Aguarde, calculando...
          </div>
      )}
    </div>
  );
}