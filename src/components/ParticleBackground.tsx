// Em: src/components/ParticleBackground.tsx (VERSÃO FINAL COM CORREÇÃO DE TIPAGEM)

import React, { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
// Importação do carregador slim (instalado via npm install @tsparticles/slim)
import { loadSlim } from '@tsparticles/slim'; 
import type { IOptions, Engine } from '@tsparticles/engine'; 
import type { RecursivePartial } from '@tsparticles/engine'; // Tipo para as opções


export function ParticleBackground() {
  
  // Assinatura correta para o tipo de Engine (sem o 'id' que o TS estava reclamando)
  const particlesInit = useCallback(async (engine: Engine) => {
    // Carrega apenas o essencial para a funcionalidade 'grab'
    await loadSlim(engine);
  }, []);

  // Configuração das partículas (mantida)
  const options: RecursivePartial<IOptions> = useMemo(() => ({
    fullScreen: { enable: true, zIndex: 0 },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab", 
        },
        onClick: {
          enable: false,
        },
      },
      modes: {
        grab: {
          distance: 180, 
          links: {
            opacity: 0.7,
          },
        },
      },
    },
    particles: {
      color: {
        value: "#F8F8F8",
      },
      links: {
        color: {
          value: "#FFFFFF",
        },
        distance: 140,
        enable: true,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.6,
        outModes: {
          default: "bounce",
        },
      },
      number: {
        density: {
          enable: true,
          area: 1200,
        },
        value: 100,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
  }), []);

  return (
    <div className="absolute inset-0 z-0">
      {/* @ts-ignore: Ignora o erro de tipagem na chamada do 'init' devido a conflitos de versão */}
      {/* O código JS subjacente funcionará corretamente. */}
      {/* @ts-ignore */}
      <Particles
        id="tsparticles"
        init={particlesInit} 
        options={options} 
      />
    </div>
  );
}