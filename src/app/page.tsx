'use client';

import { useEffect, useState } from 'react';
import { Chat } from '@/components/Chat';
import { VoiceChannel } from '@/components/VoiceChannel';
import { UserNameModal } from '@/components/UserNameModal';

const USER_KEY = 'komunikaciq_user';
const ID_KEY = 'komunikaciq_id';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY);
    const savedId = localStorage.getItem(ID_KEY);
    if (saved && saved.length >= 2) {
      setUserName(saved);
      setUserId(savedId ?? generateId());
      setShowModal(false);
    } else {
      setUserId(generateId());
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    const trimmed = name.trim().slice(0, 32);
    const id = userId ?? generateId();
    localStorage.setItem(USER_KEY, trimmed);
    localStorage.setItem(ID_KEY, id);
    setUserName(trimmed);
    setUserId(id);
    setShowModal(false);
  };

  const signOut = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ID_KEY);
    setUserName(null);
    setUserId(generateId());
    setShowModal(true);
  };

  const isSupabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  // DAILY_API_KEY is server-only, so we can't check it on the client.
  // Voice channel always shows; API returns error if key is missing.

  if (showModal) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <UserNameModal isOpen={showModal} onSubmit={handleNameSubmit} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              Komunikaciq
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Chat & voice with friends across the world
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-slate-800/50 px-3 py-1.5 text-sm text-slate-300">
              {userName}
            </span>
            <button
              onClick={signOut}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 transition hover:border-white/20 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="space-y-6">
          <VoiceChannel userName={userName ?? 'Guest'} />
          <Chat
            userName={userName ?? 'Guest'}
            userId={userId ?? ''}
            isConfigured={isSupabaseConfigured}
          />
        </div>

        <footer className="mt-8 text-center text-xs text-slate-600">
          Deploy free on Vercel · Supabase · Daily.co
        </footer>
      </div>
    </div>
  );
}
