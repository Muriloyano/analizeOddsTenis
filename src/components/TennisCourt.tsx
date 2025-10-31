// Em: src/components/TennisCourt.tsx (VERSÃO FINAL: QUADRA DE SAIBRO DUPLAS)

import React from 'react';

export function TennisCourt() {
  return (
    // Mantém a proporção e a largura total
    <div className="relative w-full aspect-[1.7/1] rounded-lg overflow-hidden"> 
      
      {/* ViewBox ajustado para acomodar o desenho de duplas */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
        
        {/* Fundo da Quadra (Cor de Saibro) */}
        <rect x="0" y="0" width="1000" height="500" fill="#CD7C51" /> {/* Tom de saibro/laranja */}

        {/* 1. LINHA EXTERNA DA QUADRA (Linhas de Base e Linhas Laterais - Duplas) */}
        {/* Esta é a linha mais externa, definindo toda a área de duplas. */}
        <rect x="100" y="50" width="800" height="400" fill="none" stroke="#FFFFFF" strokeWidth="6" />

        {/* 2. LINHA DA REDE (Net Line) - No meio da altura da quadra */}
        <line x1="100" y1="250" x2="900" y2="250" stroke="#FFFFFF" strokeWidth="6" />

        {/* 3. LINHAS DE SERVIÇO (Service Lines) - Horizontais */}
        {/* Superior */}
        <line x1="100" y1="170" x2="900" y2="170" stroke="#FFFFFF" strokeWidth="6" />
        {/* Inferior */}
        <line x1="100" y1="330" x2="900" y2="330" stroke="#FFFFFF" strokeWidth="6" />

        {/* 4. LINHA CENTRAL DE SERVIÇO (Center Service Line) - Divide as caixas de saque */}
        {/* Vai apenas entre as linhas de serviço (vertical) */}
        <line x1="500" y1="170" x2="500" y2="330" stroke="#FFFFFF" strokeWidth="6" />

        {/* 5. LINHAS LATERAIS INTERNAS (Single Sidelines) - Para partidas de simples */}
        {/* Estas são as linhas internas que definem a largura da quadra de simples. */}
        {/* Elas estão ausentes na sua imagem, então não vamos desenhá-las. */}

        {/* 6. Marcas Centrais Pequenas (No meio da Linha de Base) */}
        {/* Estas são as pequenas marcas verticais nas linhas de base (no meio). */}
        <line x1="500" y1="50" x2="500" y2="60" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="500" y1="440" x2="500" y2="450" stroke="#FFFFFF" strokeWidth="6" />

        {/* Marcas da Rede (Brancas, mais visíveis) */}
        {/* Os postes da rede são desenhados como pequenos círculos na sua imagem, mas podem ser traços verticais. */}
        {/* Para replicar a sua imagem, não há círculos, apenas a linha da rede. */}
        {/* Mas se quisermos as marcas do poste, seriam: */}
        {/* <circle cx="100" cy="250" r="10" fill="#FFFFFF" /> */}
        {/* <circle cx="900" cy="250" r="10" fill="#FFFFFF" /> */}
        
        {/* As "marcas" laterais da sua imagem são na verdade as próprias linhas laterais duplas */}
        <line x1="100" y1="250" x2="110" y2="250" stroke="#FFFFFF" strokeWidth="6" /> {/* Marcador esquerdo na rede */}
        <line x1="890" y1="250" x2="900" y2="250" stroke="#FFFFFF" strokeWidth="6" /> {/* Marcador direito na rede */}
        
      </svg>
    </div>
  );
}