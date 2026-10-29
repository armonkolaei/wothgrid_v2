import { useRef, useState } from 'react';
import { fmtCompact, fmtMoney, fmtShortDate, fmtDate } from '../format.js';

const W = 1000;
const H = 300;
const PAD = { left: 10, right: 10, top: 20, bottom: 34 };

export default function NetWorthChart({ series }) {
  const [hover, setHover] = useState(null);
  const ref = useRef(null);
  if (!series?.length) return null;

  const values = series.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  min -= span * 0.08;
  max += span * 0.08;

  const x = (i) => PAD.left + (i / (series.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v) => PAD.top + (1 - (v - min) / (max - min)) * (H - PAD.top - PAD.bottom);
  const line = series.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(series.length - 1)},${H - PAD.bottom} L${x(0)},${H - PAD.bottom} Z`;
  const grid = [0.1, 0.5, 0.9].map((f) => min + (max - min) * f);
  const ticks = series.map((p, i) => [p, i]).filter(([, i]) => i % 14 === 0 && i < series.length - 7);
  ticks.push([series.at(-1), series.length - 1]);

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHover(Math.round(frac * (series.length - 1)));
  }

  const hp = hover != null ? series[hover] : null;

  return (
    <div className="chart" ref={ref} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Net worth over the last six months">
        <defs>
          <linearGradient id="nwFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a84ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0a84ff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {grid.map((g) => (
          <line key={g} x1="0" x2={W} y1={y(g)} y2={y(g)} stroke="#eef0f4" />
        ))}
        <path d={area} fill="url(#nwFill)" />
        <path d={line} fill="none" stroke="#0a84ff" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {ticks.map(([p, i]) => (
          <text key={p.date} x={Math.min(x(i), W - 24)} y={H - 10} fontSize="13" fill="#9ca3af" textAnchor="middle">
            {fmtShortDate(p.date)}
          </text>
        ))}
        {hp && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={H - PAD.bottom} stroke="#0a84ff" strokeOpacity="0.4" />
            <circle cx={x(hover)} cy={y(hp.value)} r="5" fill="#0a84ff" stroke="#fff" strokeWidth="2" />
          </>
        )}
      </svg>
      {grid.map((g) => (
        <span key={g} className="chart-label" style={{ top: `${(y(g) / H) * 100}%` }}>
          {fmtCompact(g)}
        </span>
      ))}
      {hp && (
        <div className="chart-tip" style={{ left: `${(x(hover) / W) * 100}%` }}>
          <strong>{fmtMoney(hp.value)}</strong>
          <span>{fmtDate(hp.date)}</span>
        </div>
      )}
    </div>
  );
}
