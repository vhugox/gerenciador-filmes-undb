export interface Filme {
  id: string;
  title: string;
  year: string;
  poster: string;
  genre: string;
  plot: string;
  status: 'assistido' | 'pendente';
  savedAt: string;
  rating?: number; // Nova propriedade opcional
}