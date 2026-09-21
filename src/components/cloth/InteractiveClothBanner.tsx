import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../../utils/audioEngine';

interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
  u: number;
  v: number;
}

interface Constraint {
  p1: Point;
  p2: Point;
  length: number;
}

export const InteractiveClothBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const isDraggingRef = useRef(false);
  const mouseRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000, vx: 0, vy: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions: Expanded to 360x360 with generous margins so dragging never gets clipped
    const width = canvas.width;
    const height = canvas.height;

    // Cloth grid configuration (Banner is 110px wide, 205px tall, centered with 125px side clearance)
    const cols = 9;
    const rows = 15;
    const bannerWidth = 110;
    const bannerHeight = 205;
    const startX = (width - bannerWidth) / 2;
    const startY = 32;
    const spacingX = bannerWidth / (cols - 1);
    const spacingY = bannerHeight / (rows - 1);

    const points: Point[] = [];
    const constraints: Constraint[] = [];

    // Create points
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacingX;
        const y = startY + r * spacingY;
        const pinned = r === 0; // Top row pinned to golden hanging rod
        points.push({
          x,
          y,
          oldX: x,
          oldY: y,
          pinned,
          u: c / (cols - 1),
          v: r / (rows - 1),
        });
      }
    }

    // Helper to get point index
    const getIndex = (c: number, r: number) => r * cols + c;

    // Structural constraints (horizontal & vertical)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Horizontal
        if (c < cols - 1) {
          const p1 = points[getIndex(c, r)];
          const p2 = points[getIndex(c + 1, r)];
          constraints.push({ p1, p2, length: spacingX });
        }
        // Vertical
        if (r < rows - 1) {
          const p1 = points[getIndex(c, r)];
          const p2 = points[getIndex(c, r + 1)];
          constraints.push({ p1, p2, length: spacingY });
        }
        // Shear constraints (diagonal for realistic cloth stiffness)
        if (c < cols - 1 && r < rows - 1) {
          const p1 = points[getIndex(c, r)];
          const p2 = points[getIndex(c + 1, r + 1)];
          const diag = Math.sqrt(spacingX * spacingX + spacingY * spacingY);
          constraints.push({ p1, p2, length: diag });

          const p3 = points[getIndex(c + 1, r)];
          const p4 = points[getIndex(c, r + 1)];
          constraints.push({ p1: p3, p2: p4, length: diag });
        }
      }
    }

    let animId: number;
    let time = 0;
    const gravity = 0.22;
    const damping = 0.985;

    // Simulation loop
    const updatePhysics = () => {
      time += 0.03;

      // 1. Verlet integration + ambient wind
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.pinned) continue;

        const vx = (p.x - p.oldX) * damping;
        const vy = (p.y - p.oldY) * damping;

        p.oldX = p.x;
        p.oldY = p.y;

        // Subtle wind drift oscillating across cloth
        const wind = Math.sin(time * 1.5 + p.y * 0.04) * 0.16 + Math.cos(time * 0.8 + p.x * 0.05) * 0.08;

        p.x += vx + wind;
        p.y += vy + gravity;

        // Interactive mouse force
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = isDraggingRef.current ? 75 : 50;

        if (dist < radius && dist > 0) {
          const force = (1.0 - dist / radius) * (isDraggingRef.current ? 4.5 : 1.8);
          p.x += (mouseRef.current.vx * 0.4 + (dx / dist) * force);
          p.y += (mouseRef.current.vy * 0.4 + (dy / dist) * force);
        }

        // Keep inside canvas safe margins so it can never be clipped
        p.x = Math.max(12, Math.min(width - 12, p.x));
        p.y = Math.max(12, Math.min(height - 12, p.y));
      }

      // 2. Constraint relaxation passes
      const iterations = 5;
      for (let step = 0; step < iterations; step++) {
        for (let i = 0; i < constraints.length; i++) {
          const { p1, p2, length } = constraints[i];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const diff = (dist - length) / dist;

          const offsetX = dx * diff * 0.5;
          const offsetY = dy * diff * 0.5;

          if (!p1.pinned) {
            p1.x += offsetX;
            p1.y += offsetY;
          }
          if (!p2.pinned) {
            p2.x -= offsetX;
            p2.y -= offsetY;
          }
        }
      }

      // Final boundary safety check so cloth never gets clipped
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (!p.pinned) {
          p.x = Math.max(12, Math.min(width - 12, p.x));
          p.y = Math.max(12, Math.min(height - 12, p.y));
        }
      }
    };

    // Render loop
    const render = () => {
      updatePhysics();
      ctx.clearRect(0, 0, width, height);

      // A. Hanging Gold Rod & Cord at Top
      const rodLeft = startX - 14;
      const rodRight = startX + bannerWidth + 14;
      const rodY = startY;

      // Hanging gold chain / cord triangle
      ctx.beginPath();
      ctx.moveTo(width / 2, 8);
      ctx.lineTo(rodLeft + 6, rodY);
      ctx.moveTo(width / 2, 8);
      ctx.lineTo(rodRight - 6, rodY);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Top suspension knot
      ctx.beginPath();
      ctx.arc(width / 2, 8, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#f5de7a';
      ctx.fill();

      // Golden Rod
      const rodGrad = ctx.createLinearGradient(rodLeft, rodY, rodRight, rodY);
      rodGrad.addColorStop(0, '#8c6e17');
      rodGrad.addColorStop(0.2, '#f5de7a');
      rodGrad.addColorStop(0.5, '#d4af37');
      rodGrad.addColorStop(0.8, '#f5de7a');
      rodGrad.addColorStop(1, '#8c6e17');

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(rodLeft, rodY - 4, rodRight - rodLeft, 8, 4);
      ctx.fillStyle = rodGrad;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fill();

      // Golden rod end finials
      ctx.beginPath();
      ctx.arc(rodLeft, rodY, 6, 0, Math.PI * 2);
      ctx.arc(rodRight, rodY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f5de7a';
      ctx.fill();
      ctx.restore();

      // B. Render Cloth Quads with Satin Lighting
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const pTL = points[getIndex(c, r)];
          const pTR = points[getIndex(c + 1, r)];
          const pBL = points[getIndex(c, r + 1)];
          const pBR = points[getIndex(c + 1, r + 1)];

          // Normal estimation from quad vertices for dynamic specular sheen
          const dx = pTR.x - pTL.x;
          const dy = pBL.y - pTL.y;
          const fold = Math.sin((pTL.x + dy) * 0.05 + time * 1.5) * 0.25;
          const sheen = Math.max(0, Math.min(1, 0.45 + fold + (dx / spacingX - 1) * 1.2));

          // Royal crimson satin gradient
          const redVal = Math.floor(125 + sheen * 65);
          const greenVal = Math.floor(12 + sheen * 25);
          const blueVal = Math.floor(22 + sheen * 30);

          ctx.beginPath();
          ctx.moveTo(pTL.x, pTL.y);
          ctx.lineTo(pTR.x, pTR.y);
          ctx.lineTo(pBR.x, pBR.y);
          ctx.lineTo(pBL.x, pBL.y);
          ctx.closePath();

          ctx.fillStyle = `rgb(${redVal}, ${greenVal}, ${blueVal})`;
          ctx.fill();
        }
      }

      // C. Render Gold Borders on Left, Right and Bottom edges
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#d4af37';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.shadowBlur = 4;

      // Left edge
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const p = points[getIndex(0, r)];
        if (r === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // Right edge
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const p = points[getIndex(cols - 1, r)];
        if (r === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // Bottom edge
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const p = points[getIndex(c, rows - 1)];
        if (c === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // D. Embroidered Calligraphy on Cloth
      // We calculate center positions along the vertical spine of the cloth
      const getSpinePoint = (vNorm: number) => {
        const row = Math.min(rows - 2, Math.max(0, Math.floor(vNorm * (rows - 1))));
        const frac = (vNorm * (rows - 1)) - row;
        const midC = Math.floor(cols / 2);
        const p1 = points[getIndex(midC, row)];
        const p2 = points[getIndex(midC, row + 1)];
        return {
          x: p1.x + (p2.x - p1.x) * frac,
          y: p1.y + (p2.y - p1.y) * frac,
          angle: Math.atan2(p2.y - p1.y, p2.x - p1.x) - Math.PI / 2,
        };
      };

      // Characters: 「心」 「若」 「止」 「水」
      const characters = ['心', '若', '止', '水'];
      const vOffsets = [0.18, 0.35, 0.52, 0.69];

      ctx.save();
      ctx.font = '700 24px "Ma Shan Zheng", "Noto Serif SC", cursive, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fbe58a';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1;

      characters.forEach((char, idx) => {
        const pt = getSpinePoint(vOffsets[idx]);
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.angle * 0.6); // slight tilt with cloth curvature
        ctx.fillText(char, 0, 0);
        ctx.restore();
      });

      // Imperial Red Chop Seal Stamp near bottom: 「功夫」
      const sealPt = getSpinePoint(0.85);
      ctx.save();
      ctx.translate(sealPt.x, sealPt.y);
      ctx.rotate(sealPt.angle * 0.6);
      // Red seal box
      ctx.fillStyle = '#8f0d1a';
      ctx.strokeStyle = '#f5de7a';
      ctx.lineWidth = 1;
      ctx.fillRect(-12, -12, 24, 24);
      ctx.strokeRect(-12, -12, 24, 24);
      // Seal inner character
      ctx.font = '700 12px "Noto Serif SC", serif';
      ctx.fillStyle = '#fbe58a';
      ctx.fillText('功夫', 0, 0);
      ctx.restore();

      ctx.restore();

      // E. Golden Silk Braided Tassels at Bottom Left & Right
      const pBotLeft = points[getIndex(0, rows - 1)];
      const pBotRight = points[getIndex(cols - 1, rows - 1)];

      const renderTassel = (anchor: Point) => {
        ctx.save();
        const tasselLen = 22;
        const swing = Math.sin(time * 2 + anchor.x) * 4;
        ctx.beginPath();
        ctx.moveTo(anchor.x, anchor.y);
        ctx.lineTo(anchor.x + swing, anchor.y + tasselLen);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Tassel bead
        ctx.beginPath();
        ctx.arc(anchor.x + swing * 0.3, anchor.y + 4, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#f5de7a';
        ctx.fill();
        ctx.restore();
      };

      renderTassel(pBotLeft);
      renderTassel(pBotRight);

      // F. Subtle golden particles drifting around the cloth when interacting
      if (isInteracting) {
        ctx.save();
        ctx.fillStyle = '#ffd700';
        for (let i = 0; i < 3; i++) {
          const px = startX + Math.random() * bannerWidth;
          const py = startY + Math.random() * bannerHeight;
          ctx.beginPath();
          ctx.arc(px, py, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // Mouse & Touch interaction handlers
    const updatePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const curX = (clientX - rect.left) * scaleX;
      const curY = (clientY - rect.top) * scaleY;

      const vx = curX - mouseRef.current.prevX;
      const vy = curY - mouseRef.current.prevY;

      mouseRef.current.vx = vx;
      mouseRef.current.vy = vy;
      mouseRef.current.prevX = curX;
      mouseRef.current.prevY = curY;
      mouseRef.current.x = curX;
      mouseRef.current.y = curY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
      if (!isInteracting) {
        setIsInteracting(true);
        sound.playSilkRustle();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      updatePointer(e.clientX, e.clientY);
      sound.playSilkRustle();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      setIsInteracting(false);
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        updatePointer(t.clientX, t.clientY);
        if (!isInteracting) {
          setIsInteracting(true);
          sound.playSilkRustle();
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchstart', (e) => {
      isDraggingRef.current = true;
      if (e.touches.length > 0) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      sound.playSilkRustle();
    }, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isInteracting]);

  return (
    <div className="relative flex flex-col items-center select-none group overflow-visible">
      {/* Ambient background glow ring behind cloth */}
      <div className="absolute inset-0 -m-4 bg-crimson-800/20 rounded-full blur-2xl pointer-events-none group-hover:bg-gold-500/10 transition-all duration-700" />

      {/* Physics Canvas: 360x360 internal coordinate space with generous margins */}
      <div className="relative cursor-grab active:cursor-grabbing transition-transform duration-300 group-hover:scale-[1.02] flex items-center justify-center overflow-visible">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] md:w-[300px] md:h-[300px] drop-shadow-2xl overflow-visible pointer-events-auto"
        />

        {/* Floating badge label */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-950/85 border border-gold-500/20 backdrop-blur-md shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
            <span className="font-calligraphy text-xs tracking-widest text-gold-300">心若止水</span>
            <span className="text-[10px] text-ivory-300 font-sans tracking-wider uppercase opacity-70">Silk Cloth</span>
          </div>
        </div>
      </div>

      {/* Caption text */}
      <p className="mt-1 text-[11px] tracking-widest text-ivory-300 uppercase font-medium text-center opacity-75">
        Touch or drag to ripple
      </p>
    </div>
  );
};
