'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import Spinner from '../ui/Spinner.js';
import { ActionPill, DeskEmpty } from './DeskBits.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
);

/* Route colors per event type — darker inks on the paper theme, brighter
   ones on the night map. Dot classes are static so Tailwind can see them. */
const EVENTS = [
  {
    type: 'page_view',
    label: 'Vizualizări de pagină',
    light: '#388870',
    dark: '#58b098',
    dotClass: 'bg-primary dark:bg-primary-soft',
  },
  {
    type: 'card_click',
    label: 'Facultăți deschise',
    light: '#3e8c8c',
    dark: '#78c8c8',
    dotClass: 'bg-[#3e8c8c] dark:bg-teal-soft',
  },
  {
    type: 'cta_click',
    label: 'Îndemnuri urmate',
    light: '#f07820',
    dark: '#f07820',
    dotClass: 'bg-accent',
  },
  {
    type: 'test_completed',
    label: 'Teste finalizate',
    light: '#c08a10',
    dark: '#f8c050',
    dotClass: 'bg-[#c08a10] dark:bg-highlight',
  },
];

const numberFormatter = new Intl.NumberFormat('ro-RO');

const dayFormatter = new Intl.DateTimeFormat('ro-RO', {
  day: 'numeric',
  month: 'short',
});

function formatDay(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : dayFormatter.format(date).replace('.', '');
}

/* Read the live semantic tokens so the chart redraws itself correctly
   on either side of the day/night flip. */
function readPalette() {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const token = (name, fallback) =>
    styles.getPropertyValue(name).trim() || fallback;

  return {
    dark: root.getAttribute('data-theme') === 'dark',
    text: token('--sc-text', '#183838'),
    muted: token('--sc-text-muted', '#50706a'),
    grid: token('--sc-border', '#dbe4da'),
    surface: token('--sc-surface-raised', '#ffffff'),
  };
}

function applyTheme(chart) {
  const palette = readPalette();

  chart.data.datasets.forEach((dataset, index) => {
    const meta = EVENTS[index];
    const color = palette.dark ? meta.dark : meta.light;
    dataset.borderColor = color;
    dataset.pointBackgroundColor = color;
    dataset.pointBorderColor = palette.surface;
    /* The page-view route gets a faint wash under it, like shaded relief. */
    dataset.backgroundColor =
      meta.type === 'page_view'
        ? palette.dark
          ? 'rgb(88 176 152 / 0.10)'
          : 'rgb(56 136 112 / 0.08)'
        : 'transparent';
  });

  const { scales, plugins } = chart.options;
  scales.x.ticks.color = palette.muted;
  scales.x.border.color = palette.grid;
  scales.y.ticks.color = palette.muted;
  scales.y.grid.color = palette.grid;
  plugins.legend.labels.color = palette.text;
  plugins.tooltip.backgroundColor = palette.surface;
  plugins.tooltip.titleColor = palette.text;
  plugins.tooltip.bodyColor = palette.muted;
  plugins.tooltip.borderColor = palette.grid;
}

function buildChart(canvas, daily) {
  const days = [...new Set(daily.map((row) => row.date))].sort();
  const countByKey = new Map(
    daily.map((row) => [`${row.date}:${row.eventType}`, row.count]),
  );

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  const bodyFont = getComputedStyle(document.body).fontFamily;

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: days.map(formatDay),
      datasets: EVENTS.map((meta) => ({
        label: meta.label,
        data: days.map((day) => countByKey.get(`${day}:${meta.type}`) || 0),
        fill: meta.type === 'page_view' ? 'origin' : false,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBorderWidth: 1.5,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: reducedMotion ? false : { duration: 650, easing: 'easeOutQuart' },
      interaction: { mode: 'index', intersect: false },
      font: { family: bodyFont },
      scales: {
        x: {
          grid: { display: false },
          border: { color: '#888' },
          ticks: {
            color: '#888',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
            font: { family: bodyFont, size: 11 },
          },
        },
        y: {
          beginAtZero: true,
          /* Dashed gridlines — the same dashed routes as on the map. */
          border: { display: false, dash: [4, 6] },
          grid: { color: '#888' },
          ticks: {
            color: '#888',
            precision: 0,
            maxTicksLimit: 5,
            font: { family: bodyFont, size: 11 },
          },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#888',
            usePointStyle: true,
            pointStyle: 'line',
            boxWidth: 26,
            padding: 18,
            font: { family: bodyFont, size: 12 },
          },
        },
        tooltip: {
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          usePointStyle: true,
          boxPadding: 4,
          titleFont: { family: bodyFont, weight: '600' },
          bodyFont: { family: bodyFont },
        },
      },
    },
  });

  applyTheme(chart);
  chart.update('none');
  return chart;
}

function StatTile({ value, label, dotClass = null, featured = false }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-card">
      <p
        className={`font-display text-3xl font-semibold tabular-nums ${
          featured ? 'text-primary-strong dark:text-primary-soft' : 'text-text'
        }`}
      >
        {numberFormatter.format(value)}
      </p>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-text-muted">
        {dotClass && (
          <span
            aria-hidden="true"
            className={`size-2 flex-none rounded-full ${dotClass}`}
          />
        )}
        {label}
      </p>
    </div>
  );
}

/* The ship's log: total tiles plus a 30-day route chart, drawn with
   chart.js directly on a canvas. */
export default function StatsPanel() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) {
        setStatus('unavailable');
        return;
      }
      setData(await res.json());
      setStatus('ready');
    } catch {
      setStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* Chart lifecycle: build on data, re-ink on theme flip, destroy on exit. */
  useEffect(() => {
    if (status !== 'ready' || !data || !canvasRef.current) {
      return undefined;
    }

    const chart = buildChart(canvasRef.current, data.daily || []);
    chartRef.current = chart;

    const observer = new MutationObserver(() => {
      applyTheme(chart);
      chart.update('none');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      observer.disconnect();
      chart.destroy();
      chartRef.current = null;
    };
  }, [status, data]);

  if (status === 'loading') {
    return (
      <div className="flex h-72 items-center justify-center rounded-3xl border border-border bg-surface-raised text-text-muted shadow-card">
        <Spinner />
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <DeskEmpty
        title="Jurnalul de bord e alb."
        action={
          <ActionPill tone="primary" onClick={load}>
            Mai încearcă o dată
          </ActionPill>
        }
      >
        Statisticile nu pot fi aduse momentan — atlasul nu răspunde. Mai
        încearcă puțin mai târziu.
      </DeskEmpty>
    );
  }

  const totals = data?.totals || {};

  return (
    <div>
      {/* Legend tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile
          featured
          value={totals.total || 0}
          label="Evenimente în total"
        />
        {EVENTS.map((meta) => (
          <StatTile
            key={meta.type}
            value={totals[meta.type] || 0}
            label={meta.label}
            dotClass={meta.dotClass}
          />
        ))}
      </div>

      {/* The 30-day route */}
      <div className="mt-6 rounded-3xl border border-border bg-surface-raised p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-semibold">
            Activitate pe hartă
          </h3>
          <p className="text-xs font-medium text-text-muted">
            Evenimente pe zi · ultimele 30 de zile
          </p>
        </div>
        <div className="relative mt-5 h-72 sm:h-80">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Grafic cu evenimentele zilnice din ultimele 30 de zile, pe tipuri"
          />
        </div>
      </div>
    </div>
  );
}
