import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';
import '../src/styles/cassette-futurism.css';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);

  useEffect(() => {
    // Fade in on mount
    const fadeInTimer = setTimeout(() => setIsFadingIn(false), 100);
    // Show prompt after a short delay
    const promptTimer = setTimeout(() => setShowPrompt(true), 1500);
    
    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(promptTimer);
    };
  }, []);

  const handleStartInteraction = async () => {
    if (isFadingOut) return;

    // Try to enter fullscreen
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.log('Fullscreen request denied or failed:', err);
    }

    // Start fade out animation
    setIsFadingOut(true);

    // Call onStart immediately, let Home handle its own entry
    onStart();
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartInteraction();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFadingOut]); // Add dependency to avoid stale closure if handling logic changes

  return (
      <div 
        className={`w-full h-screen bg-boot flex flex-col items-center justify-center relative cursor-pointer overflow-hidden transition-opacity duration-1000 ${isFadingIn ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleStartInteraction}
      >
      {/* Background layers - Minimalist functionality */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-pulse"></div>
      
      {/* Moving Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-cta/20 to-transparent animate-scanline"></div>
      </div>
      
      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        
        {/* Main Logo / Title Area */}
        <div className="flex flex-col items-center group">
          <Terminal size={64} className="text-cta phosphor-glow mb-6 opacity-90 animate-glitch" />
          <h1 className="font-heading text-6xl md:text-8xl text-cta phosphor-glow tracking-widest text-center select-none animate-breathe transition-all duration-300 group-hover:scale-105">
            WASTELAND 2155
          </h1>
          <div className="w-full h-px bg-cta/30 mt-8 mb-2 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          <p className="font-terminal text-cta/70 tracking-[0.5em] text-sm uppercase animate-pulse">Secure Terminal Uplink</p>
        </div>

        {/* Interaction Prompt - Simple and clean */}
        <div className={`transition-opacity duration-500 ${showPrompt ? 'opacity-100' : 'opacity-0'}`}>
          <div className="font-heading text-xl md:text-2xl text-cta animate-pulse text-center space-y-2 cursor-pointer hover:text-white transition-colors">
            <p className="border-b-2 border-transparent hover:border-cta inline-block pb-1">&gt; INITIALIZE SYSTEM_</p>
          </div>
        </div>

      </div>

      {/* Decorative corners - Green HUD style with original positioning */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-green-500"></div>
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-green-500"></div>
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-green-500"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-green-500"></div>
      </div>
  );
};
