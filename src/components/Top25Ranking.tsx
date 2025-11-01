// Em: src/components/Top25Ranking.tsx (FINAL: Sem Propriedade 'theme')

import React from 'react';

type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};

// TEMA REMOVIDO DA TIPAGEM
type RankingProps = {
    ranking: JogadorElo[];
};

export function Top25Ranking({ ranking }: RankingProps) { // <-- REMOVIDO 'theme'
    const top25 = ranking.slice(0, 25); 

    // Classes fixas para o Dark Mode
    const cardBg = 'bg-gray-800/90 border-gray-700'; 
    const headerBg = 'bg-gray-700 text-gray-200';
    const bodyText = 'text-gray-400';
    const nameText = 'text-white';
    const hoverBg = 'hover:bg-gray-700/50';

    return (
        <div className={`p-4 rounded-xl shadow-2xl space-y-4 w-full h-full ${cardBg}`}> 
            <h3 className="text-xl font-bold text-center text-green-400 mb-4 uppercase">
                ATP Elo Ranking (Top 25)
            </h3>
            <div className="max-h-96 h-96 overflow-y-auto"> 
                <table className="w-full text-left text-sm">
                    <thead className={`text-xs uppercase sticky top-0 ${headerBg}`}>
                        <tr>
                            <th scope="col" className="py-2 px-3">#</th>
                            <th scope="col" className="py-2 px-3">JOGADOR</th>
                            <th scope="col" className="py-2 px-3 text-right">ELO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {top25.map((jogador, index) => (
                            <tr key={jogador.rank || index} className={`border-b border-gray-700 ${hoverBg}`}>
                                <td className={`py-2 px-3 font-medium ${nameText}`}>{jogador.rank}</td>
                                <td className={`py-2 px-3 ${bodyText}`}>{jogador.nome}</td>
                                <td className={`py-2 px-3 text-right font-mono text-green-300`}>{jogador.elo.toFixed(0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}