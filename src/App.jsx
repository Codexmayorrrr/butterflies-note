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
          <div className="w-14 h-14 rounded-full border border-[#8C7A5D]/40 bg-[#D7C4A5]/40 flex items-center justify-center text-2xl shadow-sm hover:scale-105 transition-transform duration-300">
            ✉
          </div>
          <p className="font-corsiva text-[22px] sm:text-[26px] tracking-wide text-[#4A4A4A] m-0">
            Click anywhere to open
          </p>
          <span className="text-[11px] font-mono text-[#5C5C5C]/70 tracking-widest uppercase">
            ♫ Beautiful Night • Adekunle Gold
          </span>
        </div>
      ) : (
        <ButterfliesLetter />
      )}
    </main>
  );
}
