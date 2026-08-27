import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Runtime app config shared with the Mobile app, stored in a single Supabase row
// (public.app_config, id = 1) and read directly by the client — no backend, no
// config.json. See docs/supabase-app-config.sql for the table + RLS + realtime setup.
//
// Only feature: a dismissible top banner warning users that maintenance is coming
// on a given day. Operators edit two fields in the Supabase Table Editor:
//   * maintenance_warning (bool) — show the banner
//   * maintenance_at (date)      — the day maintenance will happen (date only, no time)

export type AppConfig = {
  maintenanceWarning: boolean;
  /** Date string "YYYY-MM-DD" of the announced maintenance day. */
  maintenanceAt: string;
};

const DEFAULT_MAINTENANCE_DATE = '2028-01-01';

export const DEFAULT_APP_CONFIG: AppConfig = {
  maintenanceWarning: false,
  maintenanceAt: DEFAULT_MAINTENANCE_DATE,
};

type AppConfigRow = {
  maintenance_warning: boolean | null;
  maintenance_at: string | null;
};

function rowToConfig(row: AppConfigRow | null): AppConfig {
  if (!row) return DEFAULT_APP_CONFIG;
  return {
    maintenanceWarning: row.maintenance_warning ?? false,
    maintenanceAt: row.maintenance_at ?? DEFAULT_MAINTENANCE_DATE,
  };
}

/**
 * Turn the "YYYY-MM-DD" maintenance date into a Date at LOCAL midnight, so the
 * i18n `date` formatter renders the correct day in the viewer's timezone
 * (a bare "YYYY-MM-DD" would be parsed as UTC and can shift a day).
 */
export function maintenanceDateToLocalMidnight(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00`);
}

async function fetchAppConfig(): Promise<AppConfig> {
  const { data, error } = await supabase
    .from('app_config')
    .select('maintenance_warning, maintenance_at')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    // Fail open — a config read failure must never take the app down.
    console.warn('[appConfig] Cannot read app_config from Supabase:', error.message);
    return DEFAULT_APP_CONFIG;
  }
  return rowToConfig(data as AppConfigRow | null);
}

// -- Module-level singleton store -------------------------------------------
// One Supabase channel and one visibility listener for the whole app, regardless
// of how many components read the config. Supabase dedupes channels by name and
// rejects `.on()` after `.subscribe()`, so a per-hook channel named 'app_config'
// crashes the second consumer — hence this shared store.

let currentConfig: AppConfig = DEFAULT_APP_CONFIG;
const listeners = new Set<(config: AppConfig) => void>();
let started = false;

function emit(next: AppConfig) {
  currentConfig = next;
  listeners.forEach((listener) => listener(next));
}

function refresh() {
  void fetchAppConfig().then(emit);
}

function start() {
  if (started) return;
  started = true;

  refresh();

  supabase
    .channel('app_config')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_config', filter: 'id=eq.1' }, (payload) => {
      emit(rowToConfig((payload.new as AppConfigRow) ?? null));
    })
    .subscribe();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refresh();
  });
}

/**
 * Live app config. Reads once on first use, then stays current via a shared
 * Supabase Realtime subscription and a tab-focus re-check.
 */
export function useAppConfig(): AppConfig {
  const [config, setConfig] = useState<AppConfig>(currentConfig);

  useEffect(() => {
    start();
    listeners.add(setConfig);
    setConfig(currentConfig);
    return () => {
      listeners.delete(setConfig);
    };
  }, []);

  return config;
}
