import { Dispatch, useState } from 'react';
import { findIndex } from 'lodash-es';

import ColorPicker from '../ColorPicker';
import InfoTooltip from '../Info';
import CircleButtonColor from '../CircleButtonColor';
import type { Settings, LevelPreset, SettingsPages } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

const WordRowSettingBackground = ({
  settings,
  setSettings,
  options,
  showColorPicker,
  setShowColorPicker,
  keyAccordion,
}: {
  settings: Settings;
  setSettings: Dispatch<Settings>;
  options: LevelPreset;
  showColorPicker: string;
  setShowColorPicker: Dispatch<string>;
  keyAccordion: SettingsPages;
}) => {
  const [currentColor, setCurrentColor] = useState(options.backgroundColor);
  const [switchWordEnabled, setSwitchWordEnabled] = useState<boolean>(
    options.enabled,
  );
  const [newPattern, setNewPattern] = useState('');
  const [showAddPattern, setShowAddPattern] = useState(false);

  const toggleColorPicker = () => {
    if (showColorPicker) {
      const updated = structuredClone(settings);
      const pos = findIndex(updated.advancedSettings[keyAccordion].levels, {
        level: options.level,
      });
      updated.advancedSettings[keyAccordion].levels[pos] = {
        ...updated.advancedSettings[keyAccordion].levels[pos],
        backgroundColor: currentColor,
      };
      setSettings(updated);
      setShowColorPicker('');
    } else setShowColorPicker(options.level);
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };

  const switchWordAction = () => {
    const updated = structuredClone(settings);
    const pos = findIndex(updated.advancedSettings[keyAccordion].levels, {
      level: options.level,
    });
    updated.advancedSettings[keyAccordion].levels[pos] = {
      ...updated.advancedSettings[keyAccordion].levels[pos],
      enabled: !switchWordEnabled,
    };
    setSettings(updated);
    setSwitchWordEnabled(!switchWordEnabled);
  };

  const removePattern = (patternIndex: number) => {
    const updated = structuredClone(settings);
    const pos = findIndex(updated.advancedSettings[keyAccordion].levels, {
      level: options.level,
    });
    updated.advancedSettings[keyAccordion].levels[pos].patterns =
      updated.advancedSettings[keyAccordion].levels[pos].patterns.filter(
        (_, i) => i !== patternIndex,
      );
    setSettings(updated);
  };

  const addPattern = () => {
    if (!newPattern.trim()) return;
    const updated = structuredClone(settings);
    const pos = findIndex(updated.advancedSettings[keyAccordion].levels, {
      level: options.level,
    });
    if (
      !updated.advancedSettings[keyAccordion].levels[pos].patterns.includes(
        newPattern.trim(),
      )
    ) {
      updated.advancedSettings[keyAccordion].levels[pos].patterns.push(
        newPattern.trim(),
      );
      setSettings(updated);
    }
    setNewPattern('');
    setShowAddPattern(false);
  };

  const deleteLevel = () => {
    const updated = structuredClone(settings);
    updated.advancedSettings[keyAccordion].levels =
      updated.advancedSettings[keyAccordion].levels.filter(
        l => l.level !== options.level,
      );
    setSettings(updated);
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-[4fr_2fr_2fr_3fr_1fr] items-center justify-items-center">
          <div>
            <CircleButtonColor
              savedColor={options.backgroundColor}
              toggleColorPicker={toggleColorPicker}
            />
          </div>
          <div>
            <span>{options.level}</span>
          </div>
          <div />
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={switchWordEnabled}
                    onCheckedChange={() => switchWordAction()}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <InfoTooltip
                  msg={switchWordEnabled ? 'Disable word' : 'Enable word'}
                />
              </TooltipContent>
            </Tooltip>
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLevel();
                  }}
                  className="text-red-400 hover:text-red-200 cursor-pointer bg-transparent border-none text-xs leading-none"
                >
                  ✕
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete level</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 justify-center mt-1">
          {options.patterns.map((p, patternIdx) => (
            <span
              key={patternIdx}
              className="inline-flex items-center gap-0.5 bg-[#555] text-[10px] px-1.5 py-0.5 rounded"
            >
              {p}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePattern(patternIdx);
                }}
                className="text-red-300 hover:text-red-100 cursor-pointer bg-transparent border-none p-0 leading-none text-xs"
              >
                ×
              </button>
            </span>
          ))}
          {showAddPattern ? (
            <span className="inline-flex items-center gap-0.5">
              <input
                value={newPattern}
                onChange={e => setNewPattern(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') addPattern();
                }}
                placeholder="pattern"
                className="w-16 bg-[#444] text-white text-[10px] px-1 py-0.5 border border-[#666] rounded"
                autoFocus
              />
              <button
                onClick={addPattern}
                className="text-green-300 hover:text-green-100 cursor-pointer bg-transparent border-none p-0 leading-none text-xs"
              >
                +add
              </button>
              <button
                onClick={() => {
                  setShowAddPattern(false);
                  setNewPattern('');
                }}
                className="text-gray-400 hover:text-gray-200 cursor-pointer bg-transparent border-none p-0 leading-none text-xs"
              >
                ×
              </button>
            </span>
          ) : (
            <button
              onClick={() => setShowAddPattern(true)}
              className="text-blue-300 hover:text-blue-100 cursor-pointer bg-transparent border-none p-0 leading-none text-[10px]"
            >
              +pattern
            </button>
          )}
        </div>
      </div>

      {showColorPicker === options.level && (
        <ColorPicker
          currentColor={currentColor}
          handleColorChange={handleColorChange}
        />
      )}
    </>
  );
};

export default WordRowSettingBackground;
