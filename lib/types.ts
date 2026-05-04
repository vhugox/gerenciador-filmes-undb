export interface Filme {
  id: string;
  imdbId?: string; // <-- Adicionamos isso aqui para o MovieCard reconhecer!
  title: string;
  year: string;
  poster: string;
  genre: string;
  plot: string;
  status: 'assistido' | 'pendente';
  savedAt?: string;
  rating?: number;
  director?: string;
  actors?: string;
  runtime?: string;
}