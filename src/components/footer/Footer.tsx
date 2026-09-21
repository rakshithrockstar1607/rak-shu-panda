import React from 'react';
import { sound } from '../../utils/audioEngine';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    sound.playChime();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full py-16 sm:py-20 px-6 sm:px-12 lg:px-16 bg-crimson-950 border-t border-gold-500/15 overflow-hidden font-body">
      <div className="max-w-[1540px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Brand & Inscription */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#d4af37"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="210 30"
                  fill="none"
                />
                <circle cx="50" cy="50" r="14" fill="#d4af37" opacity="0.85" />
              </svg>
            </div>
            <div className="flex flex-col text-left justify-center">
              <span className="font-heading text-[11px] sm:text-[13px] tracking-[0.16em] uppercase text-gold-300 leading-none mb-1">
                RAK SHU
              </span>
              <span className="font-heading tracking-[0.14em] text-base text-ivory-100 leading-none">
                PANDA
              </span>
            </div>
          </div>

          <p className="font-body italic text-sm text-ivory-400 font-light max-w-sm">
            “The master does not conquer others, but conquers himself.”
          </p>
        </div>

        {/* Navigation links */}
        <div className="flex flex-wrap justify-center gap-8 text-xs tracking-[0.25em] text-ivory-300 font-body">
          <button
            onClick={() => scrollTo('home')}
            className="hover:text-gold-300 transition-colors uppercase focus:outline-none"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('principles')}
            className="hover:text-gold-300 transition-colors uppercase focus:outline-none"
          >
            Principles
          </button>
          <button
            onClick={() => scrollTo('journey')}
            className="hover:text-gold-300 transition-colors uppercase focus:outline-none"
          >
            Journey
          </button>
        </div>

        {/* Right Stamp & Year */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-sm bg-[#8a0b18] border border-gold-400/60 flex items-center justify-center font-calligraphy text-gold-300 text-base font-bold shadow-md">
            道
          </div>
          <div className="text-right font-body">
            <div className="text-[10px] font-mono tracking-widest text-gold-400">
              EST. MMXXVI
            </div>
            <div className="text-xs text-ivory-400 tracking-wider">
              Inner Peace & Martial Grace
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-[1540px] w-full mx-auto mt-12 pt-6 border-t border-crimson-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-400/60 tracking-wider font-body">
        <p>© 2026 Panda Experience. All martial rights reserved.</p>
        <p className="font-calligraphy text-gold-400/80 text-base mt-2 sm:mt-0">
          心如止水 · 大道至簡
        </p>
      </div>
    </footer>
  );
};
