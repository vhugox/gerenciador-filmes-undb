import { buscarDetalhesFilme } from '../../../lib/omdb';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function FilmeDetalhes(props: { params: Promise<{ id: string }> }) {
  // AVISO PARA O NEXT.JS: "Espere ler a URL antes de buscar o filme"
  const params = await props.params;
  const filme = await buscarDetalhesFilme(params.id);

  if (!filme || filme.Response === 'False') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center">
        <h1 className="text-3xl font-bold mb-4">Filme não encontrado</h1>
        <p className="text-slate-500 mb-8 max-w-md">
          Verifique se a chave do TMDB está correta no arquivo .env.local e se você reiniciou o servidor.
        </p>
        <Link href="/"><Button>Voltar para o Início</Button></Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <Link href="/">
            <Button variant="ghost" className="text-slate-500 hover:text-indigo-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a Lista
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {filme.poster !== 'N/A' && (
            <div className="w-full md:w-1/3 bg-slate-100 dark:bg-slate-800">
              <img src={filme.Poster} alt={filme.Title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-8 md:w-2/3 flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{filme.Title}</h1>
              <div className="flex flex-wrap gap-3 text-slate-500 text-sm font-medium">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {filme.Year}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {filme.Runtime}</span>
                <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500"/> {filme.imdbRating}/10</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {filme.Genre.split(', ').map((g: string) => (
                <Badge key={g} variant="secondary">{g}</Badge>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Sinopse</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{filme.Plot}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Diretor</h3>
                <p className="text-slate-600 dark:text-slate-400">{filme.Director}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Elenco Principal</h3>
                <p className="text-slate-600 dark:text-slate-400">{filme.Actors}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}