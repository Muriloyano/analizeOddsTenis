// Em: src/components/TennisCourt.tsx

import React from 'react';

export function TennisCourt() {
  return (
    // Container da Quadra (Transparente para o fundo da página)
    <div className="relative w-full aspect-[1.7/1] rounded-lg overflow-hidden"> 
      
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid meet">
        
        {/* Fundo do SVG: Combina com o fundo bg-gray-950 da página */}
        <rect x="0" y="0" width="1000" height="580" fill="#0A0A0A" /> {/* Quase preto */}

        {/* Linha Externa (Base Line) - Cinza Claro Minimalista */}
        <rect x="50" y="50" width="900" height="480" fill="none" stroke="#A0A0A0" strokeWidth="6" />

        {/* Linhas Internas */}
        <line x1="500" y1="50" x2="500" y2="530" stroke="#A0A0A0" strokeWidth="6" />
        <line x1="180" y1="50" x2="180" y2="530" stroke="#A0A0A0" strokeWidth="6" />
        <line x1="820" y1="50" x2="820" y2="530" stroke="#A0A0A0" strokeWidth="6" />

        {/* Linha da Rede (Net Line) */}
        <line x1="50" y1="290" x2="950" y2="290" stroke="#A0A0A0" strokeWidth="8" />
        
        {/* Marcas da Rede */}
        <circle cx="50" cy="290" r="10" fill="#A0A0A0" />
        <circle cx="950" cy="290" r="10" fill="#A0A0A0" />
        <circle cx="500" cy="290" r="10" fill="#A0A0A0" /> 
      </svg>
    </div>
  );
}