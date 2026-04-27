'use client';

import { useState, useEffect } from 'react';
import { Filme } from '../lib/types';
import { SearchBar } from '../components/SearchBar';
import { MovieResult } from '../components/MovieResult';
import { MovieList } from '../components/MovieList';
import { Film } from 'lucide-react';
import { getSession } from 'next-auth/react';
import { UserMenu } from '../components/UserMenu';
import { listarFilmesDB, salvarFilmeDB, removerFilmeDB, alternarStatusDB, avaliarFilmeDB } from '../lib/actions';

export default function Home() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [resultadoBusca, setResultadoBusca] = useState<Filme | null>(null);
  const [userData, setUserData] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    getSession().then(async (session) => {
      if (!session?.user?.email) {
        window.location.href = '/login'; // Bloqueia quem não tem login
      } else {
        setUserData({ name: session.user.name || 'Usuário', email: session.user.email });
        const dadosDoBanco = await listarFilmesDB(session.user.email);
        setFilmes(dadosDoBanco);
      }
    });
  }, []);

  const handleSalvar = async (filme: Filme) => {
    if (!userData) return;
    const sucesso = await salvarFilmeDB(filme, userData.email);
    if (sucesso) {
      const dadosAtualizados = await listarFilmesDB(userData.email);
      setFilmes(dadosAtualizados);
      setResultadoBusca(null);
    } else {
      alert('Este filme já está na sua lista!');
    }
  };

  const handleToggleStatus = async (id: string) => {
    if (!userData) return;
    const filmeAtual = filmes.find(f => f.id === id);
    if (!filmeAtual) return;
    const novoStatus = filmeAtual.status === 'assistido' ? 'pendente' : 'assistido';
    setFilmes(filmes.map(f => f.id === id ? { ...f, status: novoStatus } : f));
    await alternarStatusDB(id, novoStatus, userData.email);
  };

  const handleRemove = async (id: string) => {
    if (!userData) return;
    setFilmes(filmes.filter(f => f.id !== id));
    await removerFilmeDB(id, userData.email);
  };

  const handleRate = async (id: string, rating: number) => {
    if (!userData) return;
    setFilmes(filmes.map(f => f.id === id ? { ...f, rating } : f));
    await avaliarFilmeDB(id, rating, userData.email);
  };

  if (!userData) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Carregando painel...</div>;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      <div className="relative bg-slate-900 overflow-hidden text-white shadow-2xl mb-10 py-16 sm:py-24">
        {/* Menu de Usuário Inserido Aqui */}
        <UserMenu name={userData.name} email={userData.email} />

        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]"></div>
          <div className="absolute top-[20%] right-[0%] w-[40%] h-[60%] rounded-full bg-purple-500/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 flex flex-col items-center text-center mt-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 mb-6 shadow-lg">
            <Film className="w-8 h-8 text-indigo-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-200">
            Movie Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative -mt-16 z-20">
        <div className="relative z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 backdrop-blur-xl">
          <SearchBar onResult={setResultadoBusca} />
          <MovieResult filme={resultadoBusca} onSalvar={handleSalvar} />
        </div>
        <MovieList filmes={filmes} onToggleStatus={handleToggleStatus} onRemove={handleRemove} onRate={handleRate} />
      </div>
    </main>
  );
}