export interface WordOption {
  enabled: boolean;
  code: number;
  word: string;
  color: string;
  backgroundColor: string;
  emoji: string;
  label: string;
}

export interface PageSettings {
  title: string;
  words: WordOption[];
  id: string;
  switch: boolean;
  isAvailable: boolean;
  wantBackground: boolean;
  evenRowsShadeColor?: string;
}

export type PerformanceMode = 'timer' | 'dom' | 'net' | 'manual';

export interface AdvancedSettings {
  Log_Groups: PageSettings;
  Log_Insights: PageSettings;
  Log_Tails: PageSettings;
}

export type SettingsPages = keyof AdvancedSettings & (string & {});

export interface Settings {
  version: string;
  master: boolean;
  performance: PerformanceMode;
  advancedSettings: AdvancedSettings;
}

export interface ExtensionMessage {
  type: 'changeSettings' | 'manualColorize';
}
