import React, { useState } from 'react';
import ButterfliesLetter from './components/ButterfliesLetter';

export default function App() {
  const [instant, setInstant] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [animationKey, setAnimationKey] = useState(0);

  const handleReplay = () => {
    setInstant(false);
    setAnimationKey((prev) => prev + 1);
  };

  const handleToggleInstant = () => {
    setInstant((prev) => !prev);
  };

  const handleToggleSpeed = () => {
    setSpeed((prev) => (prev === 1 ? 1.6 : 1));
    setInstant(false);
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen w-full bg-parchment flex flex-col items-center justify-between px-6 py-10 sm:px-12 sm:py-16 md:px-20 md:py-20 transition-colors duration-300">
      {/* Decorative subtle top spacer to keep vertical balance */}
      <div className="w-full h-2 sm:h-6" aria-hidden="true" />

      {/* Responsive, adaptable letter content */}
      <ButterfliesLetter
        instant={instant}
        speed={speed}
        animationKey={animationKey}
      />

      {/* Minimalist, elegant floating controls */}
      <footer className="mt-8 sm:mt-12 flex items-center justify-center gap-3 text-xs font-mono text-[#5C5C5C]/75 select-none print:hidden">
        <button
          onClick={handleReplay}
          className="px-3 py-1.5 rounded-full bg-[#D7C4A5]/50 hover:bg-[#D7C4A5] text-[#4A4A4A] transition-colors duration-200 border border-[#C8B493]/60 focus:outline-none focus:ring-1 focus:ring-[#8C7A5D]"
          title="Replay word animation"
        >
          ↻ Replay
        </button>

        <button
          onClick={handleToggleInstant}
          className="px-3 py-1.5 rounded-full bg-[#D7C4A5]/50 hover:bg-[#D7C4A5] text-[#4A4A4A] transition-colors duration-200 border border-[#C8B493]/60 focus:outline-none focus:ring-1 focus:ring-[#8C7A5D]"
        >
          {instant ? '▶ Play Motion' : '⚡ Show All'}
        </button>

        <button
          onClick={handleToggleSpeed}
          className="px-3 py-1.5 rounded-full bg-[#D7C4A5]/50 hover:bg-[#D7C4A5] text-[#4A4A4A] transition-colors duration-200 border border-[#C8B493]/60 focus:outline-none focus:ring-1 focus:ring-[#8C7A5D]"
          title="Toggle speed"
        >
          {speed === 1 ? '1.0x' : '1.6x'}
        </button>
      </footer>
    </main>
  );
}
