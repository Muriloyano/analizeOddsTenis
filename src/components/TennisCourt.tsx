// Em: src/components/TennisCourt.tsx (VERSÃO FINAL E CORRETA DO DESENHO)

import React from 'react';

export function TennisCourt() {
  return (
    // Container da Quadra: Ocupa toda a largura disponível, mantém a proporção
    <div className="relative w-full aspect-[1.7/1] rounded-lg overflow-hidden"> 
      
      {/* SVG da Quadra: ViewBox ajustado para proporções corretas e centralização */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
        
        {/* Fundo do SVG: Combina com o fundo bg-gray-950 da página */}
        <rect x="0" y="0" width="1000" height="500" fill="#0A0A0A" /> {/* Quase preto */}

        {/* Linhas da Quadra (strokeWidth ajustado para maior visibilidade) */}
        
        {/* Linha Externa (Base Line e Side Lines) - Dimensões padrão de quadra */}
        <rect x="100" y="50" width="800" height="400" fill="none" stroke="#A0A0A0" strokeWidth="8" />

        {/* Linha da Rede (Net Line) - No meio da altura da quadra */}
        <line x1="100" y1="250" x2="900" y2="250" stroke="#A0A0A0" strokeWidth="8" />

        {/* Linhas de Serviço (Service Lines) - 21 pés (6.4m) da rede */}
        {/* Superior */}
        <line x1="100" y1="150" x2="900" y2="150" stroke="#A0A0A0" strokeWidth="6" />
        {/* Inferior */}
        <line x1="100" y1="350" x2="900" y2="350" stroke="#A0A0A0" strokeWidth="6" />

        {/* Linha Central de Serviço (Center Service Line) - No meio da largura, entre as linhas de serviço */}
        <line x1="500" y1="150" x2="500" y2="350" stroke="#A0A0A0" strokeWidth="6" />

        {/* Marcas Central da Rede (Net Post) - Pontos onde a rede se prende */}
        <circle cx="100" cy="250" r="12" fill="#A0A0A0" />
        <circle cx="900" cy="250" r="12" fill="#A0A0A0" />
        
      </svg>
    </div>
  );
}