'use client';

import { useState } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-amber-500/10">
        <h2 className="mb-2 text-xl font-semibold text-white">
          Welcome to Komunikaciq
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          Enter your display name to start chatting
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mb-4 w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            maxLength={32}
            autoFocus
          />
          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full rounded-xl bg-amber-500 px-4 py-3 font-medium text-slate-900 transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
