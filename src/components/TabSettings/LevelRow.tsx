import { Dispatch, useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

import ColorPicker from '../ColorPicker';
import Swatch from './Swatch';
import KeyBadge from './KeyBadge';
import ForegroundPreview from './ForegroundPreview';
import BackgroundPreview from './BackgroundPreview';
import PatternChip from './PatternChip';
import PatternAdder from './PatternAdder';
import type { Settings, LevelPreset, SettingsPages } from '@/types';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  wantBackground,
  autoFocusKey,
  onAutoFocusDone,
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
  wantBackground: boolean;
  autoFocusKey?: boolean;
  onAutoFocusDone?: () => void;
}) => {
  const isOpen = openPicker?.page === activeTab && openPicker.levelIdx === idx;
  const [editingField, setEditingField] = useState<'emoji' | 'label' | null>(
    null,
  );
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  const startEdit = (field: 'emoji' | 'label') => {
    setEditingField(field);
    setEditValue(field === 'emoji' ? level.emoji : level.label);
  };

  const commitEdit = () => {
    if (!editingField) return;
    const val = editValue.trim();
    if (val) {
      const updated = structuredClone(settings);
      if (editingField === 'emoji')
        updated.advancedSettings[activeTab].levels[idx].emoji = val;
      else updated.advancedSettings[activeTab].levels[idx].label = val;
      setSettings(updated);
    }
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSaveLevelKey = (val: string) => {
    const updated = structuredClone(settings);
    updated.advancedSettings[activeTab].levels[idx].level = val;
    setSettings(updated);
    onAutoFocusDone?.();
  };

  return (
    <div className="bg-surface-card border border-white/[5%] rounded p-3 relative overflow-hidden">
      <div className="flex items-center gap-2">
        <Swatch
          color={wantBackground ? level.backgroundColor : level.color}
          label={wantBackground ? 'Background' : 'Foreground'}
          onClick={() =>
            onOpenPicker(
              isOpen &&
                openPicker?.field ===
                  (wantBackground ? 'backgroundColor' : 'color')
                ? null
                : {
                    page: activeTab,
                    levelIdx: idx,
                    field: wantBackground ? 'backgroundColor' : 'color',
                  },
            )
          }
        />

        <span
          key={wantBackground ? 'no-label' : 'label'}
          className="inline-flex items-center gap-1 flex-1 min-w-0 animate-in fade-in zoom-in-95 slide-in-from-left-1 duration-200 ease-out"
        >
          {!wantBackground && editingField === 'emoji' ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              className="w-7 bg-transparent text-xs text-center border-b border-border-default outline-none focus:border-blue-400"
            />
          ) : !wantBackground ? (
            <span
              className="text-xs leading-none cursor-pointer hover:opacity-70"
              onClick={() => startEdit('emoji')}
              title="Click to edit"
            >
              {level.emoji}
            </span>
          ) : null}
          {!wantBackground && editingField === 'label' ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              className="flex-1 min-w-0 bg-transparent text-xs border-b border-border-default outline-none focus:border-blue-400"
              style={{ color: level.color }}
            />
          ) : !wantBackground ? (
            <span
              className="text-xs leading-none truncate cursor-pointer hover:opacity-70"
              style={{ color: level.color }}
              onClick={() => startEdit('label')}
              title="Click to edit"
            >
              {level.label}
            </span>
          ) : null}
        </span>

        <KeyBadge level={level.level} onSave={handleSaveLevelKey} autoFocus={autoFocusKey} />

        <Switch
          checked={level.enabled}
          onCheckedChange={() => onToggleEnabled(idx)}
        />
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

      <div
        key={wantBackground ? 'bg-preview' : 'fg-preview'}
        className="my-3 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-250 ease-out"
      >
        {wantBackground ? (
          <BackgroundPreview
            patterns={level.patterns}
            backgroundColor={level.backgroundColor}
          />
        ) : (
          <ForegroundPreview
            emoji={level.emoji}
            label={level.label}
            color={level.color}
          />
        )}
      </div>

      {isOpen && (
        <div className="mt-3 flex justify-center">
          <ColorPicker
            currentColor={level[openPicker!.field]}
            onClose={() => onOpenPicker(null)}
            handleColorChange={(color) => {
              const updated = structuredClone(settings);
              updated.advancedSettings[activeTab].levels[idx][
                openPicker!.field
              ] = color;
              setSettings(updated);
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
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
