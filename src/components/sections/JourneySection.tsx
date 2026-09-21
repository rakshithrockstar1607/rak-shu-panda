import React, { useState } from 'react';
import { Wind, Eye, Zap, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/audioEngine';
import { getAssetUrl } from '../../utils/assetPath';

interface Step {
  id: number;
  phase: string;
  hanzi: string;
  title: string;
  essence: string;
  description: string;
  quote: string;
  icon: React.ReactNode;
  imageSrc: string;
}

export const JourneySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps: Step[] = [
    {
      id: 1,
      phase: 'PHASE 01',
      hanzi: '调息',
      title: 'Breathe',
      essence: 'Find Stillness and Awareness',
      description:
        'Before the fist can move, the breath must settle. Inhaling clarity, exhaling the sediment of doubt. As the heart rate calms, the world recedes, leaving only the pristine architecture of the present moment.',
      quote: 'When the water settles, the moon reflects without distortion.',
      icon: <Wind className="w-5 h-5" />,
      imageSrc: getAssetUrl('assets/poster_meditation.webp'),
    },
    {
      id: 2,
      phase: 'PHASE 02',
      hanzi: '洞察',
      title: 'Observe',
      essence: 'Clarity, Intention, Focus',
      description:
        'See without straining; perceive without judgment. Read the momentum of the wind, the shift of shadows, and the unspoken currents of intention. When the mind is unclouded, the fastest motion appears serene and deliberate.',
      quote: 'The sage observes the myriad things and discerns their returning.',
      icon: <Eye className="w-5 h-5" />,
      imageSrc: getAssetUrl('assets/poster_action.jpg'),
    },
    {
      id: 3,
      phase: 'PHASE 03',
      hanzi: '发力',
      title: 'Act',
      essence: 'Move with Confidence and Purpose',
      description:
        'When stillness unleashes, power is effortless. Not the force of rigid muscle, but the unified kinetic explosion of mind, breath, and body moving as one single stroke across the canvas of time.',
      quote: 'A lightning strike requires neither hesitation nor regret.',
      icon: <Zap className="w-5 h-5" />,
      imageSrc: getAssetUrl('assets/panda_strike.jpg'),
    },
  ];

  const current = steps[activeStep];

  return (
    <section
      id="journey"
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 lg:px-16 bg-gradient-to-b from-crimson-950 via-[#1e0207] to-crimson-950 overflow-hidden"
    >
      {/* Background Chinese Calligraphy Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-calligraphy text-[18vw] text-gold-500/5 pointer-events-none select-none whitespace-nowrap z-0">
        修身克己
      </div>

      <div className="max-w-[1540px] w-full mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-gold-400/60" />
            <span className="text-xs sm:text-sm font-body tracking-[0.35em] uppercase text-gold-300 font-semibold">
              THE WARRIOR JOURNEY · 修炼之道
            </span>
            <span className="w-8 h-[1px] bg-gold-400/60" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-ivory-100 tracking-wide mb-6 drop-shadow-md">
            From Stillness to Strength
          </h2>

          <p className="font-body text-base sm:text-lg text-ivory-300/85 font-light leading-relaxed">
            A three-fold ritual of internal alchemy. How quiet discipline transforms into unstoppable martial presence.
          </p>
        </div>

        {/* Interactive Step Navigation Bar */}
        <div className="grid grid-cols-3 max-w-4xl mx-auto mb-14 sm:mb-20 border-b border-gold-500/20">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStep(idx);
                  sound.playChime();
                }}
                className={`group relative pb-6 text-center focus:outline-none transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <div className="flex items-center justify-center gap-2.5 mb-2.5">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border transition-colors ${
                      isActive
                        ? 'border-gold-400 bg-gold-500 text-crimson-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.6)]'
                        : 'border-ivory-400/40 text-ivory-300'
                    }`}
                  >
                    0{step.id}
                  </span>
                  <span className="font-heading text-base sm:text-lg text-ivory-100 hidden sm:inline tracking-wide">
                    {step.title}
                  </span>
                  <span className="font-calligraphy text-xl text-gold-400">
                    {step.hanzi}
                  </span>
                </div>

                <div
                  className={`text-xs tracking-wider uppercase font-body transition-colors ${
                    isActive ? 'text-gold-300 font-medium' : 'text-ivory-400'
                  }`}
                >
                  {step.phase}
                </div>

                {/* Active Indicator Underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 shadow-[0_0_14px_rgba(212,175,55,0.85)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Narrative Feature Display Card - Expansive Widescreen */}
        <div className="glass-panel rounded-3xl p-8 sm:p-14 lg:p-16 border border-gold-500/25 shadow-2xl relative overflow-hidden animate-fade-in-up">
          {/* Subtle Hanzi Watermark behind content */}
          <div className="absolute -bottom-8 -right-8 font-calligraphy text-9xl sm:text-[220px] text-gold-500/5 select-none pointer-events-none">
            {current.hanzi}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-crimson-900/60 border border-gold-400/30 text-gold-300 text-xs font-mono tracking-wider">
                {current.icon}
                <span>{current.phase} · {current.essence}</span>
              </div>

              <div className="flex items-baseline gap-4">
                <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-ivory-100 tracking-wide">
                  {current.title}
                </h3>
                <span className="font-calligraphy text-3xl sm:text-5xl text-gold-400 font-bold">
                  {current.hanzi}
                </span>
              </div>

              <p className="font-body text-base sm:text-lg text-ivory-200/90 font-light leading-relaxed">
                {current.description}
              </p>

              {/* Chinese wisdom quote */}
              <div className="p-6 rounded-2xl bg-crimson-950/70 border-l-4 border-gold-400 shadow-lg">
                <p className="font-body italic text-base sm:text-lg text-gold-200/95 leading-relaxed">
                  “{current.quote}”
                </p>
              </div>

              {/* Next step button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveStep((activeStep + 1) % steps.length);
                    sound.playChime();
                  }}
                  className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.25em] uppercase text-gold-300 hover:text-gold-200 transition-colors group focus:outline-none"
                >
                  <span className="font-body">
                    Advance to {steps[(activeStep + 1) % steps.length].title}
                  </span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Media Preview */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden border border-gold-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
                <img
                  src={current.imageSrc}
                  alt={current.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-crimson-950/90 via-transparent to-transparent" />
                
                {/* Stamp overlay */}
                <div className="absolute top-5 right-5 w-11 h-11 rounded-sm bg-[#8a0b18] border border-gold-400/70 flex items-center justify-center font-calligraphy text-gold-300 text-lg font-bold shadow-lg">
                  {current.hanzi}
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400">
                    MOMENTUM LOG
                  </span>
                  <p className="font-heading text-base text-ivory-100 tracking-wide mt-1">
                    {current.essence}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
