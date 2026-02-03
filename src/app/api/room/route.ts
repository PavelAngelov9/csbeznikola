import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'Daily.co API key not configured. Add DAILY_API_KEY to your environment.'
      },
      { status: 500 }
    );
  }

  try {
    const { roomName = 'main' } = await request.json().catch(() => ({}));
    const sanitizedName =
      roomName
        .toString()
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .slice(0, 50) || 'main';

    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        name: sanitizedName,
        properties: {
          enable_chat: false,
          enable_knocking: true,
          start_video_off: true,
          start_audio_off: false,
          exp: Math.floor(Date.now() / 1000) + 86400 // 24h expiry
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Daily API error:', err);
      return NextResponse.json(
        { error: 'Failed to create voice room', details: err },
        { status: response.status }
      );
    }

    const room = await response.json();
    return NextResponse.json({ url: room.url, name: room.name });
  } catch (error) {
    console.error('Room creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create voice room' },
      { status: 500 }
    );
  }
}
