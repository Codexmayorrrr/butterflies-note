import React, { useState, useEffect, useRef } from 'react';
import ButterfliesLetter from './components/ButterfliesLetter';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.6;

    // 1. Try immediate unmuted autoplay on load
    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          // If browser grants unmuted autoplay, immediately begin the letter
          setIsOpen(true);
        })
        .catch(() => {
          // Browser policy blocked silent autoplay without user gesture.
          // Listen for any immediate touch/click/keypress anywhere on window to open instantly
          const autoUnlock = () => {
            audio.play().catch(() => {});
            setIsOpen(true);
            ['pointerdown', 'touchstart', 'keydown'].forEach((e) =>
              window.removeEventListener(e, autoUnlock)
            );
          };

          ['pointerdown', 'touchstart', 'keydown'].forEach((e) =>
            window.addEventListener(e, autoUnlock, { once: true, passive: true })
          );
        });
    }
  }, []);

  const handleOpen = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setIsOpen(true);
  };

  return (
    <main
      onClick={!isOpen ? handleOpen : undefined}
      className={`relative min-h-screen w-full bg-parchment flex flex-col items-center justify-center px-6 py-12 sm:px-12 sm:py-16 md:px-20 md:py-20 transition-all duration-500 ${
        !isOpen ? 'cursor-pointer select-none' : ''
      }`}
    >
      {/* Background audio track */}
      <audio
        ref={audioRef}
        src="/audio/beautiful-night.mp3"
        loop
        preload="auto"
        className="hidden"
        aria-hidden="true"
      />

      {!isOpen ? (
        <div className="flex flex-col items-center justify-center gap-3 text-charcoal-muted text-center animate-[fadeIn_0.6s_ease-out]">
          <svg
            className="w-10 h-10 text-[#5C5C5C] hover:scale-105 transition-transform duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <p className="font-corsiva text-[22px] sm:text-[26px] tracking-wide text-[#4A4A4A] m-0">
            Click anywhere to open
          </p>
        </div>
      ) : (
        <ButterfliesLetter />
      )}
    </main>
  );
}
