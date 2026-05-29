import './style.css';

import { Dispatch, useEffect, useState } from 'react';

import type { Settings, PageSettings, SettingsPages } from '@/types';
import CustomAccordion from './CustomAccordion';

export default function ControlledAccordions({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: Dispatch<Settings>;
}) {
  const [expanded, setExpanded] = useState<SettingsPages | false>(false);
  const [showColorPicker, setShowColorPicker] = useState<string>('');

  const [disabledAccordions, setDisabledAccordions] = useState(['']);

  const handleChange =
    (panel: SettingsPages) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      setShowColorPicker('');
    };

  const handleSwitchClick = (
    event: { stopPropagation: () => void },
    panel: SettingsPages,
  ) => {
    event.stopPropagation();

    let currentAccordion: PageSettings = settings.advancedSettings[panel];
    if (currentAccordion.switch) {
      setTimeout(() => {
        setExpanded(false);
        setDisabledAccordions([...disabledAccordions, panel]);
      }, 100);
    } else {
      let tempDis = disabledAccordions;
      tempDis = tempDis.filter(function (s) {
        return s !== panel;
      });
      setDisabledAccordions([...tempDis]);
    }
    let tempSettings = settings;
    tempSettings.advancedSettings[panel].switch =
      !tempSettings.advancedSettings[panel].switch;
    setSettings({ ...tempSettings });
  };

  useEffect(() => {
    (Object.entries(settings.advancedSettings) as [SettingsPages, PageSettings][]).forEach(
      ([key, section]) => {
        if (!section.switch)
          setDisabledAccordions([...disabledAccordions, key]);
      },
    );
  }, []);

  return (
    <div className="center">
      {(Object.entries(settings.advancedSettings) as [SettingsPages, PageSettings][]).map(
        ([keyAccordion, section], i) => {
          return (
            <CustomAccordion
              expanded={expanded}
              keyAccordion={keyAccordion}
              disabledAccordions={disabledAccordions}
              handleChange={handleChange}
              section={section}
              i={i}
              key={`${keyAccordion}-CustomAccordion`}
              handleSwitchClick={handleSwitchClick}
              settings={settings}
              setSettings={setSettings}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
            />
          );
        },
      )}
    </div>
  );
}
