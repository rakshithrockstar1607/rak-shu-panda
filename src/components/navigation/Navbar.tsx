import React, { useState, useEffect } from 'react';
import { VolumeX, Search } from 'lucide-react';
import { sound } from '../../utils/audioEngine';

interface NavbarProps {
  onOpenPhilosophy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPhilosophy }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newMuteState = sound.toggleMute();
    setIsMuted(newMuteState);
    if (!newMuteState) {
      sound.playChime();
    }
  };

  const scrollTo = (id: string) => {
    sound.playChime();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 bg-crimson-950/85 backdrop-blur-xl border-b border-gold-500/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'py-6 sm:py-8 bg-gradient-to-b from-crimson-950/90 via-crimson-950/40 to-transparent'
      }`}
    >
      <div className="relative max-w-[1540px] mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('home');
          }}
          className="flex items-center gap-3.5 group focus:outline-none"
        >
          {/* Enso brush ring logo */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-500 group-hover:rotate-180 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="url(#ensoGold)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="210 30"
                fill="none"
              />
              <circle cx="50" cy="50" r="14" fill="#d4af37" opacity="0.85" />
              <defs>
                <linearGradient id="ensoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5de7a" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#8c6e17" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Balanced Two-Line Logo: RAK SHU / PANDA (both in Slackey font) */}
          <div className="flex flex-col text-left justify-center">
            <span className="font-heading text-[11px] sm:text-[13px] tracking-[0.16em] uppercase text-gold-300 leading-none mb-1">
              RAK SHU
            </span>
            <span className="font-heading tracking-[0.14em] text-base sm:text-lg text-ivory-100 group-hover:text-gold-200 transition-colors leading-none">
              PANDA
            </span>
          </div>
        </a>

        {/* Center: Clean Nav Links (Desktop) - Exactly centered to the frame */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 lg:gap-10 font-body">
          {[
            { label: 'HOME', id: 'home' },
            { label: 'PHILOSOPHY', id: 'philosophy', onClick: onOpenPhilosophy },
            { label: 'PRINCIPLES', id: 'principles' },
            { label: 'JOURNEY', id: 'journey' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => (item.onClick ? item.onClick() : scrollTo(item.id))}
              className="relative text-xs tracking-[0.25em] text-ivory-200/80 hover:text-gold-300 transition-colors py-1 group focus:outline-none font-medium"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold-400 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Right: Sound Toggle, Search, and Primary CTA */}
        <div className="flex items-center gap-4 sm:gap-6 font-body">
          {/* Bamboo Flute & Temple Soundtrack Audio Toggle */}
          <button
            onClick={handleSoundToggle}
            className={`flex items-center gap-2.5 px-3 sm:px-4 py-1.5 rounded-full text-xs transition-all duration-300 border focus:outline-none ${
              isMuted
                ? 'bg-crimson-950/60 border-gold-500/20 text-ivory-400 hover:border-gold-400/40 hover:text-ivory-200'
                : 'bg-gold-500/15 border-gold-400/50 text-gold-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
            }`}
            aria-label="Toggle Bamboo Soundtrack"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 opacity-60" />
            ) : (
              <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                <span className="w-[2px] h-2 bg-gold-300 animate-pulse" />
                <span className="w-[2px] h-3.5 bg-gold-300 animate-pulse [animation-delay:150ms]" />
                <span className="w-[2px] h-2.5 bg-gold-400 animate-pulse [animation-delay:300ms]" />
                <span className="w-[2px] h-1.5 bg-gold-300 animate-pulse [animation-delay:450ms]" />
              </div>
            )}
            <span className="text-[10px] hidden sm:inline tracking-widest uppercase font-medium">
              {isMuted ? 'Music Off' : '竹林清风'}
            </span>
          </button>

          {/* Search Icon */}
          <button
            onClick={onOpenPhilosophy}
            className="text-ivory-300 hover:text-gold-300 transition-colors focus:outline-none p-1.5 hidden sm:block"
            aria-label="Search or Explore Philosophy"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Gold Pill CTA Button: Scrolls down to principles */}
          <button
            onClick={() => {
              sound.playChime();
              scrollTo('principles');
            }}
            className="relative px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 focus:outline-none border shadow-lg bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-crimson-950 border-gold-300/40 hover:shadow-gold-500/25 hover:scale-[1.03]"
          >
            Get Started
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-ivory-200 hover:text-gold-300 focus:outline-none p-1"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`h-0.5 w-full bg-current transition-all ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`h-0.5 w-full bg-current transition-all ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-0.5 w-full bg-current transition-all ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-4 pb-6 bg-crimson-950/95 border-b border-gold-500/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            {[
              { label: 'HOME', id: 'home' },
              { label: 'PHILOSOPHY', id: 'philosophy', onClick: onOpenPhilosophy },
              { label: 'PRINCIPLES', id: 'principles' },
              { label: 'JOURNEY', id: 'journey' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => (item.onClick ? item.onClick() : scrollTo(item.id))}
                className="text-left text-xs tracking-[0.2em] text-ivory-200 py-2 border-b border-crimson-800/40 focus:outline-none"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
