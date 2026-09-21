import React, { useState } from 'react';
import { Compass, Target, Shield } from 'lucide-react';
import { sound } from '../../utils/audioEngine';

interface Principle {
  id: string;
  title: string;
  hanzi: string;
  subtitle: string;
  description: string;
  quote: string;
  icon: React.ReactNode;
}

export const PrinciplesSection: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const principles: Principle[] = [
    {
      id: 'balance',
      title: 'Balance',
      hanzi: '平衡',
      subtitle: 'Harmony of Stillness and Force',
      description:
        'Like water yielding to stone yet carving canyons, true mastery arises when internal calm and physical action become indistinguishable.',
      quote: 'Stillness in motion; motion in stillness.',
      icon: <Compass className="w-7 h-7 text-gold-400" />,
    },
    {
      id: 'focus',
      title: 'Focus',
      hanzi: '专注',
      subtitle: 'Singular Intent in the Storm',
      description:
        'Clarity of vision cuts through distraction. When the mind rests fully in the present breath, every movement executes with effortless accuracy.',
      quote: 'Where intention leads, chi effortlessly follows.',
      icon: <Target className="w-7 h-7 text-gold-400" />,
    },
    {
      id: 'discipline',
      title: 'Discipline',
      hanzi: '自律',
      subtitle: 'The Forge of Inner Freedom',
      description:
        'Discipline is neither burden nor constraint; it is the sacred ritual of daily return that transforms deliberate thought into pure instinct.',
      quote: 'Mastery is not an act, but a quiet devotion.',
      icon: <Shield className="w-7 h-7 text-gold-400" />,
    },
  ];

  return (
    <section
      id="principles"
      className="relative w-full py-28 sm:py-36 px-6 sm:px-12 lg:px-16 bg-gradient-to-b from-crimson-950 via-[#180205] to-crimson-950 overflow-hidden"
    >
      {/* Background Chinese Calligraphy Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-calligraphy text-[20vw] text-crimson-800/10 pointer-events-none select-none whitespace-nowrap z-0">
        太極圓融
      </div>

      <div className="max-w-[1540px] w-full mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-gold-400/60" />
            <span className="text-xs sm:text-sm font-body tracking-[0.35em] uppercase text-gold-300 font-semibold">
              CORE PHILOSOPHY · 核心之道
            </span>
            <span className="w-8 h-[1px] bg-gold-400/60" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-ivory-100 tracking-wide mb-6 drop-shadow-md">
            The Three Pillars of Mastery
          </h2>

          <p className="font-body text-base sm:text-lg text-ivory-300/85 font-light leading-relaxed">
            Ancient kung fu is not the art of fighting an external opponent; it is the gradual, poetic harmonisation of self, breath, and action.
          </p>
        </div>

        {/* Principles 3-Card Grid - Expansive Widescreen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {principles.map((item, index) => {
            const isHovered = activeCard === item.id;
            const delayClass = index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : 'delay-300';

            return (
              <div
                key={item.id}
                onMouseEnter={() => {
                  setActiveCard(item.id);
                  sound.playChime();
                }}
                onMouseLeave={() => setActiveCard(null)}
                className={`group relative rounded-3xl p-8 sm:p-12 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[460px] animate-fade-in-up ${delayClass} ${
                  isHovered
                    ? 'bg-gradient-to-b from-crimson-900/80 via-crimson-950/90 to-[#120104] -translate-y-3 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-gold-400/60'
                    : 'bg-crimson-950/60 hover:bg-crimson-900/50 border border-gold-500/20 shadow-lg'
                }`}
              >
                {/* Subtle top-right watermark hanzi */}
                <div className="absolute top-4 right-6 font-calligraphy text-7xl text-gold-500/10 group-hover:text-gold-400/25 transition-all duration-500 select-none group-hover:scale-110">
                  {item.hanzi}
                </div>

                <div>
                  {/* Top bar: Icon and index stamp */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-crimson-900/70 border border-gold-500/30 flex items-center justify-center group-hover:border-gold-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all">
                      {item.icon}
                    </div>
                    <span className="text-xs font-mono tracking-widest text-gold-400/70 group-hover:text-gold-300 font-semibold">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title and Hanzi */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="font-heading text-2xl sm:text-3xl text-ivory-100 group-hover:text-gold-200 transition-colors tracking-wide">
                        {item.title}
                      </h3>
                      <span className="font-calligraphy text-2xl text-gold-400/90">
                        {item.hanzi}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-body tracking-wider uppercase text-gold-400/80 font-medium">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="font-body text-sm sm:text-base text-ivory-300/85 font-light leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>

                {/* Quote with gold line */}
                <div className="pt-6 border-t border-crimson-800/60 group-hover:border-gold-500/35 transition-colors">
                  <p className="font-body text-xs sm:text-sm italic text-ivory-300/75 leading-relaxed">
                    “{item.quote}”
                  </p>
                </div>

                {/* Bottom decorative gold accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
