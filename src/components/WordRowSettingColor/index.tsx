import { Dispatch, useState } from 'react';
import { ColorResult } from 'react-color';
import { Box, Grid, Switch, Tooltip, Typography } from '@mui/material';
import { findIndex } from 'lodash-es';

import ColorPicker from '../ColorPicker';
import info from '../Info';
import CircleButtonColor from '../CircleButtonColor';
import type { Settings, LevelPreset, SettingsPages } from '@/types';

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

  const handleColorChange = (color: ColorResult) => {
    setCurrentColor(
      `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
    );
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
      <Box>
        <Grid
          container
          direction="row"
          sx={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <Grid size={4}>
            <CircleButtonColor
              savedColor={options.color}
              toggleColorPicker={toggleColorPicker}
            />
          </Grid>
          <Grid size={2}>
            <Typography color={options.color}>{options.emoji}</Typography>
          </Grid>
          <Grid size={2}>
            <Typography color={options.color}>{options.label}</Typography>
          </Grid>
          <Grid size={4}>
            <Tooltip
              title={
                switchWordEnabled ? info('Disable word') : info('Enable word')
              }
            >
              <Switch
                checked={switchWordEnabled}
                onClick={() => {
                  switchWordAction();
                }}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

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
