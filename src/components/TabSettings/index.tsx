import { Dispatch, useState } from 'react';

import LevelRow from './LevelRow';
import type { Settings, LevelPreset, SettingsPages, PageSettings } from '@/types';
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
  setSettings: Dispatch<Settings>;
}) => {
  const entries = Object.entries(settings.advancedSettings) as [SettingsPages, PageSettings][];
  const enabledEntries = entries.filter(([key]) => key !== 'Log_Tails');
  const [activeTab, setActiveTab] = useState<SettingsPages>(enabledEntries[0]?.[0] ?? 'Log_Groups');
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const [showAddLevel, setShowAddLevel] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelPatterns, setNewLevelPatterns] = useState('');
  const [newLevelEmoji, setNewLevelEmoji] = useState('');

  const activePage = settings.advancedSettings[activeTab];

  const togglePageSwitch = () => {
    const updated = structuredClone(settings);
    updated.advancedSettings[activeTab].switch = !updated.advancedSettings[activeTab].switch;
    setSettings(updated);
  };

  const toggleLevelEnabled = (levelIdx: number) => {
    const updated = structuredClone(settings);
    updated.advancedSettings[activeTab].levels[levelIdx].enabled =
      !updated.advancedSettings[activeTab].levels[levelIdx].enabled;
    setSettings(updated);
  };

  const deleteLevel = (levelIdx: number) => {
    const updated = structuredClone(settings);
    updated.advancedSettings[activeTab].levels =
      updated.advancedSettings[activeTab].levels.filter((_, i) => i !== levelIdx);
    setSettings(updated);
    setOpenPicker(null);
  };

  const removePattern = (levelIdx: number, patternIdx: number) => {
    const updated = structuredClone(settings);
    updated.advancedSettings[activeTab].levels[levelIdx].patterns =
      updated.advancedSettings[activeTab].levels[levelIdx].patterns.filter((_, i) => i !== patternIdx);
    setSettings(updated);
  };

  const addPattern = (levelIdx: number, pattern: string) => {
    if (!pattern.trim()) return;
    const updated = structuredClone(settings);
    const l = updated.advancedSettings[activeTab].levels[levelIdx];
    if (!l.patterns.includes(pattern.trim())) l.patterns.push(pattern.trim());
    setSettings(updated);
  };

  const addLevel = () => {
    if (!newLevelName.trim()) return;
    const updated = structuredClone(settings);
    const levels = updated.advancedSettings[activeTab].levels;
    const maxCode = levels.length > 0 ? Math.max(...levels.map(l => l.code), 30) : 30;
    const patterns = newLevelPatterns.split(',').map(s => s.trim()).filter(Boolean);
    const newLevel: LevelPreset = {
      enabled: true,
      code: maxCode + 1,
      level: newLevelName.trim().toLowerCase().replace(/\s+/g, '_'),
      patterns: patterns.length > 0 ? patterns : [newLevelName.trim().toLowerCase()],
      color: 'rgba(255, 255, 255, 1)',
      backgroundColor: 'rgba(100, 100, 100, 0.3)',
      emoji: newLevelEmoji || '📋',
      label: newLevelName.trim(),
    };
    levels.push(newLevel);
    setSettings(updated);
    setShowAddLevel(false);
    setNewLevelName('');
    setNewLevelPatterns('');
    setNewLevelEmoji('');
  };

  const tabLabels: Record<SettingsPages, string> = {
    Log_Groups: 'Log Groups',
    Log_Insights: 'Insights',
    Log_Tails: 'Tails',
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex border-b border-[#555]">
        {entries.map(([key]) => {
          const isDisabled = key === 'Log_Tails';
          return (
            <button
              key={key}
              disabled={isDisabled}
              onClick={() => { setActiveTab(key); setOpenPicker(null); setShowAddLevel(false); }}
              className={`flex-1 py-1.5 text-xs border-b-2 bg-transparent border-none font-bold transition-colors ${
                activeTab === key
                  ? 'text-[#1976d2] border-[#1976d2]'
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              } ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {tabLabels[key]}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Switch checked={activePage.switch} onCheckedChange={togglePageSwitch} />
        <span className="text-xs text-gray-300">
          {activePage.switch ? 'Colorizing' : 'Disabled'}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {activePage.levels.map((level, idx) => (
          <LevelRow
            key={`${level.level}-${idx}`}
            level={level}
            idx={idx}
            activeTab={activeTab}
            openPicker={openPicker}
            settings={settings}
            setSettings={setSettings}
            onToggleEnabled={toggleLevelEnabled}
            onDelete={deleteLevel}
            onRemovePattern={removePattern}
            onAddPattern={addPattern}
            onOpenPicker={setOpenPicker}
          />
        ))}
      </div>

      <div className="border-t border-[#555] pt-2">
        {showAddLevel ? (
          <div className="flex flex-col gap-1.5">
            <input
              value={newLevelName}
              onChange={e => setNewLevelName(e.target.value)}
              placeholder="Level name"
              className="bg-[#444] text-white text-xs px-2 py-1 border border-[#666] rounded"
            />
            <div className="flex gap-1">
              <input
                value={newLevelPatterns}
                onChange={e => setNewLevelPatterns(e.target.value)}
                placeholder="patterns (comma sep.)"
                className="flex-1 bg-[#444] text-white text-xs px-2 py-1 border border-[#666] rounded"
              />
              <input
                value={newLevelEmoji}
                onChange={e => setNewLevelEmoji(e.target.value)}
                placeholder="emoji"
                className="w-12 bg-[#444] text-white text-xs px-2 py-1 border border-[#666] rounded text-center"
              />
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setShowAddLevel(false)}
                className="px-3 py-1 text-xs text-gray-300 hover:text-white cursor-pointer bg-transparent border border-[#666] rounded"
              >
                Cancel
              </button>
              <button
                onClick={addLevel}
                className="px-3 py-1 text-xs text-white bg-[#1976d2] hover:bg-[#1565c0] cursor-pointer border-none rounded"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddLevel(true)}
            className="w-full text-xs text-blue-300 hover:text-blue-100 cursor-pointer bg-transparent border-none py-1"
          >
            + Add Level
          </button>
        )}
      </div>
    </div>
  );
};

export default TabSettings;
