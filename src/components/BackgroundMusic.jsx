import React, { useEffect, useRef } from 'react';

export default function BackgroundMusic() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;

    // 1. Attempt immediate autoplay
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Background music autoplayed successfully.');
        })
        .catch(() => {
          // If browser policy blocks autoplay with sound,
          // unlock audio seamlessly on the very first touch, tap, scroll or keypress
          console.log('Autoplay deferred until first user interaction.');

          const unlockEvents = ['pointerdown', 'touchstart', 'touchend', 'scroll', 'keydown', 'click'];

          const handleUnlock = () => {
            audio.play().catch(() => {});
            unlockEvents.forEach((evt) => {
              window.removeEventListener(evt, handleUnlock, { capture: true });
            });
          };

          unlockEvents.forEach((evt) => {
            window.addEventListener(evt, handleUnlock, { once: true, passive: true, capture: true });
          });
        });
    }
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/audio/beautiful-night.mp3"
      loop
      preload="auto"
      className="hidden"
      aria-hidden="true"
    />
  );
}
