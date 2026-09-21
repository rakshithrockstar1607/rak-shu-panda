import React, { useState, useEffect, useRef } from 'react';
import { HeroMode } from './PandaCanvas';
import { sound } from '../../utils/audioEngine';

interface ChiDantianButtonProps {
  mode: HeroMode;
  onTriggerAction: () => void;
}

export const ChiDantianButton: React.FC<ChiDantianButtonProps> = ({
  mode,
  onTriggerAction,
}) => {
  // Stages: 'charging' (2s circle loading) | 'ready' (glowing chi) | 'bursting' (click burst) | 'hidden'
  const [stage, setStage] = useState<'charging' | 'ready' | 'bursting' | 'hidden'>('charging');
  const [chargeProgress, setChargeProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const prevModeRef = useRef(mode);

  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  // 2-Second Charging Animation
  useEffect(() => {
    if (stage !== 'charging') return;

    let startTime: number | null = null;
    let animId: number;
    const duration = 2000; // Exact 2.0s loading

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setChargeProgress(progress);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setStage('ready');
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [stage]);

  // Handle action mode transitions: disappear during action, reappear when meditating
  useEffect(() => {
    if (mode === 'transitioning' || mode === 'action') {
      setStage('hidden');
    } else if (
      mode === 'meditation' &&
      (prevModeRef.current === 'action' ||
        prevModeRef.current === 'transitioning' ||
        prevModeRef.current === 'returning')
    ) {
      // Returned to meditation: delay 700ms then smoothly reappear and start charging again
      const timer = setTimeout(() => {
        setChargeProgress(0);
        setStage('charging');
      }, 700);
      return () => clearTimeout(timer);
    }
    prevModeRef.current = mode;
  }, [mode]);

  const handleClick = () => {
    if (stage !== 'ready') return;

    sound.playGong();
    setStage('bursting');

    // Minimal burst duration (350ms), then trigger action & hide
    setTimeout(() => {
      setStage('hidden');
      onTriggerAction();
    }, 350);
  };

  if (stage === 'hidden') return null;

  const strokeDashoffset = circumference - chargeProgress * circumference;

  return (
    <div
      className={`absolute left-1/2 bottom-8 sm:bottom-10 lg:bottom-12 -translate-x-1/2 z-30 pointer-events-auto transition-all duration-700 select-none ${
        stage === 'bursting' ? 'scale-150 opacity-0 duration-300' : 'scale-100 opacity-100'
      }`}
    >
      {/* Gentle floating levitation container */}
      <div className="relative flex items-center justify-center animate-float-levitate">
        
        {/* Button is 100% transparent at all times (no translucent background) */}

        {/* Minimal Circular Button: Transparent at all times, slightly bigger */}
        <button
          onClick={handleClick}
          onMouseEnter={() => {
            setIsHovered(true);
            if (stage === 'ready') sound.playChime();
          }}
          onMouseLeave={() => setIsHovered(false)}
          disabled={stage !== 'ready'}
          aria-label={stage === 'ready' ? 'Release Chi Energy' : 'Gathering Chi'}
          className={`group relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-transparent flex items-center justify-center focus:outline-none transition-all duration-500 ${
            stage === 'ready'
              ? 'cursor-pointer hover:scale-105 active:scale-95'
              : 'cursor-default'
          }`}
        >
          {/* SVG Circular Border & 2-Second Loading Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 130 130"
          >
            <defs>
              <linearGradient id="chiGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff9c4" />
                <stop offset="50%" stopColor="#ffd54f" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>

            {/* Background delicate track circle (thinner border) */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="rgba(212, 175, 55, 0.2)"
              strokeWidth="0.8"
            />

            {/* Loading / Ready Golden Ring: Thinner normally (1.1px), thicker on hover (2.2px) */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="url(#chiGoldGrad)"
              strokeWidth={isHovered ? '2.2' : '1.1'}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-300 ${
                stage === 'ready'
                  ? 'filter drop-shadow-[0_0_8px_rgba(255,213,79,0.85)]'
                  : 'filter drop-shadow-[0_0_3px_rgba(212,175,55,0.4)]'
              }`}
            />
          </svg>

          {/* Minimal Orbiting Particle Spark when ready */}
          {stage === 'ready' && (
            <div className="absolute inset-0 animate-ring-rotate pointer-events-none">
              <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold-100 shadow-[0_0_10px_#fff59d,0_0_16px_#ffd54f]" />
            </div>
          )}

          {/* Exact Optical Visual Center Content: Calligraphy + Action Label */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            {/* Hanzi Chi 「氣」 Calligraphy */}
            <span
              className={`font-calligraphy text-2xl sm:text-3xl leading-none mb-1 transition-all duration-300 ${
                stage === 'ready'
                  ? isHovered
                    ? 'text-gold-200 scale-110 drop-shadow-[0_0_12px_rgba(255,224,130,0.95)]'
                    : 'text-gold-300 drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]'
                  : 'text-gold-400/50'
              }`}
            >
              氣
            </span>

            {/* Dynamic Action Label */}
            {stage === 'charging' ? (
              <div className="flex flex-col items-center justify-center leading-none">
                <span className="text-[8px] sm:text-[9px] font-body tracking-[0.26em] uppercase text-gold-300 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-tight">
                  LOADING
                </span>
                <span className="text-[10px] sm:text-[11px] font-heading tracking-[0.14em] text-gold-300/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-tight mt-0.5">
                  CHI ENERGY
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center leading-none">
                <span
                  className={`text-[8px] sm:text-[9px] font-body tracking-[0.28em] uppercase font-semibold transition-colors duration-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] leading-tight ${
                    isHovered ? 'text-ivory-100' : 'text-gold-200'
                  }`}
                >
                  RELEASE
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] font-heading tracking-[0.14em] transition-all duration-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] leading-tight mt-0.5 ${
                    isHovered
                      ? 'text-gold-100 drop-shadow-[0_0_10px_rgba(255,235,150,0.95)]'
                      : 'text-gold-300 drop-shadow-[0_0_6px_rgba(212,175,55,0.75)]'
                  }`}
                >
                  CHI ENERGY
                </span>
              </div>
            )}
          </div>

          {/* Minimal Ethereal Expanding Burst on click */}
          {stage === 'bursting' && (
            <div className="absolute inset-0 rounded-full border-2 border-gold-200 animate-ping pointer-events-none" />
          )}
        </button>

        {/* Minimal Subtitle Hint */}
        {stage === 'ready' && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="text-[9px] font-body tracking-widest uppercase text-gold-300 font-light drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Click to awaken spirit
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
