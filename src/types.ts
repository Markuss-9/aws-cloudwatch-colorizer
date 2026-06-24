export interface LevelPreset {
  enabled: boolean;
  code: number;
  level: string;
  patterns: string[];
  color: string;
  backgroundColor: string;
  emoji: string;
  label: string;
  regex?: boolean;
}

export interface PageSettings {
  title: string;
  levels: LevelPreset[];
  id: string;
  switch: boolean;
  isAvailable: boolean;
  wantBackground: boolean;
  evenRowsShadeColor?: string;
}

export type PerformanceMode = 'timer' | 'dom' | 'net' | 'manual';

export const PAGE_SETTINGS_KEYS = {
  LOG_GROUPS: 'Log_Groups',
  LOG_INSIGHTS: 'Log_Insights',
  LOG_ANALYTICS: 'Log_Analytics',
} as const;

export interface AdvancedSettings {
  [PAGE_SETTINGS_KEYS.LOG_GROUPS]: PageSettings;
  [PAGE_SETTINGS_KEYS.LOG_INSIGHTS]: PageSettings;
  [PAGE_SETTINGS_KEYS.LOG_ANALYTICS]: PageSettings;
}

export type SettingsPages = keyof AdvancedSettings & (string & {});

export interface Settings {
  version: number;
  master: boolean;
  performance: PerformanceMode;
  advancedSettings: AdvancedSettings;
}

export interface ExtensionMessage {
  type: 'changeSettings' | 'manualColorize';
}
