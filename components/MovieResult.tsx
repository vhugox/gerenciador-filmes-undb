'use client';

import { Filme } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MovieResultProps {
  filme: Filme | null;
  onSalvar: (filme: Filme) => void;
}

export function MovieResult({ filme, onSalvar }: MovieResultProps) {
  // Se a busca não retornou nada, não renderiza o componente
  if (!filme) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8 flex flex-col md:flex-row overflow-hidden shadow-md">
      {filme.poster !== 'N/A' && (
        <img 
          src={filme.poster} 
          alt={`Poster de ${filme.title}`} 
          className="w-full md:w-48 object-cover" 
        />
      )}
      <div className="flex flex-col justify-between p-6 w-full">
        <div>
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-2xl font-bold">{filme.title} ({filme.year})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-2 mb-4">
              {/* O gênero vem como uma string separada por vírgulas, aqui dividimos para criar as badges */}
              {filme.genre.split(', ').map(g => (
                <Badge key={g} variant="secondary">{g}</Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">{filme.plot}</p>
          </CardContent>
        </div>
        <Button onClick={() => onSalvar(filme)} className="w-full md:w-auto self-start font-semibold">
          Salvar na Minha Lista
        </Button>
      </div>
    </Card>
  );
}