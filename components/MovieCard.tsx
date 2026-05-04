'use client';

import { Filme } from '../lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Trash2, CheckCircle, Clock, Star } from 'lucide-react';
import Link from 'next/link';

interface MovieCardProps {
  filme: Filme;
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

export function MovieCard({ filme, onToggleStatus, onRemove, onRate }: MovieCardProps) {
  const isAssistido = filme.status === 'assistido';

  // O PULO DO GATO: Direciona para a página certa independente de onde o filme veio
  const linkParaDetalhes = filme.imdbId ? `/filmes/${filme.imdbId}` : `/filmes/${filme.id}`;

  return (
    <Card className="flex flex-col h-full overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group bg-white dark:bg-slate-900">
      <div className="h-72 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <img 
          src={filme.poster !== 'N/A' ? filme.poster : '/api/placeholder/400/600'} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={filme.title}
        />
        <Badge 
          className="absolute top-3 right-3 z-20 shadow-md backdrop-blur-md bg-white/90 text-slate-900"
          variant={isAssistido ? "default" : "secondary"}
        >
          {isAssistido ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
          {filme.status.toUpperCase()}
        </Badge>
      </div>
      
      <CardHeader className="p-5 flex-grow">
        <CardTitle className="text-xl font-bold line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
          {/* Link corrigido aqui! */}
          <Link href={linkParaDetalhes} className="hover:underline">
            {filme.title}
          </Link>
        </CardTitle>
        
        {isAssistido && (
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRate(filme.id, star)}
                className="transition-transform hover:scale-125 focus:outline-none"
              >
                <Star 
                  className={`w-5 h-5 ${
                    star <= (filme.rating || 0) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-slate-300 dark:text-slate-600"
                  }`} 
                />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center text-sm text-slate-500">
          <Calendar className="w-4 h-4 mr-2" />
          {filme.year}
        </div>
      </CardHeader>
      
      <CardFooter className="p-5 pt-0 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800 mt-auto bg-slate-50/50 dark:bg-slate-900/50">
        <Button 
          variant={isAssistido ? "outline" : "default"} 
          className="w-full text-xs font-semibold h-10" 
          onClick={() => onToggleStatus(filme.id)}
        >
          {isAssistido ? 'Pendente' : 'Assistido'}
        </Button>
        <Button 
          variant="destructive" 
          className="w-full text-xs h-10 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border-0"
          onClick={() => onRemove(filme.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remover
        </Button>
      </CardFooter>
    </Card>
  );
}