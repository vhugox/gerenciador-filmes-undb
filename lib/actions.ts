'use server';

import { prisma } from './prisma';
import { Filme } from './types';

// Busca o ID do usuário baseado no email logado
async function getUserId(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.id;
}

export async function listarFilmesDB(userEmail: string): Promise<Filme[]> {
  const userId = await getUserId(userEmail);
  if (!userId) return [];

  const filmesDB = await prisma.filme.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return filmesDB.map(f => ({
    id: f.imdbId, title: f.title, year: f.year, poster: f.poster, genre: f.genre,
    plot: f.plot, status: f.status as 'assistido' | 'pendente',
    savedAt: f.createdAt.toISOString(), rating: f.rating || undefined
  }));
}

export async function salvarFilmeDB(filme: Filme, userEmail: string) {
  try {
    const userId = await getUserId(userEmail);
    if (!userId) return false;

    await prisma.filme.create({
      data: {
        imdbId: filme.id, title: filme.title, year: filme.year, poster: filme.poster,
        genre: filme.genre, plot: filme.plot, status: filme.status, rating: filme.rating, userId
      }
    });
    return true;
  } catch (erro) {
    return false; 
  }
}

export async function removerFilmeDB(imdbId: string, userEmail: string) {
  const userId = await getUserId(userEmail);
  await prisma.filme.deleteMany({ where: { imdbId, userId } });
}

export async function alternarStatusDB(imdbId: string, novoStatus: string, userEmail: string) {
  const userId = await getUserId(userEmail);
  await prisma.filme.updateMany({
    where: { imdbId, userId },
    data: { status: novoStatus }
  });
}

export async function avaliarFilmeDB(imdbId: string, nota: number, userEmail: string) {
  const userId = await getUserId(userEmail);
  await prisma.filme.updateMany({
    where: { imdbId, userId },
    data: { rating: nota }
  });
}