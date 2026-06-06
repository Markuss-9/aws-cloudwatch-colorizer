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

const WordRowSettingColor = ({
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
  const [currentColor, setCurrentColor] = useState(options.color);
  const [switchWordEnabled, setSwitchWordEnabled] = useState<boolean>(
    options.enabled,
  );

  const toggleColorPicker = () => {
    if (showColorPicker) {
      let tempSettings = settings;
      let pos = findIndex(tempSettings.advancedSettings[keyAccordion].levels, {
        level: options.level,
      });
      tempSettings.advancedSettings[keyAccordion].levels[pos] = {
        ...options,
        color: currentColor,
      };
      setSettings({ ...tempSettings });
      setShowColorPicker('');
    } else setShowColorPicker(options.level);
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };

  const switchWordAction = () => {
    let tempSettings = settings;
    let pos = findIndex(tempSettings.advancedSettings[keyAccordion].levels, {
      level: options.level,
    });
    tempSettings.advancedSettings[keyAccordion].levels[pos] = {
      ...options,
      enabled: !switchWordEnabled,
    };
    setSettings({ ...tempSettings });
    setSwitchWordEnabled(!switchWordEnabled);
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-[4fr_2fr_2fr_4fr] items-center justify-items-center">
          <div>
            <CircleButtonColor
              savedColor={options.color}
              toggleColorPicker={toggleColorPicker}
            />
          </div>
          <div>
            <span style={{ color: options.color }}>{options.emoji}</span>
          </div>
          <div>
            <span style={{ color: options.color }}>{options.label}</span>
          </div>
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

export default WordRowSettingColor;
