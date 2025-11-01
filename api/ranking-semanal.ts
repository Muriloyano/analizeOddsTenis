// Em: api/ranking-semanal.ts (Versão mais estável e com tratamento de erro)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio'; 

// URL do site que vamos "raspar"
const URL_ALVO = 'https://tennisabstract.com/reports/atp_elo_ratings.html';

// Define como serão os dados de cada jogador
type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};

export default async function (request: VercelRequest, response: VercelResponse) {
  // A Serverless Function não deve ser usada com métodos que alteram dados
  if (request.method !== 'GET') {
    response.setHeader('Allow', ['GET']);
    return response.status(405).end('Método não permitido');
  }

  try {
    // 1. Busca o HTML do site
    const res = await fetch(URL_ALVO);

    // 2. VERIFICAÇÃO CRÍTICA: Se a resposta não for 200 OK, falha
    if (!res.ok) {
        console.error(`Falha ao acessar ${URL_ALVO}. Status: ${res.status}`);
        return response.status(503).json({
            error: 'Serviço de Ranking Indisponível',
            details: `O site externo retornou o status ${res.status}.`,
        });
    }

    const html = await res.text();

    // 3. Carrega o HTML no 'cheerio'
    const $ = cheerio.load(html);
    const ranking: JogadorElo[] = [];
    
    // O seletor de tabela original era 'table#reportable tbody tr'
    const seletorTabela = 'table#reportable tbody tr';

    $(seletorTabela).each((index, elemento) => {
      const colunas = $(elemento).find('td');
      
      const rankTexto = colunas.eq(0).text().trim();
      const nome = colunas.eq(1).text().trim();
      const eloTexto = colunas.eq(3).text().trim();

      const rank = parseInt(rankTexto, 10);
      const elo = parseFloat(eloTexto);

      // Garante que os dados são válidos antes de adicionar
      if (!isNaN(rank) && nome && !isNaN(elo) && elo > 0) {
        ranking.push({
          rank: rank,
          nome: nome,
          elo: elo,
        });
      }
    });

    // 4. Se a raspagem falhar (ex: a tabela sumiu), o array estará vazio
    if (ranking.length === 0) {
        return response.status(500).json({
            error: 'Falha ao processar a tabela',
            details: 'O seletor da tabela (cheerio) não encontrou dados.',
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
  } finally {
      // Nenhuma desconexão de banco necessária aqui
  }
}