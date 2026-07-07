'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Turf palette (dark-theme adapted) ───────────────────────────────────────
const TURF_DARK   = '#0f2d1a';
const TURF        = '#1a4a2a';
const MOWED       = '#2d7a45';
const MOWED_LIGHT = '#3d9460';
const AMBER       = '#e8a13a';
const LIME        = '#c4e86b';
const LINE        = 'rgba(255,255,255,0.75)';

const ROWS     = 8;
const ROW_MS   = 1400; // ms per stripe pass

interface Stripe { mowed: boolean }

const CHECKLIST = [
  { label: 'Repainting touchline markings',    doneAtRow: 2 },
  { label: 'Tuning slot availability engine',  doneAtRow: 4 },
  { label: 'Syncing payments & refunds',       doneAtRow: 6 },
];

// ─── SVG Mower ───────────────────────────────────────────────────────────────
function MowerSVG() {
  return (
    <svg viewBox="0 0 52 52" width="48" height="48" aria-hidden>
      <path d="M6 38 L14 22 M12 40 L18 24" stroke="#0a1a10" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <rect x="12" y="14" width="22" height="18" rx="4" fill={AMBER} stroke="#0a1a10" strokeWidth="1.4" />
      <rect x="16" y="18" width="14" height="10" rx="1.5" fill="#0a1a10" />
      <circle cx="23" cy="23" r="2" fill={LIME} />
      <rect x="32" y="12" width="16" height="22" rx="8" fill={TURF} stroke="#0a1a10" strokeWidth="1.4" />
      <line x1="36" y1="14" x2="36" y2="32" stroke={TURF_DARK} strokeWidth="1.1" />
      <line x1="40" y1="14" x2="40" y2="32" stroke={TURF_DARK} strokeWidth="1.1" />
      <line x1="44" y1="14" x2="44" y2="32" stroke={TURF_DARK} strokeWidth="1.1" />
      <rect x="14" y="16" width="6" height="2" rx="1" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

// ─── Field markings overlay ───────────────────────────────────────────────────
function FieldMarkings() {
  const s: React.CSSProperties = { position: 'absolute', borderColor: LINE };
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      {/* Outer border */}
      <div style={{ ...s, inset: 10, borderRadius: 8, border: `2px solid ${LINE}`, opacity: 0.7 }} />
      {/* Centre line */}
      <div style={{ ...s, position: 'absolute', top: 10, bottom: 10, left: '50%', width: 2, background: LINE, transform: 'translateX(-50%)', opacity: 0.7 }} />
      {/* Centre circle */}
      <div style={{ ...s, position: 'absolute', top: '50%', left: '50%', width: 88, height: 88, borderRadius: '50%', border: `2px solid ${LINE}`, transform: 'translate(-50%,-50%)', opacity: 0.7 }} />
      {/* Centre spot */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 6, height: 6, borderRadius: '50%', background: LINE, transform: 'translate(-50%,-50%)', opacity: 0.85 }} />
      {/* Left penalty box */}
      <div style={{ ...s, position: 'absolute', top: '50%', left: 10, width: 60, height: 110, border: `2px solid ${LINE}`, borderLeft: 'none', transform: 'translateY(-50%)', opacity: 0.65 }} />
      {/* Right penalty box */}
      <div style={{ ...s, position: 'absolute', top: '50%', right: 10, width: 60, height: 110, border: `2px solid ${LINE}`, borderRight: 'none', transform: 'translateY(-50%)', opacity: 0.65 }} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MaintenancePage() {
  const [stripes,     setStripes]     = useState<Stripe[]>(() => Array.from({ length: ROWS }, () => ({ mowed: false })));
  const [mowerLeft,   setMowerLeft]   = useState<number>(0);   // 0–100 %
  const [mowerRow,    setMowerRow]    = useState<number>(0);
  const [mowerFlip,   setMowerFlip]   = useState<boolean>(false);
  const [progress,    setProgress]    = useState<number>(0);
  const [pass,        setPass]        = useState<number>(1);

  const dirRef    = useRef<number>(1);   // 1 = left→right, -1 = right→left
  const rowRef    = useRef<number>(0);
  const cancelRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mowNext = useCallback(() => {
    const row = rowRef.current;
    const dir = dirRef.current;

    // Position mower at start of this row
    setMowerRow(row);
    setMowerLeft(dir === 1 ? 0 : 100);
    setMowerFlip(dir === -1);

    // Small delay so the snap is visible, then animate across
    const snapDelay = setTimeout(() => {
      setMowerLeft(dir === 1 ? 100 : 0);

      // After row traversal time, mark stripe mowed and advance
      cancelRef.current = setTimeout(() => {
        setStripes(prev => {
          const next = [...prev];
          next[row] = { mowed: true };
          return next;
        });

        const nextRow = row + 1;
        const pct     = Math.round((nextRow / ROWS) * 100);
        setProgress(pct);

        if (nextRow >= ROWS) {
          // Full pass done — reset after pause
          setPass(p => p + 1);
          cancelRef.current = setTimeout(() => {
            setStripes(Array.from({ length: ROWS }, () => ({ mowed: false })));
            setProgress(0);
            rowRef.current = 0;
            dirRef.current = 1;
            mowNext();
          }, 2400);
        } else {
          dirRef.current = dir * -1;
          rowRef.current = nextRow;
          mowNext();
        }
      }, ROW_MS);
    }, 60);

    // Store snap timeout too so we can cancel it
    cancelRef.current = snapDelay;
  }, []);

  useEffect(() => {
    mowNext();
    return () => {
      if (cancelRef.current) clearTimeout(cancelRef.current);
    };
  }, [mowNext]);

  const doneRows = stripes.filter(s => s.mowed).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10"
      style={{ background: 'linear-gradient(160deg, #050e08 0%, #0a1a10 45%, #060d09 100%)' }}>

      <main className="w-full max-w-6xl">

        {/* ── Header ── */}
        <header className="flex items-center justify-between mb-10 sm:mb-14">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: TURF_DARK, border: `1px solid rgba(255,255,255,0.08)` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 19L12 4L21 19L12 15Z" fill={LIME} />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-lg text-white leading-none tracking-tight">TurfBook</div>
              <div className="text-[10px] tracking-[0.18em] uppercase font-mono mt-0.5"
                style={{ color: MOWED }}>Turf Booking System</div>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full"
            style={{ background: 'rgba(232,161,58,0.1)', border: '1px solid rgba(232,161,58,0.25)' }}>
            <span className="w-2 h-2 rounded-full inline-block"
              style={{ background: AMBER, animation: 'pulseAmber 2s infinite' }} />
            <span className="text-[11px] font-mono font-medium tracking-wider"
              style={{ color: '#c8882e' }}>STATUS · MAINTENANCE</span>
          </div>
        </header>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">

          {/* Left column — copy */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <p className="text-[11px] uppercase tracking-[0.22em] font-mono mb-5"
              style={{ color: MOWED }}>— Scheduled maintenance</p>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] mb-5 text-white tracking-tight">
              We&apos;re mowing<br />
              <span style={{ color: MOWED_LIGHT }}>the pitch.</span>
            </h1>

            <p className="text-base leading-relaxed mb-8 max-w-md"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              TurfBook is getting a fresh cut. We&apos;re reseeding a few features, repainting the lines, and tuning up the booking engine so your next match starts on time.
            </p>

            {/* Progress bar */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] uppercase tracking-[0.15em] font-mono"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>Maintenance progress</span>
                <span className="text-sm font-semibold font-mono text-white">{progress}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden relative"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full relative overflow-hidden"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${TURF} 0%, ${MOWED_LIGHT} 60%, ${LIME} 100%)`,
                    transition: 'width 0.5s cubic-bezier(.4,.0,.2,1)',
                  }}>
                  {/* shimmer sweep */}
                  <span className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)',
                      animation: 'turfShimmer 1.8s infinite',
                    }} />
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="mb-8 space-y-3">
              {CHECKLIST.map(({ label, doneAtRow }) => {
                const done = doneRows >= doneAtRow;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        borderColor: done ? MOWED_LIGHT : 'rgba(255,255,255,0.2)',
                        background:  done ? MOWED_LIGHT : 'transparent',
                      }}>
                      {done && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm transition-all duration-300"
                      style={{
                        color: done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                        textDecoration: done ? 'line-through' : 'none',
                      }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <a href="mailto:support@turfbook.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border-2 transition-all duration-200 hover:-translate-y-0.5"
                style={{ borderColor: 'rgba(255,255,255,0.85)', color: 'white' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'white';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#050e08';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'white';
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                Notify me when live
              </a>
              <a href="mailto:support@turfbook.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border transition-all duration-200 hover:-translate-y-0.5"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.65)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.87 12.5 19.79 19.79 0 0 1 1.8 3.83 2 2 0 0 1 3.8 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Talk to support
              </a>
            </div>
          </div>

          {/* Right column — animated turf field */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: '16 / 10',
                background: TURF_DARK,
                borderRadius: 18,
                boxShadow: `
                  inset 0 0 0 1px rgba(255,255,255,0.06),
                  inset 0 -40px 80px -40px rgba(0,0,0,0.5),
                  0 30px 60px -25px rgba(0,0,0,0.6)
                `,
              }}
            >
              {/* Stripes */}
              {stripes.map((stripe, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    top: `${(i / ROWS) * 100}%`,
                    height: `${100 / ROWS}%`,
                    background: stripe.mowed
                      ? (i % 2 === 0 ? MOWED : MOWED_LIGHT)
                      : (i % 2 === 0 ? TURF_DARK : TURF),
                    backgroundImage: stripe.mowed
                      ? 'repeating-linear-gradient(90deg,rgba(255,255,255,0.055) 0 1px,transparent 1px 6px)'
                      : 'repeating-linear-gradient(90deg,rgba(0,0,0,0.12) 0 1px,transparent 1px 5px)',
                    transition: 'background-color 0.5s ease, background-image 0.5s ease',
                  }}
                />
              ))}

              {/* Field markings */}
              <FieldMarkings />

              {/* Mower */}
              <div
                style={{
                  position: 'absolute',
                  top: `${((mowerRow + 0.5) / ROWS) * 100}%`,
                  left: `${mowerLeft}%`,
                  transform: `translateY(-50%) translateX(${mowerFlip ? '-100%' : '0'}) scaleX(${mowerFlip ? -1 : 1})`,
                  transition: 'left 1.4s linear, top 0.35s cubic-bezier(.4,0,.2,1)',
                  zIndex: 10,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                  willChange: 'left, top',
                }}
              >
                <MowerSVG />
              </div>

              {/* Corner labels */}
              <div className="absolute top-3 left-4 z-20">
                <span className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded font-mono"
                  style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.8)' }}>
                  Pitch No. 07
                </span>
              </div>
              <div className="absolute top-3 right-4 z-20 flex items-center gap-2">
                <span className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded font-mono"
                  style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.8)' }}>
                  LIVE CAM
                </span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4 px-1">
              <div className="flex items-center gap-4">
                {[
                  { color: TURF,        label: 'unmowed' },
                  { color: MOWED_LIGHT, label: 'mowed'   },
                  { color: AMBER,       label: 'mower', circle: true },
                ].map(({ color, label, circle }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div style={{
                      width: 14, height: 14, background: color,
                      borderRadius: circle ? '50%' : 3,
                      flexShrink: 0,
                    }} />
                    <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Pass {pass} · {ROWS} lanes
              </span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-14 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-xs max-w-md" style={{ color: 'rgba(255,255,255,0.28)' }}>
            © 2025 TurfBook · All bookings during this window are paused and will resume automatically.
            No action needed from your side.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <a href="mailto:support@turfbook.com"
              className="hover:text-white transition-colors">support</a>
            <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
            <a href="#" className="hover:text-white transition-colors">@turfbook</a>
            <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
            <a href="#" className="hover:text-white transition-colors">help center</a>
          </div>
        </footer>

      </main>

      {/* Inject keyframes not in Tailwind config */}
      <style>{`
        @keyframes pulseAmber {
          0%   { box-shadow: 0 0 0 0 rgba(232,161,58,0.55); }
          70%  { box-shadow: 0 0 0 8px rgba(232,161,58,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,161,58,0); }
        }
        @keyframes turfShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
