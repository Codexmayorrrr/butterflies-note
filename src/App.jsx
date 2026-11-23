import React, { useState, useRef } from 'react';
import ButterfliesLetter from './components/ButterfliesLetter';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(null);

  const handleOpen = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }
    setIsOpen(true);
  };

  return (
    <main
      className="relative min-h-screen w-full bg-parchment flex flex-col items-center justify-center px-6 py-12 sm:px-12 sm:py-16 md:px-20 md:py-20 transition-all duration-500"
    >
      {/* Background audio track: "Beautiful Night" by Adekunle Gold */}
      <audio
        ref={audioRef}
        src="/audio/beautiful-night.mp3"
        loop
        preload="auto"
        className="hidden"
        aria-hidden="true"
      />

      {!isOpen ? (
        /* Figma Node 14:2 ("iPhone 13 & 14 - 2" Welcome Screen) */
        <div
          data-testid="welcome-screen-14-2"
          onClick={handleOpen}
          className="flex flex-col items-center justify-center gap-[10px] cursor-pointer select-none animate-[fadeIn_0.5s_ease-out] group"
        >
          {/* Node 14:8 ("Ellipse 1") */}
          <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden shadow-sm ring-1 ring-black/5 group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
            <img
              src="/images/pretty-face.png"
              alt="Pretty face"
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>

          {/* Node 14:5 ("Click on my pretty face to open") */}
          <p className="font-corsiva text-[13px] sm:text-[14px] leading-[19px] text-charcoal-muted text-center m-0 group-hover:text-[#3E3E3E] transition-colors duration-200">
            Click on my pretty face to open
          </p>
        </div>
      ) : (
        <ButterfliesLetter />
      )}
    </main>
  );
}
