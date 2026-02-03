-- Run this in your Supabase SQL Editor to set up the chat table
-- Dashboard: https://app.supabase.com → Your Project → SQL Editor

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional - allows public read/write for demo)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read messages
CREATE POLICY "Allow public read" ON messages
  FOR SELECT USING (true);

-- Policy: Allow anyone to insert messages
CREATE POLICY "Allow public insert" ON messages
  FOR INSERT WITH CHECK (true);

-- Enable Realtime: In Supabase Dashboard → Database → Replication
-- add the "messages" table to the supabase_realtime publication.
