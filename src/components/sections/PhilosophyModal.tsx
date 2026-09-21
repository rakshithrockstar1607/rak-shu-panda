import React, { useEffect } from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../../utils/audioEngine';

interface PhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhilosophyModal: React.FC<PhilosophyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-crimson-950/85 backdrop-blur-xl animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#2e0308] to-[#160103] border border-gold-400/40 rounded-3xl p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Background Calligraphy */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-calligraphy text-9xl text-gold-500/5 select-none pointer-events-none">
          道法自然
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playChime();
            onClose();
          }}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-crimson-900/60 border border-gold-500/30 flex items-center justify-center text-ivory-300 hover:text-gold-300 hover:border-gold-400 transition-colors focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-gold-400">
            CHINESE MARTIAL WISDOM · 尚武崇德
          </span>
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-ivory-100 mb-4 leading-snug tracking-wide">
          The Way of Internal Harmony
        </h3>

        <div className="space-y-4 text-base sm:text-lg text-ivory-200/85 font-body font-light leading-relaxed mb-8">
          <p>
            In traditional Chinese kung fu, physical technique is merely the shell. The true mastery—the essence termed <span className="text-gold-300 font-medium">Nei Jia (内家)</span>—is cultivated in silent stillness.
          </p>
          <p>
            When the panda sits in meditation, he is not dormant; he is anchoring his awareness to the center of gravity. His breathing harmonizes the five elements, dissolving anxiety and doubt.
          </p>
          <p>
            When the call to action sounds, there is no hesitation or tense struggle. The leap is as spontaneous as water tumbling over a cliff edge. Stillness and action are not opposites—they are the inhale and exhale of a single warrior spirit.
          </p>
        </div>

        {/* Quote Block */}
        <div className="p-5 rounded-2xl bg-crimson-900/40 border border-gold-500/20 mb-8 flex items-start gap-4">
          <Sparkles className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-body italic text-sm sm:text-base text-gold-200 leading-relaxed mb-1">
              “To know others is wisdom. To conquer oneself is true power.”
            </p>
            <span className="text-xs font-body text-ivory-400 uppercase tracking-widest">
              — Laozi, Dao De Jing (道德经)
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              sound.playChime();
              onClose();
            }}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-crimson-950 font-bold text-xs tracking-[0.2em] uppercase font-body hover:scale-105 transition-transform shadow-lg"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
