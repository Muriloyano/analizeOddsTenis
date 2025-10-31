// Em: src/components/Top25Ranking.tsx

import React from 'react';

type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};

type RankingProps = {
    ranking: JogadorElo[];
};

export function Top25Ranking({ ranking }: RankingProps) {
    // Pega apenas os 25 primeiros jogadores
    const top25 = ranking.slice(0, 25); 

    return (
        <div className="bg-gray-800/90 p-4 rounded-xl border border-gray-700 shadow-2xl mt-8">
            <h3 className="text-xl font-bold text-center text-green-400 mb-4 uppercase">
                ATP Elo Ranking (Top 25)
            </h3>
            <div className="max-h-60 overflow-y-auto"> {/* Scroll para a lista */}
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-200 sticky top-0">
                        <tr>
                            <th scope="col" className="py-2 px-3">#</th>
                            <th scope="col" className="py-2 px-3">JOGADOR</th>
                            <th scope="col" className="py-2 px-3 text-right">ELO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {top25.map((jogador, index) => (
                            <tr key={jogador.rank || index} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="py-2 px-3 font-medium text-white">{jogador.rank}</td>
                                <td className="py-2 px-3">{jogador.nome}</td>
                                <td className="py-2 px-3 text-right font-mono text-green-300">{jogador.elo.toFixed(0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}