import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio'; // Importa a ferramenta de scraping

// A URL do site que vamos "raspar"
const URL_ALVO = 'https://tennisabstract.com/reports/atp_elo_ratings.html';

// Definimos como serão os dados de cada jogador
type JogadorElo = {
  rank: number;
  nome: string;
  elo: number;
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Vamos usar um bloco try...catch, pois o scraping pode falhar
  // (ex: se o site mudar o HTML ou estiver fora do ar)
  try {
    // 1. Busca o HTML do site (como um navegador faria)
    const res = await fetch(URL_ALVO);
    const html = await res.text();

    // 2. Carrega o HTML no 'cheerio'
    const $ = cheerio.load(html);

    // 3. Onde vamos guardar os dados
    const ranking: JogadorElo[] = [];

    // 4. Aqui está a mágica:
    // Inspecionando o site, vi que a tabela tem id="reportable"
    // E os dados dos jogadores estão nas linhas (<tr>) dentro de <tbody>
    const seletorTabela = 'table#reportable tbody tr';

    $(seletorTabela).each((index, elemento) => {
      // 'elemento' é cada linha <tr> da tabela
      const linha = $(elemento);

      // Pega as colunas (<td>) dentro da linha
      const colunas = linha.find('td');

      // 5. Extrai o texto de cada coluna que nos interessa
      // .eq(0) = primeira coluna (Rank)
      // .eq(1) = segunda coluna (Nome)
      // .eq(3) = quarta coluna (Elo Rating)
      
      const rankTexto = colunas.eq(0).text();
      const nome = colunas.eq(1).text();
      const eloTexto = colunas.eq(3).text();

      // 6. Limpa e converte os dados
      const rank = parseInt(rankTexto, 10);
      const elo = parseFloat(eloTexto);

      // 7. Adiciona ao nosso array (apenas se tiver dados válidos)
      if (!isNaN(rank) && nome && !isNaN(elo)) {
        ranking.push({
          rank: rank,
          nome: nome,
          elo: elo,
        });
      }
    });
    
    // 8. DICA PRO: Adicionar Cache!
    // Não queremos "raspar" o site a cada milissegundo.
    // Isso diz para a Vercel guardar o resultado por 1 hora (3600s).
    // Seu site fica MUITO mais rápido e não sobrecarrega o tennisabstract.
    response.setHeader(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate'
    );

    // 9. Envia a lista de ranking como JSON
    response.status(200).json({
      totalJogadores: ranking.length,
      ranking: ranking,
    });
  } catch (error: any) {
    // Se algo der errado (site fora do ar, etc)
    response.status(500).json({
      error: 'Falha ao buscar dados do ranking.',
      detalhes: error.message,
    });
  }
}