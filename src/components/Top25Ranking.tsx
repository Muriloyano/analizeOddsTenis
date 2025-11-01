// Em: src/components/Top25Ranking.tsx (VERSÃO FINAL COM TEMA CLARO APRIMORADO)

import React from 'react';

type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};

type RankingProps = {
    ranking: JogadorElo[];
    theme: 'dark' | 'light'; // <--- USADO PARA ALTERAR O ESTILO
};

export function Top25Ranking({ ranking, theme }: RankingProps) {
    const top25 = ranking.slice(0, 25); 

    // Classes para o modo claro (Cinza suave)
    const cardBg = theme === 'dark' 
        ? 'bg-gray-800/90 border-gray-700' 
        : 'bg-gray-100 border-gray-300'; // Fundo Cinza Claro
        
    const headerBg = theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700';
    const bodyText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const nameText = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const hoverBg = theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100';

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