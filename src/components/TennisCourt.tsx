// Em: src/components/TennisCourt.tsx (VERSÃO FINAL: HORIZONTAL E ESCURA)

import React from 'react';

export function TennisCourt() {
  return (
    // Proporção horizontal de 2.5:1 para maximizar a largura.
    <div className="relative w-full aspect-[2.5/1] rounded-lg overflow-hidden"> 
      
      {/* ViewBox ajustado para a nova proporção mais horizontal (1000x400) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
        
        {/* Fundo do SVG: Combina com o fundo bg-gray-950 da página */}
        <rect x="0" y="0" width="1000" height="400" fill="#0A0A0A" /> 

        {/* 1. LINHA EXTERNA DA QUADRA (Linhas de Duplas) */}
        <rect x="100" y="50" width="800" height="300" fill="none" stroke="#FFFFFF" strokeWidth="6" />

        {/* 2. LINHA DA REDE (Net Line) - No meio da altura da quadra */}
        <line x1="100" y1="200" x2="900" y2="200" stroke="#FFFFFF" strokeWidth="6" />

        {/* 3. LINHAS DE SERVIÇO (Service Lines) - Horizontais */}
        {/* Superior */}
        <line x1="100" y1="120" x2="900" y2="120" stroke="#FFFFFF" strokeWidth="6" />
        {/* Inferior */}
        <line x1="100" y1="280" x2="900" y2="280" stroke="#FFFFFF" strokeWidth="6" />

        {/* 4. LINHA CENTRAL DE SERVIÇO (Center Service Line) - Divide as caixas de saque */}
        <line x1="500" y1="120" x2="500" y2="280" stroke="#FFFFFF" strokeWidth="6" />

        {/* 5. Linhas Centrais Pequenas (Ponto de Serviço nas Linhas de Base) */}
        <line x1="500" y1="50" x2="500" y2="60" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="500" y1="340" x2="500" y2="350" stroke="#FFFFFF" strokeWidth="6" />

        {/* Marcas da Rede (Círculos nos postes) */}
        <circle cx="100" cy="200" r="10" fill="#FFFFFF" />
        <circle cx="900" cy="200" r="10" fill="#FFFFFF" />
        
        {/* Marcas laterais na rede (Small white lines on the net line) */}
        <line x1="100" y1="200" x2="110" y2="200" stroke="#FFFFFF" strokeWidth="6" /> 
        <line x1="890" y1="200" x2="900" y2="200" stroke="#FFFFFF" strokeWidth="6" /> 
        
      </svg>
    </div>
  );
}