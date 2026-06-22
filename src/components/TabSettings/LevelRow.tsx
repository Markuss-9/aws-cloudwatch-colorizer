import { Dispatch } from 'react';
import { Trash2 } from 'lucide-react';

import ColorPicker from '../ColorPicker';
import Swatch from './Swatch';
import PatternChip from './PatternChip';
import PatternAdder from './PatternAdder';
import type { Settings, LevelPreset, SettingsPages } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type OpenPicker = {
  page: SettingsPages;
  levelIdx: number;
  field: 'color' | 'backgroundColor';
} | null;

const LevelRow = ({
  level,
  idx,
  activeTab,
  openPicker,
  settings,
  setSettings,
  onToggleEnabled,
  onDelete,
  onRemovePattern,
  onAddPattern,
  onOpenPicker,
}: {
  level: LevelPreset;
  idx: number;
  activeTab: SettingsPages;
  openPicker: OpenPicker;
  settings: Settings;
  setSettings: Dispatch<Settings>;
  onToggleEnabled: (idx: number) => void;
  onDelete: (idx: number) => void;
  onRemovePattern: (levelIdx: number, patternIdx: number) => void;
  onAddPattern: (levelIdx: number, pattern: string) => void;
  onOpenPicker: Dispatch<OpenPicker>;
}) => {
  const isOpen = openPicker?.page === activeTab && openPicker.levelIdx === idx;

  return (
    <div className="bg-[#3a3a3a] rounded p-3">
      <div className="flex items-center gap-2">
        <Swatch
          color={level.color}
          label="Foreground"
          onClick={() =>
            onOpenPicker(
              isOpen && openPicker?.field === 'color'
                ? null
                : { page: activeTab, levelIdx: idx, field: 'color' },
            )
          }
        />
        <Swatch
          color={level.backgroundColor}
          label="Background"
          onClick={() =>
            onOpenPicker(
              isOpen && openPicker?.field === 'backgroundColor'
                ? null
                : { page: activeTab, levelIdx: idx, field: 'backgroundColor' },
            )
          }
        />

        <span className="inline-flex items-center gap-1 flex-1 min-w-0">
          <span className="text-xs leading-none">{level.emoji}</span>
          <span
            className="text-xs leading-none truncate"
            style={{ color: level.color }}
          >
            {level.label}
          </span>
        </span>

        <Switch checked={level.enabled} onCheckedChange={() => onToggleEnabled(idx)} />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onDelete(idx)}
              className="text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
            >
              <Trash2 size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Delete level</TooltipContent>
        </Tooltip>
      </div>

      {isOpen && (
        <div className="mt-3 flex justify-center">
          <ColorPicker
            currentColor={level[openPicker!.field]}
            onClose={() => onOpenPicker(null)}
            handleColorChange={(color) => {
              const updated = structuredClone(settings);
              updated.advancedSettings[activeTab].levels[idx][openPicker!.field] = color;
              setSettings(updated);
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-1 mt-2">
        {level.patterns.map((p, pi) => (
          <PatternChip
            key={pi}
            text={p}
            onRemove={() => onRemovePattern(idx, pi)}
          />
        ))}
        <PatternAdder onAdd={(pattern) => onAddPattern(idx, pattern)} />
      </div>
    </div>
  );
};

export default LevelRow;
