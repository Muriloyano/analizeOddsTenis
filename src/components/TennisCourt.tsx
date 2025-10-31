// Em: src/components/TennisCourt.tsx (VERSÃO FINAL: HORIZONTAL E ESCURA)

import React from 'react';

export function TennisCourt() {
  return (
    // Proporção horizontal de 2.5:1 para maximizar a largura.
    <div className="relative w-full aspect-[2.5/1] rounded-lg overflow-hidden"> 
      
      {/* ViewBox ajustado para 1000x400 */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
        
        {/* Fundo do SVG: Combina com o fundo bg-gray-950 da página */}
        <rect x="0" y="0" width="1000" height="400" fill="#0A0A0A" /> 

        {/* 1. LINHA EXTERNA DA QUADRA (Linhas de Duplas) */}
        {/* A área jogável será de x=100 a x=900, y=50 a y=350 */}
        <rect x="100" y="50" width="800" height="300" fill="none" stroke="#FFFFFF" strokeWidth="6" />

        {/* 2. LINHA DA REDE (Net Line) - No meio do eixo X (vertical) */}
        <line x1="500" y1="50" x2="500" y2="350" stroke="#FFFFFF" strokeWidth="6" />

        {/* 3. LINHAS DE DUPLAS LATERAIS (Tram Lines) - Verticais */}
        <line x1="150" y1="50" x2="150" y2="350" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="850" y1="50" x2="850" y2="350" stroke="#FFFFFF" strokeWidth="6" />

        {/* 4. LINHAS DE SERVIÇO (Service Lines) - Horizontais */}
        {/* MUDANÇA: Linhas mais distantes da rede, criando o espaço de fundo correto */}
        <line x1="150" y1="120" x2="850" y2="120" stroke="#FFFFFF" strokeWidth="6" /> 
        <line x1="150" y1="280" x2="850" y2="280" stroke="#FFFFFF" strokeWidth="6" />

        {/* 5. LINHA CENTRAL DE SERVIÇO (Center Service Line) - Horizontal que divide as caixas */}
        <line x1="250" y1="200" x2="750" y2="200" stroke="#FFFFFF" strokeWidth="6" />

        {/* 6. Ponto de Serviço (Center Mark) - Marcas verticais na linha de fundo */}
        <line x1="500" y1="50" x2="500" y2="60" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="500" y1="340" x2="500" y2="350" stroke="#FFFFFF" strokeWidth="6" />

        {/* Marcas da Rede (Círculos nos postes) */}
        <circle cx="500" cy="50" r="10" fill="#FFFFFF" /> 
        <circle cx="500" cy="350" r="10" fill="#FFFFFF" />
        
      </svg>
    </div>
  );
}