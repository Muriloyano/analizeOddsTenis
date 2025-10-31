// Em: src/components/TennisCourt.tsx

import React from 'react';

export function TennisCourt() {
  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[1.7/1] bg-gradient-to-b from-green-800 to-green-900 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-600">
      {/* Quadra de Tênis Simples (SVG ou div/tailwind) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid meet">
        {/* Fundo da Quadra */}
        <rect x="0" y="0" width="1000" height="580" fill="transparent" />

        {/* Linha Externa (Base Line) */}
        <rect x="50" y="50" width="900" height="480" fill="none" stroke="#E0E0E0" strokeWidth="6" />

        {/* Linha Central (Center Service Line) */}
        <line x1="500" y1="50" x2="500" y2="530" stroke="#E0E0E0" strokeWidth="6" />

        {/* Linhas de Serviço (Service Lines) */}
        <line x1="180" y1="50" x2="180" y2="530" stroke="#E0E0E0" strokeWidth="6" />
        <line x1="820" y1="50" x2="820" y2="530" stroke="#E0E0E0" strokeWidth="6" />

        {/* Linha da Rede (Net Line) - Apenas ilustrativo */}
        <line x1="50" y1="290" x2="950" y2="290" stroke="#E0E0E0" strokeWidth="8" />
        
        {/* Marcas Central da Rede (Net Post) */}
        <circle cx="50" cy="290" r="10" fill="#E0E0E0" />
        <circle cx="950" cy="290" r="10" fill="#E0E0E0" />
        <circle cx="500" cy="290" r="10" fill="#E0E0E0" /> {/* Ponto central da rede */}
      </svg>
    </div>
  );
}