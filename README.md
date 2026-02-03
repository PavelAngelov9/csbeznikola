# CS bez Nikola

No Nikola allowed. A minimal chat + voice app with a forbidden theme. Deploy free on Vercel.

## Features

- **Real-time chat** via Supabase
- **Voice channels** via Daily.co (10,000 free minutes/month)
- Forbidden/danger theme with skulls & no-entry vibes
- No sign-up required – just enter your name

## Quick Start

### 1. Clone and install

```bash
npm install
```

### 2. Supabase (chat)

1. Create a project at [supabase.com](https://supabase.com)
2. In **SQL Editor**, run the script in `supabase/schema.sql`
3. Enable Realtime: **Database → Replication** → add `messages` to `supabase_realtime`
4. Copy **Project URL** and **anon public** key from **Project Settings → API**

### 3. Daily.co (voice)

1. Sign up at [daily.co](https://daily.co)
2. In **Developers → API Keys**, create an API key
3. Copy the key

### 4. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DAILY_API_KEY=your-daily-api-key
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add the same env vars in **Project Settings → Environment Variables**
4. Deploy

Vercel’s free tier is enough for this app.

## Tech Stack

- Next.js 16
- Supabase (auth, DB, realtime)
- Daily.co (voice/video)
- Tailwind CSS

## License

MIT
