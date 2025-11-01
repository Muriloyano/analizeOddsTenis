// Em: src/components/MatchSimulator.tsx (Substitua todo o conteúdo)

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

// --- PROPS DO SIMULATOR (ADICIONADA PROP THEME) ---
type SimulatorProps = {
  ranking: JogadorElo[];
  isLoading: boolean;
  
  playerNumber: 1 | 2; 
  selectedPlayer: string;
  onSelectPlayer: (value: string) => void;
  odds: string;
  onSetOdds: (value: string) => void;
  otherPlayerValue: string;
  theme: 'dark' | 'light'; // <--- NOVA PROP
};


// --- FUNÇÃO DE FILTRO (Mantida) ---
const filterOddsValue = (value: string) => value.replace(/[^0-9.,]/g, '');

// --- INPUT PADRÃO (Ajustado para Tema) ---
const InputDark = React.memo((props: { value: string, onChange: (e: any) => void, placeholder: string, label: string, theme: 'dark' | 'light' }) => {
    
    const inputClasses = props.theme === 'dark' 
        ? 'bg-gray-700 text-gray-100 border-gray-600 focus:ring-green-500 focus:border-green-500'
        : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                className={`w-full p-3 text-lg rounded-lg transition duration-150 ease-in-out ${inputClasses}`}
                required
            />
        </div>
    );
});


// --- COMPONENTE MATCH SIMULATOR ---
export function MatchSimulator({ 
  ranking, isLoading, playerNumber, selectedPlayer, onSelectPlayer, odds, onSetOdds, otherPlayerValue, theme // <-- USANDO A PROP
}: SimulatorProps) {
  
  // ... (lógica de playerItems e filteredPlayerItems)
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
  const cardBg = theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`p-6 rounded-xl shadow-xl space-y-5 w-full ${cardBg}`}> 
      
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
          inputClassName={theme === 'dark' 
            ? "w-full p-4 bg-gray-700 text-lg text-gray-100 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out placeholder-gray-400"
            : "w-full p-4 bg-white text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-500"
          }
      />
      
      {/* 2. INPUT DE ODDS (Caixa de texto maior) */}
      <InputDark 
          value={odds} 
          onChange={(e) => onSetOdds(filterOddsValue(e.target.value))} 
          placeholder="Ex: 1.85" 
          label="ODDS DA APOSTA"
          theme={theme} // Passa o tema
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