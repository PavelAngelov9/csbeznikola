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

    const createResponse = await fetch('https://api.daily.co/v1/rooms', {
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

    let room: { url: string; name: string };

    if (createResponse.ok) {
      room = await createResponse.json();
    } else {
      const errText = await createResponse.text();
      const errJson = (() => {
        try {
          return JSON.parse(errText) as { info?: string };
        } catch {
          return {};
        }
      })();
      // If room already exists, fetch the existing room URL
      if (
        createResponse.status === 400 &&
        errJson.info?.toLowerCase().includes('already exists')
      ) {
        const getResponse = await fetch(
          `https://api.daily.co/v1/rooms/${encodeURIComponent(sanitizedName)}`,
          {
            headers: { Authorization: `Bearer ${apiKey}` }
          }
        );
        if (!getResponse.ok) {
          console.error('Daily GET room error:', await getResponse.text());
          return NextResponse.json(
            { error: 'Failed to get existing room' },
            { status: 500 }
          );
        }
        room = await getResponse.json();
      } else {
        console.error('Daily API error:', errText);
        return NextResponse.json(
          { error: 'Failed to create voice room', details: errText },
          { status: createResponse.status }
        );
      }
    }

    return NextResponse.json({ url: room.url, name: room.name });
  } catch (error) {
    console.error('Room creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create voice room' },
      { status: 500 }
    );
  }
}
