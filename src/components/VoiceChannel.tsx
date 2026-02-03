'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (
      domain: string,
      options: {
        roomName: string;
        width: string | number;
        height: string | number;
        parentNode: HTMLElement;
        userInfo?: { displayName?: string };
        configOverwrite?: Record<string, unknown>;
      }
    ) => { dispose: () => void };
  }
}

const JITSI_DOMAIN = 'meet.jit.si';
const JITSI_SCRIPT = `https://${JITSI_DOMAIN}/external_api.js`;
const ROOM_NAME = 'csBezNikola';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Jitsi script'));
    document.head.appendChild(script);
  });
}

type Props = {
  userName: string;
  isConfigured?: boolean;
};

export function VoiceChannel({ userName, isConfigured = true }: Props) {
  const [isInCall, setIsInCall] = useState(false);
  const [joining, setJoining] = useState(false);
  const jitsiRef = useRef<{ dispose: () => void } | null>(null);
  const meetingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (jitsiRef.current) {
        jitsiRef.current.dispose();
        jitsiRef.current = null;
      }
    };
  }, []);

  const joinCall = async () => {
    if (!isConfigured || joining || isInCall) return;

    setJoining(true);
    try {
      await loadScript(JITSI_SCRIPT);

      await new Promise((r) => setTimeout(r, 100));
      const container = meetingRef.current;
      if (!container) throw new Error('Meeting container not ready');

      const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
        roomName: ROOM_NAME,
        width: '100%',
        height: '100%',
        parentNode: container,
        userInfo: { displayName: userName },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: true,
          prejoinPageEnabled: false,
          enableWelcomePage: false
        }
      });

      jitsiRef.current = api;
      setIsInCall(true);
      setJoining(false);
    } catch (err) {
      setJoining(false);
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to join voice. Allow microphone access and try again.';
      alert(msg);
    }
  };

  const leaveCall = () => {
    if (jitsiRef.current) {
      jitsiRef.current.dispose();
      jitsiRef.current = null;
      setIsInCall(false);
    }
  };

  return (
    <div className="rounded-2xl border border-red-500/10 bg-zinc-900/40 overflow-hidden">
      <div className="border-b border-red-500/10 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">Voice Channel</h3>
          <p className="text-xs text-zinc-500">
            {isInCall ? 'In call' : 'Talk with friends · Free, no signup'}
          </p>
        </div>
        {!isInCall && (
          <button
            onClick={joinCall}
            disabled={joining}
            className="flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
          >
            {joining ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-400/30 border-t-red-400" />
                Joining...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
                Join voice
              </>
            )}
          </button>
        )}
      </div>

      {(joining || isInCall) && (
        <div className="relative h-[300px] bg-zinc-950 p-2">
          <div
            ref={meetingRef}
            className="h-full w-full rounded-xl min-h-[200px] overflow-hidden"
          />
          <button
            onClick={leaveCall}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-red-500/90 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-500 z-10"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.86-.2.19-.48.26-.74.18-.28-.09-.46-.35-.46-.64V6.5c0-.38.28-.7.65-.75C8.5 5.5 10.2 5 12 5c1.8 0 3.5.5 5 .75.37.05.65.37.65.75v3.85c0 .29-.18.55-.46.64-.26.08-.54.01-.74-.18-.79-.74-1.68-1.37-2.66-1.86-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
            </svg>
            Leave call
          </button>
        </div>
      )}
    </div>
  );
}
