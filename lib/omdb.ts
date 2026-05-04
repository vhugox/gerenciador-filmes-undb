import { Filme } from './types';

// O sistema agora aponta para o TMDB
const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// 1. Busca os detalhes completos para a página dinâmica e para popular a lista
export async function buscarDetalhesFilme(id: string) {
  try {
    const resposta = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits`);
    const detalhes = await resposta.json(); 

    // CORREÇÃO: Evita quebra de tela com IDs antigos do banco anterior
    if (detalhes.success === false) {
      console.log("Erro da API (Possível ID antigo):", detalhes.status_message);
      return null;
    }

    const diretor = detalhes.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'N/A';
    const atores = detalhes.credits?.cast?.slice(0, 3).map((a: any) => a.name).join(', ') || 'N/A';

    return {
      id: String(detalhes.id || ''),
      title: String(detalhes.title || 'Sem título'),
      year: String(detalhes.release_date ? detalhes.release_date.split('-')[0] : 'N/A'),
      poster: String(detalhes.poster_path ? `https://image.tmdb.org/t/p/w500${detalhes.poster_path}` : 'N/A'),
      genre: String(detalhes.genres ? detalhes.genres.map((g: any) => g.name).join(', ') : 'N/A'),
      plot: String(detalhes.overview || 'Sem sinopse'),
      status: 'pendente' as 'pendente' | 'assistido',
      savedAt: new Date().toISOString(),
      director: diretor,
      actors: atores,
      runtime: String(detalhes.runtime ? `${detalhes.runtime} min` : 'N/A'),
      rating: Number(detalhes.vote_average ? detalhes.vote_average.toFixed(1) : 0),
    };
  } catch (erro) {
    console.error("Erro ao buscar detalhes:", erro);
    return null;
  }
}

// 2. Busca o filme ao clicar no botão de Pesquisar
export async function buscarFilme(titulo: string): Promise<Filme | null> {
  try {
    const resposta = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${titulo}&language=pt-BR`);
    const dados = await resposta.json(); 

    if (!dados.results || dados.results.length === 0) return null;

    const detalhes = await buscarDetalhesFilme(dados.results[0].id.toString());
    
    if (!detalhes || ('Response' in detalhes && detalhes.Response === 'False')) return null;

    return {
      id: detalhes.id,
      title: detalhes.title,
      year: detalhes.year,
      poster: detalhes.poster,
      genre: detalhes.genre,
      plot: detalhes.plot,
      status: 'pendente',
      savedAt: new Date().toISOString(),
      director: detalhes.director,
      actors: detalhes.actors,
      runtime: detalhes.runtime,
      rating: detalhes.rating,
    };
  } catch (erro) {
    console.error("Erro ao buscar filme:", erro);
    return null;
  }
}

// 3. O Autocomplete da Barra de Pesquisa 
export async function buscarSugestoes(query: string) {
  try {
    const resposta = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=pt-BR`);
    const dados = await resposta.json();
    
    if (!dados.results) return [];
    
    return dados.results.slice(0, 5).map((f: any) => ({
      imdbID: f.id.toString(), 
      Title: f.title,
      Year: f.release_date ? f.release_date.split('-')[0] : 'N/A',
      Poster: f.poster_path ? `https://image.tmdb.org/t/p/w200${f.poster_path}` : 'N/A'
    }));
  } catch (erro) {
    return [];
  }
}