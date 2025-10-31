// Em: src/components/ParticleBackground.tsx

import React, { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim'; 

export function ParticleBackground() {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine); 
  }, []);

  // Configuração das partículas para o efeito 'Grab' (Linhas que se conectam ao mouse)
  const options = useMemo(() => ({
    fullScreen: { enable: true, zIndex: 0 }, // Fundo completo
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab", // Modo que cria as linhas de conexão ao mouse
        },
        onClick: {
          enable: false,
        },
      },
      modes: {
        grab: {
          distance: 180, // Distância em que as partículas se conectam ao mouse
          links: {
            opacity: 0.7,
          },
        },
      },
    },
    particles: {
      color: {
        value: "#F8F8F8", // Cor das partículas (branco)
      },
      links: {
        color: {
          value: "#FFFFFF", // Cor das linhas de conexão
        },
        distance: 140, // Distância máxima para as partículas se conectarem umas às outras
        enable: true,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.6, // Movimento lento e sutil
        outModes: {
          default: "bounce",
        },
      },
      number: {
        density: {
          enable: true,
          area: 1200,
        },
        value: 100, // Quantidade de partículas
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
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={options}
      />
    </div>
  );
}