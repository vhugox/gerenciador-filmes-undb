'use client';

import { useState, useMemo } from 'react';
import { Filme } from '../lib/types';
import { MovieCard } from './MovieCard';
import { Button } from './ui/button';

interface MovieListProps {
  filmes: Filme[];
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

type Filtro = 'todos' | 'assistido' | 'pendente';

export function MovieList({ filmes, onToggleStatus, onRemove, onRate }: MovieListProps) {
  const [filtro, setFiltro] = useState<Filtro>('todos');

  // useMemo garante que a filtragem só aconteça se a lista de filmes ou o filtro mudarem
  const filmesFiltrados = useMemo(() => {
    if (filtro === 'todos') return filmes;
    return filmes.filter(f => f.status === filtro);
  }, [filmes, filtro]);

  if (filmes.length === 0) {
    return (
      <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 mt-8 shadow-sm">
        <p className="text-slate-500 font-medium">Sua lista está vazia. Busque por um filme acima para começar!</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center">
          Sua Lista 
          <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1 rounded-full text-lg ml-3 font-semibold shadow-sm">
            {filmesFiltrados.length}
          </span>
        </h2>
        
        <div className="flex gap-2 bg-white p-1.5 rounded-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Button 
            variant={filtro === 'todos' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setFiltro('todos')}
            className={filtro === 'todos' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-slate-600 hover:text-indigo-600'}
          >
            Todos
          </Button>
          <Button 
            variant={filtro === 'assistido' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setFiltro('assistido')}
            className={filtro === 'assistido' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-slate-600 hover:text-indigo-600'}
          >
            Assistidos
          </Button>
          <Button 
            variant={filtro === 'pendente' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setFiltro('pendente')}
            className={filtro === 'pendente' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-slate-600 hover:text-indigo-600'}
          >
            Pendentes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filmesFiltrados.map(filme => (
          <MovieCard 
            key={filme.id} 
            filme={filme} 
            onToggleStatus={onToggleStatus} 
            onRemove={onRemove} 
            onRate={onRate} 
          />
        ))}
      </div>
    </div>
  );
}