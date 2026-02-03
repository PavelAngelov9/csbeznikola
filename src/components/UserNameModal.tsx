'use client';

import { useState } from 'react';
import { SkullIcon, NoEntryIcon } from './ForbiddenIcons';

type Props = {
  isOpen: boolean;
  onSubmit: (name: string) => void;
};

export function UserNameModal({ isOpen, onSubmit }: Props) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length >= 2) onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border border-red-500/20 bg-zinc-900/95 p-6 shadow-2xl shadow-red-500/10">
        <div className="mb-4 flex items-center justify-center gap-2">
          <SkullIcon className="h-8 w-8 text-red-500" />
          <NoEntryIcon className="h-6 w-6 text-red-500/70" />
        </div>
        <h2 className="mb-2 text-center text-xl font-semibold text-white">
          CS bez Nikola
        </h2>
        <p className="mb-4 text-center text-sm text-zinc-400">
          No Nikola allowed · Enter your name to join
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mb-4 w-full rounded-xl border border-red-500/20 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
            maxLength={32}
            autoFocus
          />
          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full rounded-xl bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
