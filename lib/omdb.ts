import { Filme } from './types';

// O sistema agora aponta para o TMDB
const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// 1. Busca os detalhes completos para a página dinâmica e para popular a lista
export async function buscarDetalhesFilme(id: string) {
  try {
    const resposta = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits`);
    const dados = await resposta.json();

    if (dados.success === false) return { Response: 'False' };

    const diretor = dados.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'N/A';
    const atores = dados.credits?.cast?.slice(0, 3).map((a: any) => a.name).join(', ') || 'N/A';

    return {
      id: detalhes.id || '',
      title: detalhes.Title || 'Sem título',
      year: detalhes.Year || 'N/A',
      poster: detalhes.Poster || 'N/A', // O "|| 'N/A'" garante que sempre será uma string
      genre: detalhes.Genre || 'N/A',
      plot: detalhes.Plot || 'Sem sinopse',
      status: 'pendente',
      savedAt: new Date().toISOString(),
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
    const dados = await fetch(resposta.url).then(res => res.json()); // Refetch limpo

    if (!dados.results || dados.results.length === 0) return null;

    // TMDB exige buscar os detalhes pelo ID para trazer os gêneros e a sinopse completa
    const detalhes = await buscarDetalhesFilme(dados.results[0].id.toString());
    if (!detalhes || detalhes.Response === 'False') return null;

    return {
      id: detalhes.id,
      title: detalhes.Title,
      year: detalhes.Year,
      poster: detalhes.Poster,
      genre: detalhes.Genre,
      plot: detalhes.Plot,
      status: 'pendente',
      savedAt: new Date().toISOString(),
    };
  } catch (erro) {
    console.error("Erro ao buscar filme:", erro);
    return null;
  }
}

// 3. O Autocomplete da Barra de Pesquisa (já formatado para não quebrar a interface atual)
export async function buscarSugestoes(query: string) {
  try {
    const resposta = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=pt-BR`);
    const dados = await resposta.json();
    
    if (!dados.results) return [];
    
    return dados.results.slice(0, 5).map((f: any) => ({
      imdbID: f.id.toString(), // Mantido com esse nome para a SearchBar não quebrar
      Title: f.title,
      Year: f.release_date ? f.release_date.split('-')[0] : 'N/A',
      Poster: f.poster_path ? `https://image.tmdb.org/t/p/w200${f.poster_path}` : 'N/A'
    }));
  } catch (erro) {
    return [];
  }
}