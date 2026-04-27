'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Film, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegistering) {
      // Lógica de Criar Conta
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erro ao criar conta');
        setLoading(false);
        return;
      }
    }

    // Lógica de Login (executa direto se estiver logando, ou após criar a conta com sucesso)
    const result = await signIn('credentials', { redirect: false, email, password });

    if (result?.error) {
      setError('Credenciais inválidas. Tente novamente.');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg mb-4">
          <Film className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Movie Dashboard</h1>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{isRegistering ? 'Criar nova conta' : 'Acesse sua conta'}</CardTitle>
          <CardDescription>
            {isRegistering ? 'Preencha seus dados para começar' : 'Digite seu email e senha para gerenciar seus filmes'}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium text-center">{error}</div>}
            
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required className="h-12" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12" />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg" disabled={loading}>
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isRegistering ? 'Cadastrar e Entrar' : 'Entrar na Plataforma')}
            </Button>
            <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="text-sm text-indigo-600 hover:underline font-medium">
              {isRegistering ? 'Já tem uma conta? Faça login' : 'Ainda não tem conta? Cadastre-se'}
            </button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}