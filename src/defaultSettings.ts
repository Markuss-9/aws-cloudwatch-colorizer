import type { Settings, WordOption } from './types';

export type PresetName = 'error' | 'warn' | 'info' | 'debug';

export const WORD_PRESETS: Record<PresetName, WordOption> = {
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
};

const defaultSettings: Settings = {
  version: 2,
  master: true,
  performance: 'dom',
  advancedSettings: {
    Log_Groups: {
      title: 'Log groups',
      words: [
        WORD_PRESETS.error,
        WORD_PRESETS.warn,
        WORD_PRESETS.info,
        WORD_PRESETS.debug,
      ],
      id: 'Log_Groups',
      switch: true,
      isAvailable: true,
      wantBackground: true,
      // evenRowsShadeColor: 'rgba(42, 42, 42, 0.4)',
    },
    Log_Insights: {
      title: 'Log Insights',
      words: [
        WORD_PRESETS.error,
        WORD_PRESETS.warn,
        WORD_PRESETS.info,
        WORD_PRESETS.debug,
      ],
      id: 'Log_Insights',
      switch: true,
      isAvailable: true,
      wantBackground: true,
      // evenRowsShadeColor: 'rgba(42, 42, 42, 0.4)',
    },
    Log_Tails: {
      title: 'Log Tails',
      words: [
        WORD_PRESETS.error,
        WORD_PRESETS.warn,
        WORD_PRESETS.info,
        WORD_PRESETS.debug,
      ],
      id: 'Log_Tails',
      switch: false,
      isAvailable: false,
      wantBackground: true,
      // evenRowsShadeColor: 'rgba(42, 42, 42, 0.4)',
    },
  },
};

export default defaultSettings;
