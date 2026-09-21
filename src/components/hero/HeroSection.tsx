import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PandaCanvas, HeroMode } from './PandaCanvas';
import { HeroContent } from './HeroContent';
import { AtmosphereScene } from '../webgl/AtmosphereScene';
import { ChiDantianButton } from './ChiDantianButton';

interface HeroSectionProps {
  mode: HeroMode;
  onModeChange: (newMode: HeroMode) => void;
  onOpenPhilosophy: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  mode,
  onModeChange,
  onOpenPhilosophy,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Normalize to -1 to 1 across viewport
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePos({ x, y });
  }, []);

  // Touch move handler for mobile
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const x = (touch.clientX / window.innerWidth) * 2 - 1;
      const y = (touch.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // When mouse leaves window, gracefully return to center meditation
    const handleMouseLeave = () => {
      setMousePos({ x: 0, y: 0 });
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleTouchMove]);

  const triggerAction = () => {
    if (mode === 'meditation') {
      onModeChange('transitioning');
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-crimson-950 via-crimson-900 to-crimson-950 select-none"
    >
      {/* 1. Deep Vignette and Radial Atmospheric Glow (Background Layer z-0) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(142,14,26,0.65)_0%,rgba(43,3,7,0.88)_55%,rgba(20,1,3,1)_100%)] pointer-events-none z-0" />

      {/* 2. Central Hero Panda: 100vw & 100vh Full Screen Edge-to-Edge (Layer z-10) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10">
        <PandaCanvas
          mode={mode}
          onModeChange={onModeChange}
          mousePos={mousePos}
        />
      </div>

      {/* 3. Three.js Glowing Rising Chi Embers / Balls (Layer z-20 ON TOP of video sequence) */}
      <AtmosphereScene isAction={mode === 'action'} mousePos={mousePos} />

      {/* 4. Chi Dantian Levitating Circular Button (Layer z-25 near belly of Panda) */}
      <ChiDantianButton
        mode={mode}
        onTriggerAction={triggerAction}
      />

      {/* 5. Editorial Content & Interactive UI Overlay (Layer z-30) */}
      <HeroContent
        mode={mode}
        onOpenPhilosophy={onOpenPhilosophy}
        mousePos={mousePos}
      />
    </section>
  );
};
