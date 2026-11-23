import React from 'react';
import ButterfliesLetter from './components/ButterfliesLetter';
import BackgroundMusic from './components/BackgroundMusic';

export default function App() {
  return (
    <main className="relative min-h-screen w-full bg-parchment flex flex-col items-center justify-center px-6 py-12 sm:px-12 sm:py-16 md:px-20 md:py-20">
      {/* Background Music Ambient Controller */}
      <BackgroundMusic />

      {/* Adapted letter with word-by-word reveal */}
      <ButterfliesLetter />
    </main>
  );
}
