'use client';

import { useState, useEffect } from 'react';
import { buscarFilme, buscarSugestoes } from '../lib/omdb';
import { Filme } from '../lib/types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Loader2, Film } from 'lucide-react';

interface SearchBarProps {
  onResult: (filme: Filme | null) => void;
}

export function SearchBar({ onResult }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Efeito que roda automaticamente enquanto você digita
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Só busca se tiver digitado pelo menos 3 letras
      if (query.trim().length >= 3) {
        const resultados = await buscarSugestoes(query);
        setSugestoes(resultados);
        setShowDropdown(true);
      } else {
        setSugestoes([]);
        setShowDropdown(false);
      }
    }, 500); // Espera 500ms após a última tecla digitada

    return () => clearTimeout(timer);
  }, [query]);

  // Função disparada ao clicar na sugestão ou no botão
  const handleSearch = async (tituloParaBuscar: string) => {
    if (!tituloParaBuscar.trim()) return;

    setShowDropdown(false);
    setLoading(true);
    setQuery(tituloParaBuscar); // Preenche a barra com o nome escolhido
    
    const filmeEncontrado = await buscarFilme(tituloParaBuscar);
    onResult(filmeEncontrado);
    setLoading(false);
  };

  return (
    <div className="relative z-50 w-full max-w-2xl mx-auto mb-8">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }} 
        className="flex gap-2 relative z-50"
      >
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Digite o nome de um filme (ex: Batman, Avatar)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 h-14 text-lg rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus-visible:ring-indigo-500 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="h-14 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold transition-all shadow-md hover:shadow-lg"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Buscar'}
        </Button>
      </form>

      {/* Caixa de Sugestões flutuante "Bem embaixo" */}
      {showDropdown && sugestoes.length > 0 && (
        <div className="absolute z-40 w-[calc(100%-8rem)] mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {sugestoes.map((filme) => (
            <div 
              key={filme.imdbID}
              onClick={() => handleSearch(filme.Title)}
              className="flex items-center gap-4 p-3 hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 group"
            >
              {filme.Poster !== 'N/A' ? (
                <img src={filme.Poster} alt={filme.Title} className="w-10 h-14 object-cover rounded-md shadow-sm" />
              ) : (
                <div className="w-10 h-14 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                  <Film className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                  {filme.Title}
                </p>
                <p className="text-sm text-slate-500 font-medium">{filme.Year}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}