// Em: src/components/MatchResult.tsx

// (Mantenha o tipo AnalysisResult e MatchResultProps)
export type AnalysisResult = {
  player1: string;
  player2: string;
  elo1: number;
  elo2: number;
  prob1: number;
  prob2: number;
  ev1: number;
  ev2: number;
  odds1: number;
  odds2: number;
  recommendation: string;
};
type MatchResultProps = {
  result: AnalysisResult;
  onBack: () => void;
};


// Componente para a barra de probabilidade
const ProbabilidadeBarra = ({ prob1, prob2, nome1, nome2 }: {
    prob1: number;
    prob2: number;
    nome1: string;
    nome2: string;
}) => (
  <div className="mt-4 space-y-2">
    <div className="flex justify-between text-sm font-semibold">
      <span>{nome1}</span>
      <span>{nome2}</span>
    </div>
    <div className="flex w-full h-8 rounded-lg overflow-hidden shadow-inner">
      {/* Barra do Jogador 1 (verde) */}
      <div 
        style={{ width: `${prob1}%` }} 
        className="h-full bg-green-500 flex items-center justify-center transition-all duration-700"
      >
        <span className="text-xs font-bold text-gray-900">{prob1.toFixed(1)}%</span>
      </div>
      {/* Barra do Jogador 2 (azul) */}
      <div 
        style={{ width: `${prob2}%` }} 
        className="h-full bg-blue-500 flex items-center justify-center transition-all duration-700"
      >
        <span className="text-xs font-bold text-gray-900">{prob2.toFixed(1)}%</span>
      </div>
    </div>
  </div>
);


export function MatchResult({ result, onBack }: MatchResultProps) {
  
  const getEvColor = (ev: number) => {
    if (ev > 0) return 'text-green-500';
    return 'text-red-500';
  };

  return (
    <div className="p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 text-gray-100">
      <h2 className="text-3xl font-extrabold text-center text-green-500 mb-1">
        Resultado da Análise
      </h2>
      <p className="text-center text-gray-400 mb-8">
        {result.player1} vs {result.player2}
      </p>

      {/* --- Cartões de Elo --- */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { name: result.player1, elo: result.elo1 },
          { name: result.player2, elo: result.elo2 },
        ].map((jogador, index) => (
          <div key={index} className="p-5 bg-gray-700 rounded-lg text-center border border-gray-600">
            <p className="text-sm font-semibold text-gray-400">Elo Rating</p>
            <p className="text-4xl font-extrabold text-white mt-1">{jogador.elo.toFixed(0)}</p>
            <p className="text-sm text-gray-400">{jogador.name}</p>
          </div>
        ))}
      </div>
      
      {/* --- Probabilidade e Barra --- */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-2 text-center">
          Probabilidade de Vitória (by Elo)
        </h3>
        <ProbabilidadeBarra 
          prob1={result.prob1} 
          prob2={result.prob2} 
          nome1={result.player1} 
          nome2={result.player2} 
        />
      </div>

      {/* --- Cálculo de Expected Value --- */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-4 text-center">
          Cálculo do Valor Esperado pelas Odds
        </h3>
        <div className="p-4 bg-gray-700 rounded-lg space-y-3 border border-gray-600">
            {/* Fórmula de EV */}
            <div className="text-center text-sm font-mono text-gray-400">
                Fórmula: &nbsp; <span className="text-white font-bold">EV = (Prob × Odd) - 1</span>
            </div>
            
            {/* Linha do Jogador 1 */}
            <div className="flex justify-between items-center border-t border-gray-600 pt-3">
                <span className="text-lg font-bold text-gray-300">
                    <span className={getEvColor(result.ev1)} style={{ marginRight: '8px' }}>
                        {result.ev1 > 0 ? '📈' : '📉'}
                    </span>
                    {result.player1}
                </span>
                <span className={`text-lg font-bold ${getEvColor(result.ev1)}`}>
                    {result.ev1.toFixed(2)}%
                    <span className="text-sm font-normal text-gray-400 ml-2">(@ {result.odds1.toFixed(2)})</span>
                </span>
            </div>

            {/* Linha do Jogador 2 */}
            <div className="flex justify-between items-center border-t border-gray-600 pt-3">
                <span className="text-lg font-bold text-gray-300">
                    <span className={getEvColor(result.ev2)} style={{ marginRight: '8px' }}>
                        {result.ev2 > 0 ? '📈' : '📉'}
                    </span>
                    {result.player2}
                </span>
                <span className={`text-lg font-bold ${getEvColor(result.ev2)}`}>
                    {result.ev2.toFixed(2)}%
                    <span className="text-sm font-normal text-gray-400 ml-2">(@ {result.odds2.toFixed(2)})</span>
                </span>
            </div>
        </div>
      </div>
      
      {/* --- Conclusão --- */}
      <div className="p-4 rounded-lg border border-indigo-400 bg-indigo-900/50">
        <h4 className="text-lg font-semibold text-indigo-300 mb-1">Conclusão</h4>
        <p className="text-base text-gray-100">{result.recommendation}</p>
      </div>


      {/* --- Botão Voltar --- */}
      <button
        onClick={onBack}
        className="w-full px-6 py-3 font-bold text-gray-900 bg-gray-500/50 rounded-xl hover:bg-gray-600/50 transition duration-150 ease-in-out mt-6"
      >
        ← Nova Simulação
      </button>
    </div>
  );
}