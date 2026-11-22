import React, { useState, useEffect } from 'react';
import ButterfliesLetter from './components/ButterfliesLetter';

export default function App() {
  const [isArtboardOnly, setIsArtboardOnly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('artboard') === '1') {
      setIsArtboardOnly(true);
    }
  }, []);

  if (isArtboardOnly) {
    return <ButterfliesLetter />;
  }

  return (
    <main className="min-h-screen bg-[#EDE7DF] flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Figma Frame Container locked to 390x651 */}
      <div className="relative shadow-2xl rounded-sm overflow-hidden border border-black/10">
        <ButterfliesLetter />
      </div>

      {/* Frame Dimensions & Specs Badge */}
      <footer className="mt-4 flex items-center gap-3 text-xs text-neutral-600 font-mono">
        <span className="bg-white/80 px-2.5 py-1 rounded-full shadow-sm border border-black/5">
          Figma Frame: iPhone 13 & 14 - 1
        </span>
        <span className="bg-white/80 px-2.5 py-1 rounded-full shadow-sm border border-black/5">
          390px × 651px
        </span>
        <a
          href="?artboard=1"
          className="text-amber-800 hover:text-amber-950 underline font-sans"
        >
          View Pure Artboard
        </a>
      </footer>
    </main>
  );
}
