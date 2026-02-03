'use client';

import { useEffect, useRef, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { Message } from '@/lib/supabase';

type Props = {
  userName: string;
  userId: string;
  isConfigured: boolean;
};

export function Chat({ userName, userId, isConfigured }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      const { data, error: fetchErr } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (fetchErr) {
        setError(fetchErr.message);
        setLoading(false);
        return;
      }
      setMessages(data ?? []);
      setLoading(false);
    };

    fetchMessages();

    const channel = supabase!
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }, [isConfigured]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !isConfigured) return;

    setInput('');
    const supabase = getSupabase();
    if (!supabase) return;
    const { error: insertErr } = await supabase.from('messages').insert({
      content: text,
      sender_name: userName,
      sender_id: userId
    });

    if (insertErr) setError(insertErr.message);
  };

  if (!isConfigured) {
    return (
      <div className="flex flex-1 flex-col rounded-2xl border border-red-500/10 bg-zinc-900/40">
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="max-w-md rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="mb-2 font-medium text-red-200">
              Supabase not configured
            </p>
            <p className="text-sm text-zinc-400">
              Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
              your environment, then run the SQL in supabase/schema.sql
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-red-500/10 bg-zinc-900/40">
      <div className="border-b border-red-500/10 px-4 py-3">
        <h3 className="font-semibold text-white">Chat</h3>
        <p className="text-xs text-zinc-500">Real-time messages</p>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender_id === userId ? 'items-end' : 'items-start'
              }`}
            >
              <span className="mb-0.5 text-xs text-zinc-500">
                {m.sender_name}
                {m.sender_id === userId && ' (you)'}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  m.sender_id === userId
                    ? 'rounded-br-md bg-red-500/20 text-white'
                    : 'rounded-bl-md bg-zinc-700/50 text-zinc-200'
                }`}
              >
                <p className="text-sm">{m.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} className="border-t border-red-500/10 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-red-500/20 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
