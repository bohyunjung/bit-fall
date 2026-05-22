'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BitFallEngine } from '@/lib/engine';
import { DEFAULT_MESSAGES } from '@/lib/messages';
import styles from './BitFall.module.css';

export default function BitFall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BitFallEngine | null>(null);
  const pendingRef = useRef(false);
  const genRef = useRef(0); // incremented on each engine init to invalidate stale timeouts
  const queueRef = useRef<string[]>([]);
  const defaultIdxRef = useRef(0);

  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getNext = useCallback((): string => {
    if (queueRef.current.length > 0) return queueRef.current.shift()!;
    return DEFAULT_MESSAGES[(defaultIdxRef.current++) % DEFAULT_MESSAGES.length];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    let alive = true;
    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const init = () => {
      genRef.current++;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      // ~1 nozzle per 11px of width; floor at 30 for narrow viewports
      engineRef.current = new BitFallEngine(w, h, Math.max(30, Math.floor(w / 11)));
      pendingRef.current = false;
    };

    const scheduleNext = () => {
      if (pendingRef.current) return;
      pendingRef.current = true;
      const gen = genRef.current;
      // 600ms gap lets old particles fade before new text begins
      setTimeout(() => {
        if (gen !== genRef.current) return; // engine was replaced (resize)
        engineRef.current?.loadText(getNext());
        pendingRef.current = false;
      }, 600);
    };

    const run = async () => {
      try {
        const font = new FontFace('NNC-Bold', 'url(/fonts/NNC-Bold.ttf)');
        await font.load();
        document.fonts.add(font);
      } catch {
        // falls back to system-ui
      }
      if (!alive) return;

      init();
      const ctx = canvas.getContext('2d')!;

      const tick = () => {
        if (!alive) return;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const engine = engineRef.current;
        if (engine) {
          if (engine.isEmpty) scheduleNext();
          engine.step();
          engine.render(ctx);
        }

        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    // Debounce resize so mobile keyboard open/close doesn't thrash the engine
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeTimer = null;
        init();
      }, 150);
    };

    window.addEventListener('resize', onResize);
    run();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [getNext]);

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    queueRef.current.push(text);
    setValue('');
    setOpen(false);
  };

  const toggle = () => {
    setOpen(prev => {
      if (!prev) setTimeout(() => inputRef.current?.focus(), 50);
      return !prev;
    });
  };

  return (
    <div className={styles.root}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.ui}>
        {open && (
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') setOpen(false);
              }}
              placeholder="type a message…"
              maxLength={24}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button className={styles.send} onClick={submit} aria-label="send">
              →
            </button>
          </div>
        )}
        <button
          className={styles.toggle}
          onClick={toggle}
          aria-label={open ? 'close' : 'send a message'}
        >
          {open ? '×' : '+'}
        </button>
      </div>
    </div>
  );
}
