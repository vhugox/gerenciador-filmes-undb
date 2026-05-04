import Link from 'next/link';
import { buscarDetalhesFilme } from '@/lib/omdb'; 
import { Calendar, Clock, Star, ArrowLeft } from 'lucide-react'; 
import { Badge } from '@/components/ui/badge'; 

// ATENÇÃO: params agora é uma Promise (Mudança do Next.js 15)
export default async function FilmeDetalhes({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Precisamos "esperar" (await) os parâmetros antes de usar o ID
  const { id } = await params;
  
  // 2. Agora sim passamos o ID correto em vez de um objeto quebrado
  const filme = await buscarDetalhesFilme(id);

  if (!filme) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4 font-serif">Filme não encontrado</h1>
        <p className="text-slate-500 mb-6">Este filme pode ter sido salvo com um formato antigo ou não existe mais.</p>
        <Link href="/" className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800">
          Voltar para o Início
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl mt-10">
      <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors">
        <ArrowLeft size={18} /> Voltar para a Lista
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        
        {filme.poster !== 'N/A' && (
          <div className="w-full md:w-1/3 bg-slate-100">
            <img 
              src={filme.poster} 
              alt={filme.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        <div className="p-8 w-full md:w-2/3 flex flex-col gap-6">
          
          <h1 className="text-3xl font-bold font-serif text-slate-900">{filme.title}</h1>

          <div className="flex flex-wrap gap-6 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={18} /> <span>{filme.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} /> <span>{filme.runtime}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={18} className="fill-amber-500" /> <span>{filme.rating}/10</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filme.genre?.split(', ').map((g: string) => (
              <Badge key={g} variant="secondary">{g}</Badge>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">Sinopse</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {filme.plot}
            </p>
          </div>

          <hr className="border-slate-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Diretor</h4>
              <p className="text-slate-600 text-sm">{filme.director}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Elenco Principal</h4>
              <p className="text-slate-600 text-sm">{filme.actors}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}