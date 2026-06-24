import type { Settings, LevelPreset } from './types';

function presets<T extends Record<string, Omit<LevelPreset, 'level'>>>(
  obj: T,
): { [K in keyof T]: LevelPreset & { level: K } } {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, { ...val, level: key }]),
  ) as { [K in keyof T]: LevelPreset & { level: K } };
}

export const LEVEL_PRESETS = presets({
  error: {
    enabled: true,
    code: 31,
    patterns: ['error', 'err'],
    color: 'rgba(255, 0, 0, 1)',
    backgroundColor: 'rgba(155, 0, 0, 0.44)',
    // TODO: instead of two separate props just put one, this is used only for when i replace a pattern
    emoji: '❌',
    label: 'Error',

    // for now i inserted the feature but in future i think it needs to be for pattern
    regex: false,
  },
  warn: {
    enabled: true,
    code: 33,
    patterns: ['warning', 'warn'],
    color: 'rgba(255, 242, 0, 1)',
    backgroundColor: 'rgba(227, 217, 0, 0.4)',
    emoji: '⚠️',
    label: 'Warn',
  },
  info: {
    enabled: true,
    code: 32,
    patterns: ['information', 'info'],
    color: 'rgba(0, 200, 0, 1)',
    backgroundColor: 'rgba(0, 155, 10, 0.16)',
    emoji: 'ℹ️',
    label: 'Info',
  },
  debug: {
    enabled: true,
    code: 34,
    patterns: ['debug', 'dbg'],
    color: 'rgba(0, 125, 255, 1)',
    backgroundColor: 'rgba(0, 78, 155, 0.16)',
    emoji: '🐛',
    label: 'Debug',
  },
});

export type PresetName = keyof typeof LEVEL_PRESETS;

const defaultLevels = () => [
  { ...LEVEL_PRESETS.error },
  { ...LEVEL_PRESETS.warn },
  { ...LEVEL_PRESETS.info },
  { ...LEVEL_PRESETS.debug },
];

const defaultSettings: Settings = {
  version: 2,
  master: true,
  performance: 'dom',
  advancedSettings: {
    Log_Groups: {
      title: 'Log groups',
      levels: defaultLevels(),
      id: 'Log_Groups',
      switch: true,
      isAvailable: true,
      wantBackground: true,
    },
    Log_Insights: {
      title: 'Log Insights',
      levels: defaultLevels(),
      id: 'Log_Insights',
      switch: true,
      isAvailable: true,
      wantBackground: true,
    },
    Log_Tails: {
      title: 'Log Tails',
      levels: defaultLevels(),
      id: 'Log_Tails',
      switch: false,
      isAvailable: false,
      wantBackground: true,
    },
  },
};

export default structuredClone(defaultSettings);
