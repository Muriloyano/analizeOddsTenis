// Em: api/ranking-semanal.ts (VERSÃO COM USER-AGENT DE NAVEGADOR)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio'; 

const URL_ALVO = 'https://tennisabstract.com/reports/atp_elo_ratings.html';

// SIMULAÇÃO DE NAVEGADOR: Este User-Agent faz o servidor pensar que somos o Chrome.
const FAKE_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36';

type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};

export default async function (request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', ['GET']);
    return response.status(405).end('Método não permitido');
  }

  try {
    // 1. Busca o HTML do site (AGORA COM O HEADER DE USER-AGENT)
    const res = await fetch(URL_ALVO, {
        headers: {
            'User-Agent': FAKE_USER_AGENT,
            'Accept-Language': 'en-US,en;q=0.9', // Simula preferência de idioma
        }
    });

    // 2. VERIFICAÇÃO DE BLOQUEIO
    if (!res.ok) {
        console.error(`Falha ao acessar ${URL_ALVO}. Status: ${res.status}`);
        return response.status(503).json({
            error: 'Serviço de Ranking Indisponível',
            details: `O site externo (Tennis Abstract) retornou o status ${res.status}. (Provável bloqueio anti-scraping)`,
        });
    }

    const html = await res.text();

    // 3. Carrega o HTML no 'cheerio'
    const $ = cheerio.load(html);
    const ranking: JogadorElo[] = [];
    
    const seletorTabela = 'table#reportable tbody tr';

    $(seletorTabela).each((index, elemento) => {
      const colunas = $(elemento).find('td');
      
      const rankTexto = colunas.eq(0).text().trim();
      const nome = colunas.eq(1).text().trim();
      const eloTexto = colunas.eq(3).text().trim();

      const rank = parseInt(rankTexto, 10);
      const elo = parseFloat(eloTexto);

      if (!isNaN(rank) && nome && !isNaN(elo) && elo > 0) {
        ranking.push({
          rank: rank,
          nome: nome,
          elo: elo,
        });
      }
    });

    // 4. Se a raspagem falhar (ex: a tabela mudou de ID)
    if (ranking.length === 0) {
        return response.status(500).json({
            error: 'Falha ao processar a tabela',
            details: 'O seletor da tabela (cheerio) não encontrou dados no HTML. O site pode ter atualizado seu layout.',
        });
    }

    // 5. Adicionar Cache (para não sobrecarregar o site alvo)
    response.setHeader(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate' // Cache por 1 hora
    );

    // 6. Envia a lista de ranking como JSON
    return response.status(200).json({
      totalJogadores: ranking.length,
      ranking: ranking,
    });

  } catch (error) {
    console.error("Erro fatal no Scraper:", error);
    return response.status(500).json({
      error: 'Erro interno ao processar a requisição.',
      details: (error as Error).message,
    });
  }
}