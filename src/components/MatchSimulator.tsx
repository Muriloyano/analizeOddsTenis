// Em: src/components/MatchSimulator.tsx

import React, { useState, useMemo } from 'react'; // <--- IMPORTA O REACT AQUI!
import { ComboboxSearch } from './ComboboxSearch'; 

// (Mantenha todos os Types: JogadorElo, SimulationData, SimulatorProps)
// ...
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
type SimulatorProps = {
  ranking: JogadorElo[];
  onSimulate: (data: SimulationData) => void;
  isLoading: boolean;
};


// --- NOVA FUNÇÃO DE FILTRO (Adicione isto) ---
const filterOddsValue = (value: string) => value.replace(/[^0-9.,]/g, '');


// --- DEFINIÇÃO DO INPUT (Com React.memo para evitar a perda de foco) ---
// Note que ela é declarada ANTES do export function MatchSimulator
const InputDark = React.memo((props: { value: string, onChange: (e: any) => void, placeholder: string, label: string }) => {
    
    // Essa função apenas repassa o evento, mas o React.memo previne re-renders desnecessários.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e); 
    };
    
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">{props.label}</label>
            <input
                type="tel" 
                inputMode="decimal" 
                value={props.value}
                onChange={handleChange} // Usa o handleChange simples
                placeholder={props.placeholder}
                className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                required
            />
        </div>
    );
});


// --- COMPONENTE PRINCIPAL ---
export function MatchSimulator({ ranking, onSimulate, isLoading }: SimulatorProps) {
    // ... (restante do MatchSimulator.tsx)
    const [selectedPlayer1, setSelectedPlayer1] = useState<string>(''); 
    const [selectedPlayer2, setSelectedPlayer2] = useState<string>(''); 
    const [odds1, setOdds1] = useState<string>('');
    const [odds2, setOdds2] = useState<string>('');

    // Prepara a lista de jogadores no formato que o Combobox entende
    const playerItems = useMemo(() => ranking.map(jogador => ({
        value: `${jogador.nome}|${jogador.elo}`,
        label: `${jogador.rank}. ${jogador.nome} (${jogador.elo} Elo)`,
    })), [ranking]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPlayer1 || !selectedPlayer2 || !odds1 || !odds2 || selectedPlayer1 === selectedPlayer2) {
            alert('Preencha todos os campos e selecione jogadores diferentes.');
            return;
        }

        // 1. DESESTRUTURAR OS DADOS DOS JOGADORES
        const [nome1, elo1] = selectedPlayer1.split('|');
        const [nome2, elo2] = selectedPlayer2.split('|');

        // 2. TRATAMENTO DAS ODDS (substitui vírgula por ponto)
        const rawOdds1 = odds1.replace(',', '.');
        const rawOdds2 = odds2.replace(',', '.');

        // 3. VALIDAÇÃO DE NÚMEROS (IMPORTANTE!)
        const parsedOdds1 = parseFloat(rawOdds1);
        const parsedOdds2 = parseFloat(rawOdds2);
        const parsedElo1 = parseFloat(elo1);
        const parsedElo2 = parseFloat(elo2);
        
        if (isNaN(parsedOdds1) || isNaN(parsedOdds2) || isNaN(parsedElo1) || isNaN(parsedElo2)) {
            alert('Erro na conversão dos números. Verifique o formato das Odds (use ponto ou vírgula).');
            return;
        }

        // 4. ENVIO DE DADOS
        onSimulate({
            player1: nome1,
            elo1: parsedElo1,
            odds1: parsedOdds1,
            player2: nome2,
            elo2: parsedElo2,
            odds2: parsedOdds2,
        });
    };
    
    return (
        <div className="p-8 bg-gray-800 rounded-xl border border-gray-700 text-gray-100 shadow-none">
            {/* ... (restante do JSX) ... */}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- Jogador A --- */}
                <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-200 mb-4"> Jogador 1</h3>
                    <ComboboxSearch
                        label="Nome do jogador"
                        items={playerItems}
                        selectedValue={selectedPlayer1}
                        onSelect={setSelectedPlayer1}
                    />
                    <InputDark 
                        value={odds1} 
                        // CHAMA A FUNÇÃO DE FILTRO AO ATUALIZAR O ESTADO
                        onChange={(e) => setOdds1(filterOddsValue(e.target.value))} 
                        placeholder="Ex: 1.85" 
                        label="Odd Jogador 1"
                    />
                </div>
                
                {/* ... (Separador VS) ... */}
                <div className="text-center py-2 text-sm font-medium text-gray-500">
                    — VS —
                </div>

                {/* --- Jogador B --- */}
                <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-200 mb-4"> Jogador 2</h3>
                    <ComboboxSearch
                        label="Nome do jogador"
                        items={playerItems}
                        selectedValue={selectedPlayer2}
                        onSelect={setSelectedPlayer2}
                    />
                    <InputDark 
                        value={odds2} 
                        // CHAMA A FUNÇÃO DE FILTRO AO ATUALIZAR O ESTADO
                        onChange={(e) => setOdds2(filterOddsValue(e.target.value))} 
                        placeholder="Ex: 2.10" 
                        label="Odd Jogador 2"
                    />
                </div>
                
                {/* ... (Botão) ... */}
                <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 font-bold text-gray-900 bg-green-500 rounded-xl hover:bg-green-600 transition duration-150 ease-in-out disabled:bg-gray-700 disabled:text-gray-500 shadow-md mt-6"
                >
                {isLoading ? 'Aguarde...' : 'Simular'}
                </button>
            </form>
        </div>
    );
}