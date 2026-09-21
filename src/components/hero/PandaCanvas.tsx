import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../../utils/audioEngine';
import { getAssetUrl } from '../../utils/assetPath';

export type HeroMode = 'meditation' | 'transitioning' | 'action' | 'returning';

interface PandaCanvasProps {
  mode: HeroMode;
  onModeChange: (newMode: HeroMode) => void;
  mousePos: { x: number; y: number }; // normalized -1 to 1 (0 is center)
}

const BREATHE_TOTAL_FRAMES = 118;
const LOOK_LEFT_FRAMES = 28; // Frames 119 to 146 (natural turn from center to left)
const LOOK_RIGHT_FRAMES = 27; // Frames 167 to 193 (natural turn from center to right)
const CENTER_DEADZONE = 0.22; // Within panda body (|x| <= 0.22): continuous breathing loop

export const PandaCanvas: React.FC<PandaCanvasProps> = ({
  mode,
  onModeChange,
  mousePos,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoActionRef = useRef<HTMLVideoElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Image buffers
  const breatheFramesRef = useRef<HTMLImageElement[]>([]);
  const lookLeftFramesRef = useRef<HTMLImageElement[]>([]);
  const lookRightFramesRef = useRef<HTMLImageElement[]>([]);

  // State refs for animation
  const modeRef = useRef(mode);
  const mousePosRef = useRef(mousePos);

  // Animation progression tracking
  const breatheIdxRef = useRef(0);
  const breatheDirRef = useRef(1); // 1 = inhale (0 -> 117), -1 = exhale (117 -> 0)
  const breatheClockRef = useRef(0);
  const currentGazeXRef = useRef(0); // Continuous gaze: -1 (far left) to +1 (far right), 0 is center
  const prevGazeXRef = useRef(0);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos]);

  // Preload all frames progressively
  useEffect(() => {
    const totalFrames = BREATHE_TOTAL_FRAMES + LOOK_LEFT_FRAMES + LOOK_RIGHT_FRAMES;
    let loadedCount = 0;

    const breatheImgs: HTMLImageElement[] = [];
    const leftImgs: HTMLImageElement[] = [];
    const rightImgs: HTMLImageElement[] = [];

    const handleImgLoad = () => {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
      if (loadedCount >= BREATHE_TOTAL_FRAMES && breatheFramesRef.current.length === 0) {
        breatheFramesRef.current = breatheImgs;
        setImagesLoaded(true);
      }
      if (loadedCount === totalFrames) {
        lookLeftFramesRef.current = leftImgs;
        lookRightFramesRef.current = rightImgs;
      }
    };

    // 1. Preload 118 breathing frames
    for (let i = 1; i <= BREATHE_TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, '0');
      img.src = getAssetUrl(`assets/sequence/breathe/b_${num}.webp`);
      img.onload = handleImgLoad;
      img.onerror = handleImgLoad;
      breatheImgs.push(img);
    }

    // 2. Preload 28 look left frames
    for (let i = 1; i <= LOOK_LEFT_FRAMES; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, '0');
      img.src = getAssetUrl(`assets/sequence/look_left/l_${num}.webp`);
      img.onload = handleImgLoad;
      img.onerror = handleImgLoad;
      leftImgs.push(img);
    }

    // 3. Preload 27 look right frames
    for (let i = 1; i <= LOOK_RIGHT_FRAMES; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, '0');
      img.src = getAssetUrl(`assets/sequence/look_right/r_${num}.webp`);
      img.onload = handleImgLoad;
      img.onerror = handleImgLoad;
      rightImgs.push(img);
    }
  }, []);

  // 60 FPS Living Panda Canvas Render Loop with Sub-Frame Blending & Dynamic Motion Blur
  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.round((rect.width || window.innerWidth) * dpr);
      const h = Math.round((rect.height || window.innerHeight) * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      if (modeRef.current !== 'meditation') return;

      const dt = Math.min(0.05, Math.max(0.001, (time - lastTime) / 1000));
      lastTime = time;

      const x = mousePosRef.current.x;

      // 1. Continuous target gaze calculation (-1 to +1, 0 is center)
      let targetGazeX = 0;
      if (x < -CENTER_DEADZONE) {
        targetGazeX = -Math.min(1, (-x - CENTER_DEADZONE) / (0.86 - CENTER_DEADZONE));
      } else if (x > CENTER_DEADZONE) {
        targetGazeX = Math.min(1, (x - CENTER_DEADZONE) / (0.86 - CENTER_DEADZONE));
      }

      // 2. Smooth exponential spring for head gaze
      const prevGaze = currentGazeXRef.current;
      const springSpeed = Math.abs(targetGazeX) < 0.05 ? 11.0 : 13.0; // gentle ease-in to center
      const factor = 1 - Math.exp(-springSpeed * dt);
      currentGazeXRef.current += (targetGazeX - currentGazeXRef.current) * factor;
      const currentGaze = currentGazeXRef.current;

      // 3. Measure gaze velocity for ultra-subtle optical motion blur (whisper-soft shutter smoothing)
      const gazeVelocity = Math.abs(currentGaze - prevGaze) / dt;
      const blurAmount = Math.min(0.45, Math.max(0, (gazeVelocity - 0.5) * 0.15));

      // 4. Synchronize breathing cycle
      breatheClockRef.current += dt;
      if (Math.abs(currentGaze) < 0.05) {
        // Center: breathe in natural ping-pong cycle at 30 fps
        if (breatheClockRef.current >= 1 / 30) {
          breatheClockRef.current -= 1 / 30;
          breatheIdxRef.current += breatheDirRef.current;
          if (breatheIdxRef.current >= BREATHE_TOTAL_FRAMES - 1) {
            breatheIdxRef.current = BREATHE_TOTAL_FRAMES - 1;
            breatheDirRef.current = -1;
          } else if (breatheIdxRef.current <= 0) {
            breatheIdxRef.current = 0;
            breatheDirRef.current = 1;
          }
        }
      } else {
        // Looking away: gently wind down breatheIdx to 0 so returning to center is seamless
        if (breatheIdxRef.current > 0 && breatheClockRef.current >= 1 / 60) {
          breatheClockRef.current -= 1 / 60;
          breatheIdxRef.current = Math.max(0, breatheIdxRef.current - 2);
        }
      }

      // Helper function to draw an image centered with full-bleed cover mode
      const drawCover = (img: HTMLImageElement | null | undefined, alpha = 1.0) => {
        if (!img || !img.complete || img.naturalWidth === 0) return;
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        const scale = Math.max(canvas.width / imgW, canvas.height / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const drawX = (canvas.width - drawW) * 0.5;
        const drawY = (canvas.height - drawH) * 0.5;
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      };

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle optical motion blur when head is turning rapidly
      if (blurAmount > 0.12) {
        ctx.filter = `blur(${blurAmount.toFixed(2)}px)`;
      } else {
        ctx.filter = 'none';
      }

      // 5. Sub-frame dual-buffer blended rendering
      if (currentGaze <= 0) {
        // Center or looking LEFT
        const progress = -currentGaze; // 0 to 1
        const virtualIdx = progress * (LOOK_LEFT_FRAMES - 1);
        const idx0 = Math.floor(virtualIdx);
        const idx1 = Math.min(LOOK_LEFT_FRAMES - 1, idx0 + 1);
        const subFrac = virtualIdx - idx0;

        // Base frame
        drawCover(lookLeftFramesRef.current[idx0], 1.0);

        // Sub-frame crossfade
        if (subFrac > 0.005) {
          drawCover(lookLeftFramesRef.current[idx1], subFrac);
        }

        // Seamless zero-pop crossfade to breathing as gaze nears center
        if (progress < 0.14) {
          const breatheWeight = Math.max(0, Math.min(1, (0.14 - progress) / 0.14));
          if (breatheWeight > 0.01) {
            drawCover(breatheFramesRef.current[breatheIdxRef.current], breatheWeight);
          }
        }
      } else {
        // Looking RIGHT
        const progress = currentGaze; // 0 to 1
        const virtualIdx = progress * (LOOK_RIGHT_FRAMES - 1);
        const idx0 = Math.floor(virtualIdx);
        const idx1 = Math.min(LOOK_RIGHT_FRAMES - 1, idx0 + 1);
        const subFrac = virtualIdx - idx0;

        // Base frame
        drawCover(lookRightFramesRef.current[idx0], 1.0);

        // Sub-frame crossfade
        if (subFrac > 0.005) {
          drawCover(lookRightFramesRef.current[idx1], subFrac);
        }

        // Seamless zero-pop crossfade to breathing as gaze nears center
        if (progress < 0.14) {
          const breatheWeight = Math.max(0, Math.min(1, (0.14 - progress) / 0.14));
          if (breatheWeight > 0.01) {
            drawCover(breatheFramesRef.current[breatheIdxRef.current], breatheWeight);
          }
        }
      }

      // Reset filter and alpha for next frame
      ctx.globalAlpha = 1.0;
      ctx.filter = 'none';
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
    };
  }, [imagesLoaded]);

  // Handle action video playback (play Panda transition 1 and reverse back to meditation)
  useEffect(() => {
    if (mode === 'transitioning' || mode === 'action') {
      sound.playWhoosh();
      if (videoActionRef.current) {
        videoActionRef.current.currentTime = 0;
        videoActionRef.current.play().catch(() => {});
      }
    } else {
      if (videoActionRef.current) {
        videoActionRef.current.pause();
      }
    }
  }, [mode]);

  const handleActionEnd = useCallback(() => {
    // When forward leap & reverse landing completes, resume meditation loop seamlessly
    breatheIdxRef.current = 0;
    breatheDirRef.current = 1;
    breatheClockRef.current = 0;
    currentGazeXRef.current = 0;
    prevGazeXRef.current = 0;
    onModeChange('meditation');
  }, [onModeChange]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {!imagesLoaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-crimson-950/85 backdrop-blur-md">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-gold-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-t-gold-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center font-calligraphy text-gold-300 text-lg">
              禪
            </div>
          </div>
          <span className="font-heading tracking-widest text-gold-300 text-sm">
            凝神聚气 · {loadProgress}%
          </span>
          <span className="font-body text-xs tracking-wider text-ivory-300 mt-1 uppercase opacity-70">
            Awakening Inner Spirit
          </span>
        </div>
      )}

      {/* Layer 1: Living Panda Canvas (30 FPS Breathing & Dynamic Mouse Gaze Tracking) */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ease-out ${
          mode === 'meditation'
            ? 'opacity-100 z-10 scale-100'
            : 'opacity-0 z-0 pointer-events-none'
        }`}
      />

      {/* Layer 2: Action Video (Forward Leap, Kung Fu Pose, and Smooth Reverse Return) */}
      <video
        ref={videoActionRef}
        src={getAssetUrl('assets/action_and_return.mp4')}
        playsInline
        muted
        preload="auto"
        onEnded={handleActionEnd}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
          mode === 'transitioning' || mode === 'action'
            ? 'opacity-100 z-20 scale-100'
            : 'opacity-0 z-0 pointer-events-none'
        }`}
      >
        <source src={getAssetUrl('assets/action_and_return.webm')} type="video/webm" />
        <source src={getAssetUrl('assets/action_and_return.mp4')} type="video/mp4" />
      </video>

      {/* Ambient shadow gradient on the floor grounding the panda */}
      <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 w-[70%] max-w-[750px] h-[40px] bg-black/75 rounded-full blur-2xl pointer-events-none z-1" />
    </div>
  );
};
