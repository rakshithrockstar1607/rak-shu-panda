import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  alpha: number;
  size: number;
}

export const WujiCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Inertial tracking positions
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    // Only enable custom cursor on devices with fine pointer (mouse / trackpad)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Spawn subtle chi tail particle occasionally
      if (Math.random() < 0.28) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          alpha: 0.65,
          size: Math.random() * 2.5 + 1.5,
        });
        if (particles.current.length > 18) {
          particles.current.shift();
        }
      }

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.classList.contains('cursor-pointer') ||
          target.closest('.cursor-pointer')
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      // Spawn extra chi burst sparks on click
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const dist = Math.random() * 8 + 4;
        particles.current.push({
          x: mousePos.current.x + Math.cos(angle) * dist,
          y: mousePos.current.y + Math.sin(angle) * dist,
          alpha: 0.85,
          size: Math.random() * 3 + 2,
        });
      }
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // RAF Loop for silky smooth inertial following and particle tail rendering
    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);

      // Smooth lerp for the outer ring (fluid chi delay)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Render Chi Tail particles on Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          for (let i = particles.current.length - 1; i >= 0; i--) {
            const p = particles.current[i];
            p.alpha -= 0.022;
            p.size *= 0.96;

            if (p.alpha <= 0 || p.size <= 0.2) {
              particles.current.splice(i, 1);
              continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 222, 122, ${p.alpha})`;
            ctx.shadowColor = '#ffd54f';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
    };

    animId = requestAnimationFrame(render);

    // Handle canvas resizing to full window
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 1. Canvas for ethereal trailing Chi sparkles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 2. Outer Smooth-Inertial Chi Orbit Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border transition-[width,height,border-color,box-shadow] duration-300 ease-out flex items-center justify-center pointer-events-none ${
          isHovered
            ? 'w-11 h-11 border-gold-300 shadow-[0_0_18px_rgba(245,222,122,0.65)]'
            : isClicked
            ? 'w-7 h-7 border-gold-400/90 scale-90 shadow-[0_0_12px_rgba(212,175,55,0.8)]'
            : 'w-8 h-8 border-gold-400/50 shadow-[0_0_10px_rgba(212,175,55,0.3)]'
        }`}
      >
        {/* Soft inner ambient glow */}
        <div
          className={`w-full h-full rounded-full transition-opacity duration-300 ${
            isHovered ? 'bg-gold-400/15' : 'bg-transparent'
          }`}
        />
      </div>

      {/* 3. Center Wuji Primordial Chi Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none transition-transform duration-100 ${
          isHovered
            ? 'w-2.5 h-2.5 bg-ivory-100 shadow-[0_0_12px_#fff2a3,0_0_20px_#ffd54f] scale-125'
            : isClicked
            ? 'w-3 h-3 bg-gold-200 shadow-[0_0_14px_#f5de7a] scale-110'
            : 'w-2 h-2 bg-gold-300 shadow-[0_0_8px_#ffd54f]'
        }`}
      />
    </div>
  );
};
