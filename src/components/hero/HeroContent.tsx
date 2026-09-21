import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { HeroMode } from './PandaCanvas';
import { sound } from '../../utils/audioEngine';
import { InteractiveClothBanner } from '../cloth/InteractiveClothBanner';

interface HeroContentProps {
  mode: HeroMode;
  onOpenPhilosophy: () => void;
  mousePos: { x: number; y: number };
}

export const HeroContent: React.FC<HeroContentProps> = ({
  mode,
  onOpenPhilosophy,
  mousePos,
}) => {
  // Parallax subtle offset
  const parallaxX = mousePos.x * 12;
  const parallaxY = mousePos.y * 8;

  return (
    <div className="relative w-full min-h-screen flex items-center pointer-events-none z-10 pt-20 pb-12 px-6 sm:px-12 lg:px-16">
      <div className="w-full max-w-[1540px] mx-auto flex flex-col justify-between min-h-[calc(100vh-140px)]">
        
        {/* Top Spacer */}
        <div className="h-6 sm:h-12" />

        {/* Main Grid: Left Typography, Center Panda Breathing Room, Right Calligraphy & Cloth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 my-auto">
          
          {/* LEFT: Editorial Typography (Columns 1-5) */}
          <div
            className="lg:col-span-5 pointer-events-auto transition-transform duration-700 ease-out"
            style={{
              transform: `translate3d(${-parallaxX * 0.4}px, ${-parallaxY * 0.4}px, 0)`,
            }}
          >
            {/* Eyebrow with gold accent divider */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="text-[11px] sm:text-xs font-body tracking-[0.3em] uppercase text-gold-300/90 font-medium">
                {mode === 'action' || mode === 'transitioning'
                  ? 'SPIRIT AWAKENING'
                  : 'A CALMER STRONGER YOU'}
              </span>
              <div className="w-8 sm:w-12 h-[1px] bg-gold-400/50" />
            </div>

            {/* Headline with Google Font Slackey */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.15] tracking-wide text-ivory-100 mb-4 sm:mb-6 transition-all duration-500 drop-shadow-xl">
              {mode === 'action' || mode === 'transitioning' ? (
                <>
                  Power <br />
                  <span className="font-heading gold-shimmer text-gold-300">Awakens</span> Within.
                </>
              ) : (
                <>
                  Balance <br />
                  <span className="font-heading text-gold-400">Fuels</span> Greatness.
                </>
              )}
            </h1>

            {/* Supporting Copy with Google Font Fredoka Light 300 */}
            <p className="font-body text-sm sm:text-base text-ivory-300/90 font-light leading-relaxed max-w-md mb-8 sm:mb-10">
              {mode === 'action' || mode === 'transitioning'
                ? 'From total stillness springs decisive mastery. Align mind, body, and breath into flawless purpose.'
                : 'Discipline today. A brighter tomorrow. Cultivate tranquility of mind to command effortless strength in motion.'}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-6">
              {/* Primary CTA Button: Scrolls down to next section */}
              <button
                onClick={() => {
                  sound.playChime();
                  document.getElementById('principles')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl focus:outline-none bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-crimson-950 hover:shadow-gold-500/30 hover:scale-[1.03]"
              >
                <span className="font-body font-medium">Start Your Journey</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA: Watch Story / Philosophy */}
              <button
                onClick={() => {
                  sound.playChime();
                  onOpenPhilosophy();
                }}
                className="group flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-ivory-200 hover:text-gold-300 transition-colors py-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full border border-gold-400/40 flex items-center justify-center bg-crimson-900/30 group-hover:border-gold-300 group-hover:bg-gold-500/15 transition-all">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-gold-300" />
                </div>
                <span>Watch Story</span>
              </button>
            </div>
          </div>

          {/* CENTER: Panda Spatial Spacer for Desktop (Columns 6-8) */}
          <div className="hidden lg:block lg:col-span-4" />

          {/* RIGHT: Chinese Calligraphy, Seal, and Interactive Cloth Banner (Columns 9-12) */}
          <div
            className="lg:col-span-3 flex flex-col items-end pointer-events-auto justify-between space-y-8 overflow-visible"
            style={{
              transform: `translate3d(${parallaxX * 0.3}px, ${parallaxY * 0.3}px, 0)`,
            }}
          >
            {/* Top Right: Vertical Calligraphy & Imperial Red Seal */}
            <div className="flex flex-col items-center text-center">
              <span className="font-calligraphy text-4xl sm:text-5xl text-ivory-100 font-bold tracking-widest leading-tight drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)]">
                {mode === 'action' || mode === 'transitioning' ? '勇猛' : '平衡'}
              </span>
              
              {/* Traditional red wax/ink chop seal */}
              <div className="mt-2 w-8 h-8 rounded-sm bg-[#8a0b18] border border-gold-400/60 shadow-md flex items-center justify-center text-gold-300 font-calligraphy text-sm font-bold">
                {mode === 'action' || mode === 'transitioning' ? '武' : '禪'}
              </div>

              {/* Stacked 4-line typography matching inspiration image */}
              <div className="mt-3 text-center text-[9px] tracking-[0.25em] text-ivory-300/80 font-sans uppercase leading-tight font-medium space-y-0.5 select-none">
                <div>BALANCE</div>
                <div>CREATES</div>
                <div>A BRIGHTER</div>
                <div>TOMORROW</div>
              </div>
            </div>

            {/* Bottom Right: Interactive Chinese Silk Cloth Banner with Physics! */}
            <div className="pt-2 overflow-visible">
              <InteractiveClothBanner />
            </div>
          </div>

        </div>

        {/* BOTTOM: Scroll Indicator & Editorial Tagline */}
        <div className="flex items-end justify-between pt-8 sm:pt-12 pointer-events-auto">
          {/* Scroll to explore */}
          <a
            href="#principles"
            onClick={(e) => {
              e.preventDefault();
              sound.playChime();
              document.getElementById('principles')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-ivory-400 hover:text-gold-300 transition-colors"
          >
            <div className="relative w-5 h-5 rounded-full border border-ivory-400/40 group-hover:border-gold-300 flex items-center justify-center transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            </div>
            <span className="font-medium">Scroll to explore</span>
          </a>

          {/* Right Tagline */}
          <div className="text-[11px] tracking-[0.3em] uppercase text-ivory-400 font-light hidden sm:block">
            — A Kinder Stronger World
          </div>
        </div>

      </div>
    </div>
  );
};
