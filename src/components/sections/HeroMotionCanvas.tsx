'use client';

import { useEffect, useRef } from 'react';

interface HeroMotionCanvasProps {
  paused?: boolean;
}

interface Building {
  xRatio: number;
  width: number;
  heightRatio: number;
  speed: number;
  windowsCols: number;
  windowsRows: number;
  accent: boolean;
}

interface PulseParticle {
  t: number;
  speed: number;
  arcIndex: number;
  size: number;
  gold: boolean;
}

export default function HeroMotionCanvas({ paused = false }: HeroMotionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let time = 0;

    const buildings: Building[] = [
      { xRatio: 0.04, width: 58, heightRatio: 0.34, speed: 0.15, windowsCols: 3, windowsRows: 8, accent: false },
      { xRatio: 0.11, width: 76, heightRatio: 0.5, speed: 0.25, windowsCols: 4, windowsRows: 12, accent: true },
      { xRatio: 0.19, width: 52, heightRatio: 0.28, speed: 0.12, windowsCols: 3, windowsRows: 6, accent: false },
      { xRatio: 0.27, width: 88, heightRatio: 0.42, speed: 0.2, windowsCols: 4, windowsRows: 10, accent: false },
      { xRatio: 0.72, width: 82, heightRatio: 0.46, speed: 0.22, windowsCols: 4, windowsRows: 11, accent: true },
      { xRatio: 0.8, width: 64, heightRatio: 0.36, speed: 0.18, windowsCols: 3, windowsRows: 9, accent: false },
      { xRatio: 0.87, width: 92, heightRatio: 0.54, speed: 0.28, windowsCols: 5, windowsRows: 13, accent: true },
      { xRatio: 0.95, width: 54, heightRatio: 0.3, speed: 0.14, windowsCols: 3, windowsRows: 7, accent: false },
    ];

    const particles: PulseParticle[] = Array.from({ length: 24 }, (_, idx) => ({
      t: (idx % 6) / 6,
      speed: 0.0022 + (idx % 5) * 0.00055,
      arcIndex: idx % 4,
      size: idx % 3 === 0 ? 3.2 : 2.1,
      gold: idx % 2 === 0,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / Math.max(window.innerWidth, 1);
      mouseY = e.clientY / Math.max(window.innerHeight, 1);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const getBezierPoint = (
      t: number,
      p0: [number, number],
      p1: [number, number],
      p2: [number, number]
    ): [number, number] => {
      const u = 1 - t;
      const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
      const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
      return [x, y];
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const parallaxX = (mouseX - 0.5) * 26;
      const parallaxY = (mouseY - 0.5) * 16;

      // 1. Subtle perspective grid lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.06)';
      ctx.lineWidth = 1;
      const horizonY = height * 0.72 + parallaxY * 0.3;

      for (let i = -8; i <= 8; i++) {
        const startX = width * 0.5 + i * (width * 0.08) + parallaxX * 0.2;
        const endX = width * 0.5 + i * (width * 0.22) + parallaxX;
        ctx.beginPath();
        ctx.moveTo(startX, horizonY);
        ctx.lineTo(endX, height);
        ctx.stroke();
      }

      for (let row = 0; row < 6; row++) {
        const y = horizonY + Math.pow(row / 5, 1.55) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Architectural Skyline Silhouettes + Animated Windows
      buildings.forEach((b, bIdx) => {
        const bx = b.xRatio * width - b.width / 2 + parallaxX * (b.speed * 1.4);
        const bh = b.heightRatio * height;
        const by = height - bh * 0.85;

        const grad = ctx.createLinearGradient(bx, by, bx, height);
        grad.addColorStop(0, b.accent ? 'rgba(5, 150, 105, 0.14)' : 'rgba(1, 62, 55, 0.22)');
        grad.addColorStop(1, 'rgba(2, 13, 11, 0.92)');

        ctx.fillStyle = grad;
        ctx.strokeStyle = b.accent ? 'rgba(255, 239, 179, 0.16)' : 'rgba(16, 185, 129, 0.14)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(bx, by, b.width, bh, [6, 6, 0, 0]);
        ctx.fill();
        ctx.stroke();

        // Glowing windows matrix
        const padX = 10;
        const padY = 14;
        const cellW = (b.width - padX * 2) / b.windowsCols;
        const cellH = 12;

        for (let r = 0; r < b.windowsRows; r++) {
          for (let c = 0; c < b.windowsCols; c++) {
            const wave = Math.sin(time * 1.4 + bIdx * 1.7 + r * 0.6 + c * 0.9);
            if (wave > 0.25) {
              const wx = bx + padX + c * cellW + 2;
              const wy = by + padY + r * (cellH + 6);
              if (wy + cellH < height - 12) {
                ctx.fillStyle =
                  b.accent && (r + c) % 4 === 0
                    ? `rgba(255, 239, 179, ${0.12 + wave * 0.16})`
                    : `rgba(16, 185, 129, ${0.08 + wave * 0.14})`;
                ctx.fillRect(wx, wy, Math.max(cellW - 5, 4), 5);
              }
            }
          }
        }
      });

      // 3. Payment & Receipt Telemetry Arcs (Flowing rent streams)
      const centerNode: [number, number] = [width * 0.5 + parallaxX * 0.4, height * 0.48 + parallaxY * 0.4];
      const arcs: Array<[[number, number], [number, number], [number, number]]> = [
        [[width * 0.12, height * 0.56], [width * 0.3, height * 0.22], centerNode],
        [[width * 0.25, height * 0.72], [width * 0.38, height * 0.36], centerNode],
        [[width * 0.88, height * 0.54], [width * 0.7, height * 0.22], centerNode],
        [[width * 0.74, height * 0.74], [width * 0.62, height * 0.38], centerNode],
      ];

      arcs.forEach((arc, idx) => {
        const [p0, p1, p2] = arc;
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        ctx.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]);
        ctx.strokeStyle =
          idx % 2 === 0 ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 239, 179, 0.13)';
        ctx.lineWidth = 1.25;
        ctx.stroke();
      });

      // 4. Traveling luminous payment pulses
      particles.forEach((p) => {
        if (!pausedRef.current && !prefersReducedMotion) {
          p.t = (p.t + p.speed) % 1;
        }
        const [p0, p1, p2] = arcs[p.arcIndex];
        const [px, py] = getBezierPoint(p.t, p0, p1, p2);

        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 5.5);
        if (p.gold) {
          glow.addColorStop(0, 'rgba(255, 239, 179, 0.95)');
          glow.addColorStop(0.4, 'rgba(255, 239, 179, 0.35)');
          glow.addColorStop(1, 'rgba(255, 239, 179, 0)');
        } else {
          glow.addColorStop(0, 'rgba(52, 211, 153, 0.95)');
          glow.addColorStop(0.4, 'rgba(16, 185, 129, 0.35)');
          glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
        }

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.gold ? '#FFEFB3' : '#6EE7B7';
        ctx.beginPath();
        ctx.arc(px, py, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!pausedRef.current && !prefersReducedMotion) {
        time += 0.018;
      }

      animationFrameId = window.requestAnimationFrame(drawFrame);
    };

    animationFrameId = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
    />
  );
}
