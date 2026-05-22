interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lifespan: number;
}

export class BitFallEngine {
  private particles: Particle[] = [];
  private rows: number[][] = [];
  private nozzles: number[];

  constructor(
    private w: number,
    private h: number,
    private n: number,
  ) {
    const step = w / (n + 1);
    this.nozzles = Array.from({ length: n }, (_, i) => step * (i + 1));
  }

  loadText(text: string): void {
    const canvas = document.createElement('canvas');
    canvas.width = this.w;
    canvas.height = this.h;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.w, this.h);

    // Scale font to fit: height-based size, capped so text doesn't overflow width
    const maxByHeight = Math.floor(this.h * 0.38);
    const maxByWidth = Math.floor(this.w * 0.62);
    let size = Math.min(maxByHeight, maxByWidth);

    ctx.font = `${size}px "NNC-Bold", system-ui, sans-serif`;
    const measured = ctx.measureText(text).width;
    if (measured > this.w * 0.88) {
      size = Math.floor(size * ((this.w * 0.88) / measured));
      ctx.font = `${size}px "NNC-Bold", system-ui, sans-serif`;
    }

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, this.w / 2, this.h / 2);

    this.rows = this.sample(ctx);
  }

  // Sample the offscreen canvas into a binary grid (nozzles × rows).
  // Preserves the original aspect ratio so the text shape reads correctly.
  private sample(ctx: CanvasRenderingContext2D): number[][] {
    const { width: w, height: h } = ctx.canvas;
    const pixels = ctx.getImageData(0, 0, w, h).data;
    const nRow = Math.floor(h * (this.n / w));
    const jump = w / this.n;
    const result: number[][] = [];

    for (let y = 0; y < nRow; y++) {
      const row: number[] = [];
      for (let x = 0; x < this.n; x++) {
        const idx = (Math.floor(y * jump) * w + Math.floor(x * jump)) * 4;
        row.push(pixels[idx] < 1 ? 0 : 1);
      }
      result.push(row);
    }
    return result;
  }

  // One frame tick: emit from next row, apply gravity, cull dead particles.
  // Rows are popped (bottom-first) so the bottom of each letter falls furthest —
  // matching the original water-gate behavior.
  step(): void {
    if (this.rows.length > 0) {
      const row = this.rows.pop()!;
      row.forEach((on, i) => {
        if (on && i < this.nozzles.length) this.emit(this.nozzles[i]);
      });
    }

    for (const p of this.particles) {
      p.vy += 0.8; // constant downward acceleration (gravity applied each frame)
      p.x += p.vx;
      p.y += p.vy;
      p.lifespan -= 7;
    }

    this.particles = this.particles.filter(p => p.lifespan > 0);
  }

  private emit(x: number): void {
    this.particles.push({
      x,
      y: 0,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      lifespan: 255,
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'lighter'; // additive blend = bright overlaps
    for (const p of this.particles) {
      const a = (p.lifespan / 255).toFixed(3);
      ctx.fillStyle = `rgba(220,220,220,${a})`;
      // Height grows with velocity so drops elongate as they accelerate
      ctx.fillRect(p.x, p.y, 3, Math.max(p.vy * 1.5, 1));
    }
    ctx.globalCompositeOperation = prev;
  }

  get isEmpty(): boolean {
    return this.rows.length === 0;
  }
}
