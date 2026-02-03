'use client';

import { useEffect, useState } from 'react';
import { Chat } from '@/components/Chat';
import { VoiceChannel } from '@/components/VoiceChannel';
import { UserNameModal } from '@/components/UserNameModal';
import { SkullIcon, NoEntryIcon } from '@/components/ForbiddenIcons';

const USER_KEY = 'cs_bez_nikola_user';
const ID_KEY = 'cs_bez_nikola_id';

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
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black" />
        <UserNameModal isOpen={showModal} onSubmit={handleNameSubmit} />
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden">
      {/* Forbidden decor */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-[0.03]">
        <div className="absolute top-10 left-10">
          <SkullIcon className="h-24 w-24 text-red-500" />
        </div>
        <div className="absolute top-20 right-20">
          <NoEntryIcon className="h-20 w-20 text-red-500" />
        </div>
        <div className="absolute bottom-32 left-1/4">
          <NoEntryIcon className="h-16 w-16 text-red-500" />
        </div>
        <div className="absolute bottom-20 right-1/4">
          <SkullIcon className="h-20 w-20 text-red-500" />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkullIcon className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                CS bez Nikola
              </h1>
              <p className="mt-0.5 text-sm text-zinc-500">
                No Nikola allowed · Chat & voice
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-sm text-red-200">
              {userName}
            </span>
            <button
              onClick={signOut}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-red-500/30 hover:text-red-300"
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

        <footer className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-600">
          <NoEntryIcon className="h-4 w-4" />
          CS bez Nikola · Deploy free on Vercel
        </footer>
      </div>
    </div>
  );
}
