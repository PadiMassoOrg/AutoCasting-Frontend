import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type AppConfig = {
  maintenanceWarning?: boolean;
  maintenanceMessageKey?: string;
  maintenanceWindow?: string; // ISO: "2025-09-23T20:00:00+02:00"
  appVersion?: string;
  apiBaseUrl?: string;
};

function resolveBase(): string {
  const w = window as any;
  const fromGlobal = w.__APP_BASE__;
  const fromVite = (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) || undefined;
  const fromCRA = (typeof process !== 'undefined' && (process as any).env?.PUBLIC_URL) || undefined;
  const base = fromGlobal ?? fromVite ?? fromCRA ?? '/';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function buildConfigUrl(): string {
  const base = resolveBase();
  return `${base}/config.json?ts=${Date.now()}`;
}

function useAppConfig(pollMs = 900000) {
  const [cfg, setCfg] = useState<AppConfig | null>(null);

  async function load() {
    const url = buildConfigUrl();
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`);
      const data = (await r.json()) as AppConfig;
      setCfg(data);
    } catch (err) {
      console.warn('[useAppConfig] Cannot read config.json:', err);
      setCfg(null);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, pollMs);
    return () => clearInterval(id);
  }, [pollMs]);

  return cfg;
}

export function MaintenanceBanner() {
  const { t, i18n } = useTranslation();
  const cfg = useAppConfig();
  const [hidden, setHidden] = useState(false);

  if (!cfg?.maintenanceWarning || hidden) return null;

  const text = t(cfg.maintenanceMessageKey ?? 'maintenance.scheduled', {
    date: cfg.maintenanceWindow,
  });

  return (
    <div className="flex items-center justify-center gap-4 p-4 border-b border-b-[#ffe08a] bg-[#fff3cd] text-[var(--color-primary-black)] text-sm text-center w-full">
      <span aria-live="polite">{text}</span>
      <button
        onClick={() => setHidden(true)}
        aria-label={i18n.t('general.close')}
        className="border-0 bg-transparent cursor-pointer font-semibold text-lg"
      >
        ×
      </button>
    </div>
  );
}
