// Em: src/components/MatchSimulator.tsx (COM INPUTS MAIORES)

import React, { useMemo } from 'react';
import { ComboboxSearch } from './ComboboxSearch'; 
import { toast } from 'sonner';

// --- TIPOS ---
type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};
export type SimulationData = {
  player1: string; elo1: number; odds1: number;
  player2: string; elo2: number; odds2: number;
};

// --- PROPS DO SIMULATOR ---
type SimulatorProps = {
  ranking: JogadorElo[];
  isLoading: boolean;
  
  playerNumber: 1 | 2; 
  selectedPlayer: string;
  onSelectPlayer: (value: string) => void;
  odds: string;
  onSetOdds: (value: string) => void;
  otherPlayerValue: string;
};


// --- FUNÇÃO DE FILTRO (essencial para evitar o bug de foco) ---
const filterOddsValue = (value: string) => value.replace(/[^0-9.,]/g, '');

// --- INPUT PADRÃO (Corrigido com p-4 para caixa maior) ---
const InputDark = React.memo((props: { value: string, onChange: (e: any) => void, placeholder: string, label: string }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Filtragem ocorre no componente pai (onSetOdds)
        props.onChange(e); 
    };
    
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{props.label}</label>
            <input
                type="tel" 
                inputMode="decimal" 
                value={props.value}
                onChange={handleChange} 
                placeholder={props.placeholder}
                // GARANTIA: p-4 para caixa de texto maior
                className="w-full p-4 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                required
            />
        </div>
    );
});


// --- COMPONENTE MATCH SIMULATOR ---
export function MatchSimulator({ 
  ranking, isLoading, playerNumber, selectedPlayer, onSelectPlayer, odds, onSetOdds, otherPlayerValue,
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
  }, [playerItems, otherPlayerValue]);


  // Extrair o Elo e Nome para exibição
  const eloDisplay = useMemo(() => {
    if (selectedPlayer) {
      const parts = selectedPlayer.split('|');
      return parts.length > 1 ? `ELO: ${parts[1]}` : 'ELO: ????';
    }
    return 'ELO: ????';
  }, [selectedPlayer]);


  const playerTitle = playerNumber === 1 ? 'JOGADOR 1' : 'JOGADOR 2';
  const playerColor = playerNumber === 1 ? 'text-green-400' : 'text-blue-400';


  return (
    <div className="p-6 bg-gray-800/80 rounded-xl border border-gray-700 text-gray-100 shadow-xl space-y-5"> 
      
      {/* Título do Jogador */}
      <h3 className={`text-xl font-extrabold text-center uppercase tracking-wide ${playerColor}`}>
        {playerTitle}
      </h3>

      {/* 1. Combobox de Seleção de Jogador (A busca por digitação) */}
      <ComboboxSearch
          label="NOME DO JOGADOR"
          items={filteredPlayerItems}
          selectedValue={selectedPlayer}
          onSelect={onSelectPlayer}
      />
      
      {/* 2. INPUT DE ODDS (Caixa de texto maior) */}
      <InputDark 
          value={odds} 
          onChange={(e) => onSetOdds(filterOddsValue(e.target.value))} 
          placeholder="Ex: 1.85" 
          label="ODDS DA APOSTA"
      />

      {/* 3. Exibição do ELO */}
      <div className="text-center pt-2 text-gray-400 font-bold text-base border-t border-gray-700">
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