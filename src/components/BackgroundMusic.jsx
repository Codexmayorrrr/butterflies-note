import React, { useState, useEffect, useRef } from 'react';

// YouTube Video ID for Adekunle Gold - "Beautiful Night" (Official Audio)
const YOUTUBE_VIDEO_ID = '-wPDJOazVrA';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioSource, setAudioSource] = useState(null); // 'local' | 'youtube'

  const htmlAudioRef = useRef(null);
  const ytPlayerRef = useRef(null);

  // 1. Check for local audio file first
  useEffect(() => {
    fetch('/audio/beautiful-night.mp3', { method: 'HEAD' })
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('audio')) {
          setAudioSource('local');
        } else {
          setAudioSource('youtube');
        }
      })
      .catch(() => {
        setAudioSource('youtube');
      });
  }, []);

  // 2. Initialize YouTube Player if audioSource === 'youtube'
  useEffect(() => {
    if (audioSource !== 'youtube') return;

    // Load YouTube IFrame API script if not present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      ytPlayerRef.current = new window.YT.Player('yt-bg-player', {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: (event) => {
            setIsReady(true);
            event.target.setVolume(50);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
        ytPlayerRef.current.destroy();
      }
    };
  }, [audioSource]);

  // 3. User interaction listener to start music gracefully
  const startAudio = () => {
    setHasInteracted(true);
    if (audioSource === 'local' && htmlAudioRef.current) {
      htmlAudioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else if (audioSource === 'youtube' && ytPlayerRef.current?.playVideo) {
      try {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } catch (err) {}
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    setHasInteracted(true);

    if (isPlaying) {
      if (audioSource === 'local' && htmlAudioRef.current) {
        htmlAudioRef.current.pause();
      } else if (audioSource === 'youtube' && ytPlayerRef.current?.pauseVideo) {
        ytPlayerRef.current.pauseVideo();
      }
      setIsPlaying(false);
    } else {
      startAudio();
    }
  };

  // Listen for first interaction across page
  useEffect(() => {
    const handleFirstClick = () => {
      if (!hasInteracted) {
        startAudio();
      }
    };

    window.addEventListener('click', handleFirstClick, { once: true });
    window.addEventListener('touchstart', handleFirstClick, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstClick);
      window.removeEventListener('touchstart', handleFirstClick);
    };
  }, [hasInteracted, isReady, audioSource]);

  return (
    <>
      {/* Hidden local audio element */}
      {audioSource === 'local' && (
        <audio
          ref={htmlAudioRef}
          src="/audio/beautiful-night.mp3"
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Hidden YouTube IFrame container */}
      <div
        className="fixed -top-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div id="yt-bg-player" />
      </div>

      {/* Elegant, subtle floating music pill */}
      <aside
        aria-label="Background Music"
        className="fixed top-4 right-4 sm:top-6 sm:right-8 z-50 select-none print:hidden transition-all duration-300"
      >
        <button
          onClick={togglePlay}
          className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 ${
            isPlaying
              ? 'bg-[#D7C4A5]/70 border-[#C8B493] shadow-sm text-[#3E3E3E]'
              : 'bg-[#D7C4A5]/40 hover:bg-[#D7C4A5]/70 border-[#C8B493]/50 text-[#5C5C5C]/80'
          }`}
          title={isPlaying ? 'Pause Background Music' : 'Play "Beautiful Night" by Adekunle Gold'}
        >
          {/* Animated sound wave bars or note icon */}
          {isPlaying ? (
            <span className="flex items-end gap-0.5 h-3.5 w-3.5 justify-center" aria-hidden="true">
              <span className="w-[2px] bg-[#5C5C5C] rounded-full animate-[musicBar_0.8s_ease-in-out_infinite]" />
              <span className="w-[2px] bg-[#5C5C5C] rounded-full animate-[musicBar_0.8s_ease-in-out_0.2s_infinite]" />
              <span className="w-[2px] bg-[#5C5C5C] rounded-full animate-[musicBar_0.8s_ease-in-out_0.4s_infinite]" />
            </span>
          ) : (
            <span className="text-xs text-[#5C5C5C]/90" aria-hidden="true">
              ♫
            </span>
          )}

          <span className="text-[11px] sm:text-xs font-mono tracking-tight flex items-center gap-1.5">
            <span className="font-medium">Beautiful Night</span>
            <span className="opacity-50 hidden sm:inline">• Adekunle Gold</span>
          </span>

          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/5 text-[#5C5C5C]">
            {isPlaying ? 'Pause' : 'Play'}
          </span>
        </button>
      </aside>
    </>
  );
}
