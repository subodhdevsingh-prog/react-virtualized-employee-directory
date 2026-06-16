import { useEffect, useRef, useState, type ReactElement } from 'react';

/**
 * Lightweight FPS meter driven by `requestAnimationFrame`.
 *
 * It counts frames over a rolling one-second window and displays the rate in a
 * fixed corner badge, giving a visible signal that virtualization keeps the
 * table smooth while scrolling 10k rows.
 */
export function FpsCounter(): ReactElement {
  const [fps, setFps] = useState<number>(0);
  const frameRef = useRef<number>(0);
  const framesRef = useRef<number>(0);
  const lastSampleRef = useRef<number>(performance.now());

  useEffect((): (() => void) => {
    const tick = (now: number): void => {
      framesRef.current += 1;
      const elapsed = now - lastSampleRef.current;
      if (elapsed >= 1000) {
        setFps(Math.round((framesRef.current * 1000) / elapsed));
        framesRef.current = 0;
        lastSampleRef.current = now;
      }
      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return (): void => window.cancelAnimationFrame(frameRef.current);
  }, []);

  const tone =
    fps >= 50 ? 'text-emerald-400' : fps >= 30 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="rounded-md bg-slate-900 px-3 py-1 font-mono text-sm text-white shadow">
      <span className={tone}>{fps}</span>
      <span className="ml-1 text-slate-400">FPS</span>
    </div>
  );
}
