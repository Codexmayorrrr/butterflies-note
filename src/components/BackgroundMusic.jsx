import React, { useEffect, useRef } from 'react';

// YouTube Video ID for Adekunle Gold - "Beautiful Night" (Official Audio)
const YOUTUBE_VIDEO_ID = '-wPDJOazVrA';

export default function BackgroundMusic() {
  const htmlAudioRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    let isCleanedUp = false;

    // Helper to start playback
    const attemptPlay = () => {
      if (isPlayingRef.current) return;

      // 1. Try local audio if present
      if (htmlAudioRef.current && htmlAudioRef.current.src) {
        htmlAudioRef.current
          .play()
          .then(() => {
            isPlayingRef.current = true;
          })
          .catch(() => {});
      }

      // 2. Try YouTube player
      if (ytPlayerRef.current?.playVideo) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(60);
          ytPlayerRef.current.playVideo();
          isPlayingRef.current = true;
        } catch (err) {}
      }
    };

    // Global interaction triggers to unlock audio if browser autoplay policy blocks unmuted autoplay
    const unlockEvents = ['pointerdown', 'touchstart', 'touchend', 'scroll', 'keydown', 'click'];
    const handleUnlock = () => {
      attemptPlay();
      if (isPlayingRef.current) {
        unlockEvents.forEach((evt) => window.removeEventListener(evt, handleUnlock));
      }
    };

    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, handleUnlock, { passive: true, capture: true });
    });

    // Check for local file first
    fetch('/audio/beautiful-night.mp3', { method: 'HEAD' })
      .then((res) => {
        if (!isCleanedUp && res.ok && res.headers.get('content-type')?.includes('audio')) {
          if (htmlAudioRef.current) {
            htmlAudioRef.current.src = '/audio/beautiful-night.mp3';
            attemptPlay();
          }
        } else {
          loadYouTubeAPI();
        }
      })
      .catch(() => {
        loadYouTubeAPI();
      });

    // YouTube API Loader
    function loadYouTubeAPI() {
      if (isCleanedUp) return;

      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      const onAPIReady = () => {
        if (isCleanedUp) return;
        ytPlayerRef.current = new window.YT.Player('yt-bg-player', {
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
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
              event.target.unMute();
              event.target.setVolume(60);
              try {
                event.target.playVideo();
                isPlayingRef.current = true;
              } catch (e) {}
            },
            onStateChange: (event) => {
              if (event.data === window.YT?.PlayerState?.PLAYING) {
                isPlayingRef.current = true;
              }
            }
          }
        });
      };

      if (window.YT && window.YT.Player) {
        onAPIReady();
      } else {
        window.onYouTubeIframeAPIReady = onAPIReady;
      }
    }

    return () => {
      isCleanedUp = true;
      unlockEvents.forEach((evt) => window.removeEventListener(evt, handleUnlock));
      if (ytPlayerRef.current?.destroy) {
        ytPlayerRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      {/* Hidden local audio element */}
      <audio
        ref={htmlAudioRef}
        loop
        autoPlay
        preload="auto"
        className="hidden"
      />

      {/* Hidden zero-overhead YouTube audio player */}
      <div
        className="fixed -top-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div id="yt-bg-player" />
      </div>
    </>
  );
}
