'use client';

import { signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';
import { Button } from './ui/button';

export function UserMenu({ name, email }: { name: string, email: string }) {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-4 bg-white/10 p-2 pr-4 rounded-full backdrop-blur-md border border-white/20 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-inner">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-bold text-white leading-tight">{name}</p>
          <p className="text-xs text-indigo-200 leading-tight">{email}</p>
        </div>
      </div>
      <div className="w-px h-8 bg-white/20 mx-1 hidden sm:block"></div>
      
      {/* Botão atualizado com cor neutra que fica vermelho ao passar o mouse */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => signOut({ callbackUrl: '/login' })} 
        className="h-9 px-4 bg-transparent border-white/30 text-white hover:bg-red-600 hover:text-white hover:border-red-600 text-sm font-semibold transition-all rounded-full"
      >
        <LogOut className="w-4 h-4 mr-2" /> Sair
      </Button>
    </div>
  );
}