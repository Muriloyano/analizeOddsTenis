// Em: src/components/TennisCourt.tsx (REVISADO)

import React from 'react';

export function TennisCourt() {
  return (
    // Removido o fundo verde e cores para que o fundo da página (bg-gray-950) apareça.
    <div className="relative w-full max-w-2xl mx-auto aspect-[1.7/1] rounded-lg overflow-hidden"> 
      
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid meet">
        
        {/* Fundo (Obrigatório no SVG, mas deve ser da mesma cor do fundo da página) */}
        {/* Vamos manter a cor cinza escuro para simular o background da página */}
        <rect x="0" y="0" width="1000" height="580" fill="#111827" /> {/* bg-gray-900 */}

        {/* Linha Externa (Base Line) - Cor Cinza Claro (#A0A0A0) */}
        <rect x="50" y="50" width="900" height="480" fill="none" stroke="#A0A0A0" strokeWidth="6" />

        {/* Linha Central (Center Service Line) - Cor Cinza Claro */}
        <line x1="500" y1="50" x2="500" y2="530" stroke="#A0A0A0" strokeWidth="6" />

        {/* Linhas de Serviço (Service Lines) */}
        <line x1="180" y1="50" x2="180" y2="530" stroke="#A0A0A0" strokeWidth="6" />
        <line x1="820" y1="50" x2="820" y2="530" stroke="#A0A0A0" strokeWidth="6" />

        {/* Linha da Rede (Net Line) - Cor Cinza Claro */}
        <line x1="50" y1="290" x2="950" y2="290" stroke="#A0A0A0" strokeWidth="8" />
        
        {/* Marcas Central da Rede (Net Post) */}
        <circle cx="50" cy="290" r="10" fill="#A0A0A0" />
        <circle cx="950" cy="290" r="10" fill="#A0A0A0" />
        <circle cx="500" cy="290" r="10" fill="#A0A0A0" /> 
      </svg>
    </div>
  );
}