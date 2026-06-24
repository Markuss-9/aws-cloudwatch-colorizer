import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import LevelRow from './LevelRow';
import type {
  Settings,
  LevelPreset,
  SettingsPages,
  PageSettings,
} from '@/types';
import { Switch } from '@/components/ui/switch';

type OpenPicker = {
  page: SettingsPages;
  levelIdx: number;
  field: 'color' | 'backgroundColor';
} | null;

const TabSettings = ({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}) => {
  const entries = Object.entries(settings.advancedSettings) as [
    SettingsPages,
    PageSettings,
  ][];
  const enabledEntries = entries.filter(([key]) => key !== 'Log_Tails');
  const [activeTab, setActiveTab] = useState<SettingsPages>(
    enabledEntries[0]?.[0],
  );
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const [autoFocusKeyIdx, setAutoFocusKeyIdx] = useState<number | null>(null);

  const activePage = settings.advancedSettings[activeTab];

  const togglePageSwitch = () => {
    setSettings((prev) => {
      const updated = structuredClone(prev);
      updated.advancedSettings[activeTab].switch =
        !updated.advancedSettings[activeTab].switch;
      return updated;
    });
  };

  const toggleWantBackground = () => {
    setSettings((prev) => {
      const updated = structuredClone(prev);
      updated.advancedSettings[activeTab].wantBackground =
        !updated.advancedSettings[activeTab].wantBackground;
      return updated;
    });
  };

  const toggleLevelEnabled = (levelIdx: number) => {
    setSettings((prev) => {
      const updated = structuredClone(prev);
      updated.advancedSettings[activeTab].levels[levelIdx].enabled =
        !updated.advancedSettings[activeTab].levels[levelIdx].enabled;
      return updated;
    });
  };

  const deleteLevel = (levelIdx: number) => {
    setSettings((prev) => {
      const updated = structuredClone(prev);
      updated.advancedSettings[activeTab].levels = updated.advancedSettings[
        activeTab
      ].levels.filter((_, i) => i !== levelIdx);
      return updated;
    });
    setOpenPicker(null);
  };

  const removePattern = (levelIdx: number, patternIdx: number) => {
    setSettings((prev) => {
      const updated = structuredClone(prev);
      updated.advancedSettings[activeTab].levels[levelIdx].patterns =
        updated.advancedSettings[activeTab].levels[levelIdx].patterns.filter(
          (_, i) => i !== patternIdx,
        );
      return updated;
    });
  };

  const addPattern = (levelIdx: number, pattern: string) => {
    if (!pattern.trim()) return;
    setSettings((prev) => {
      const updated = structuredClone(prev);
      const l = updated.advancedSettings[activeTab].levels[levelIdx];
      if (!l.patterns.includes(pattern.trim())) l.patterns.push(pattern.trim());
      return updated;
    });
  };

  const updateLevelField = (
    levelIdx: number,
    field: 'emoji' | 'label',
    value: string,
  ) => {
    setSettings((prev) => {
      const updated = structuredClone(prev);
      updated.advancedSettings[activeTab].levels[levelIdx][field] = value;
      return updated;
    });
  };

  const updateLevelKey = (levelIdx: number, value: string) => {
    setSettings((prev) => {
      const updated = structuredClone(prev);
      updated.advancedSettings[activeTab].levels[levelIdx].level = value;
      return updated;
    });
  };

  const updateLevelColor = (
    levelIdx: number,
    field: 'color' | 'backgroundColor',
    value: string,
  ) => {
    setSettings((prev) => {
      const updated = structuredClone(prev);
      updated.advancedSettings[activeTab].levels[levelIdx][field] = value;
      return updated;
    });
  };

  const addLevel = () => {
    setSettings((prev) => {
      const updated = structuredClone(prev);
      const levels = updated.advancedSettings[activeTab].levels;
      const maxCode =
        levels.length > 0 ? Math.max(...levels.map((l) => l.code), 30) : 30;
      const newLevel: LevelPreset = {
        enabled: true,
        code: maxCode + 1,
        level: '',
        patterns: [],
        color: 'rgba(255, 255, 255, 1)',
        backgroundColor: 'rgba(100, 100, 100, 0.3)',
        emoji: '📋',
        label: 'New Level',
      };
      levels.push(newLevel);
      setAutoFocusKeyIdx(levels.length - 1);
      return updated;
    });
  };

  const tabLabels: Record<SettingsPages, string> = {
    Log_Groups: 'Log Groups',
    Log_Insights: 'Insights',
    Log_Tails: 'Tails',
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex border-b border-app-border">
        {entries.map(([key]) => {
          const isDisabled = key === 'Log_Tails';
          return (
            <button
              key={key}
              disabled={isDisabled}
              onClick={() => {
                setActiveTab(key);
                setOpenPicker(null);
                setAutoFocusKeyIdx(null);
              }}
              className={`flex-1 py-1.5 text-xs border-b-2 bg-transparent border-none font-bold transition-colors ${
                activeTab === key
                  ? 'text-brand border-brand'
                  : 'text-app-muted border-transparent hover:text-app-text'
              } ${
                isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {tabLabels[key]}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-app-border px-3 py-2 bg-app-surface">
        <div className="flex items-center gap-2">
          <Switch
            checked={activePage.switch}
            onCheckedChange={togglePageSwitch}
          />
          <span
            className={`text-xs ${
              activePage.switch ? 'text-app-accent' : 'text-app-muted'
            }`}
          >
            {activePage.switch ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <div className="flex rounded-md border border-app-border overflow-hidden">
          <button
            onClick={() =>
              setSettings((prev) => {
                const u = structuredClone(prev);
                u.advancedSettings[activeTab].wantBackground = true;
                return u;
              })
            }
            className={`text-[11px] px-2.5 py-1 text-center transition-colors cursor-pointer border-none font-medium ${
              activePage.wantBackground
                ? 'bg-app-accent text-black'
                : 'bg-transparent text-app-muted hover:text-app-text'
            }`}
          >
            Background
          </button>
          <div className="w-px bg-app-border" />
          <button
            onClick={() =>
              setSettings((prev) => {
                const u = structuredClone(prev);
                u.advancedSettings[activeTab].wantBackground = false;
                return u;
              })
            }
            className={`text-[11px] px-2.5 py-1 text-center transition-colors cursor-pointer border-none font-medium ${
              !activePage.wantBackground
                ? 'bg-app-accent text-black'
                : 'bg-transparent text-app-muted hover:text-app-text'
            }`}
          >
            Replace
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {activePage.levels.map((level, idx) => (
          <LevelRow
            key={`${activeTab}-${level.level}-${idx}`}
            level={level}
            idx={idx}
            activeTab={activeTab}
            openPicker={openPicker}
            onToggleEnabled={toggleLevelEnabled}
            onDelete={deleteLevel}
            onRemovePattern={removePattern}
            onAddPattern={addPattern}
            onOpenPicker={setOpenPicker}
            onUpdateField={updateLevelField}
            onUpdateKey={updateLevelKey}
            onUpdateColor={updateLevelColor}
            wantBackground={activePage.wantBackground}
            autoFocusKey={idx === autoFocusKeyIdx}
            onAutoFocusDone={() => setAutoFocusKeyIdx(null)}
          />
        ))}
      </div>

      <div className="border-t border-app-border pt-2">
        <button
          onClick={addLevel}
          className="w-full text-xs text-app-muted hover:text-app-text cursor-pointer bg-transparent border border-dashed border-app-border hover:border-app-text/40 rounded py-1.5 transition-colors"
        >
          + Add Level
        </button>
      </div>
    </div>
  );
};

export default TabSettings;
