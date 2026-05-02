'use client';

import { useMemo } from 'react';

interface ActivityChartProps {
  data: Array<{ date: string; count: number }>;
}

/**
 * Mini bar chart en SVG natif (zéro dépendance).
 * Affiche l'activité jour par jour sur 14 jours.
 */
export function ActivityChart({ data }: ActivityChartProps) {
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.count)), [data]);
  const width = 100; // viewBox width %
  const height = 80; // viewBox height %
  const barWidth = (width - (data.length - 1) * 1.5) / data.length;

  return (
    <div>
      <div className="relative" style={{ height: '160px' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full"
          role="img"
          aria-label="Graphique d'activité des 14 derniers jours"
        >
          {data.map((d, i) => {
            const h = max > 0 ? (d.count / max) * (height - 14) : 0;
            const x = i * (barWidth + 1.5);
            const y = height - h - 4;

            return (
              <g key={d.date}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(h, 0.5)}
                  fill={d.count > 0 ? '#D4A82C' : '#D8D2C2'}
                  rx="0.5"
                >
                  <title>{`${d.date} : ${d.count} lead${d.count > 1 ? 's' : ''}`}</title>
                </rect>
                {d.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 1.5}
                    textAnchor="middle"
                    fontSize="3"
                    fill="#807D75"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                  >
                    {d.count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Axe X — dates */}
      <div
        className="grid gap-x-1.5 mt-3 px-0"
        style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}
      >
        {data.map((d, i) => {
          const date = new Date(d.date);
          const showLabel = i % 2 === 0 || i === data.length - 1;
          return (
            <div
              key={d.date}
              className="text-center font-sans text-[9px] text-pierre tabular-nums"
            >
              {showLabel ? `${date.getDate()}/${date.getMonth() + 1}` : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}
