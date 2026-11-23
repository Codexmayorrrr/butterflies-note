import React, { useState, useRef } from 'react';
import ButterfliesLetter from './components/ButterfliesLetter';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(null);

  const handleOpen = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.65;
      audioRef.current.play().catch((err) => {
        console.warn('Playback error:', err);
      });
    }
    setIsOpen(true);
  };

  return (
    <main className="relative min-h-screen w-full bg-parchment flex flex-col items-center justify-center">
      {/* Pristine high-quality background audio (AAC / MP4 with WebM fallback) */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
        aria-hidden="true"
      >
        <source src="/audio/beautiful-night.m4a" type="audio/mp4" />
        <source src="/audio/beautiful-night.webm" type="audio/webm" />
      </audio>

      {!isOpen ? (
        /* Figma Node 14:2 Welcome Screen locked to dead-center */
        <div
          data-testid="welcome-screen-14-2"
          onClick={handleOpen}
          className="fixed inset-0 w-full h-full flex flex-col items-center justify-center gap-[10px] cursor-pointer select-none z-10 animate-[fadeIn_0.4s_ease-out] group"
        >
          {/* Node 14:8 Avatar */}
          <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden shadow-sm ring-1 ring-black/5 group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
            <img
              src="/images/pretty-face.png"
              alt="Pretty face"
              className="w-full h-full object-cover pointer-events-none"
              draggable="false"
            />
          </div>

          {/* Node 14:5 Text */}
          <p className="font-corsiva text-[13px] sm:text-[14px] leading-[19px] text-charcoal-muted text-center m-0 group-hover:text-[#3E3E3E] transition-colors duration-200">
            Click on my pretty face to open
          </p>
        </div>
      ) : (
        <div className="w-full flex justify-center px-6 py-12 sm:px-12 sm:py-16 md:px-20 md:py-20 animate-[fadeIn_0.5s_ease-out]">
          <ButterfliesLetter />
        </div>
      )}
    </main>
  );
}
