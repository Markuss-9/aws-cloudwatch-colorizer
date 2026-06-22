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
    (panel: SettingsPages) =>
    (event: React.SyntheticEvent | null, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      setShowColorPicker('');
    };

  const handleSwitchClick = (
    event: { stopPropagation: () => void },
    panel: SettingsPages,
  ) => {
    event.stopPropagation();

    const currentAccordion: PageSettings = settings.advancedSettings[panel];
    if (currentAccordion.switch) {
      setExpanded(false);
      setDisabledAccordions(prev => [...prev, panel]);
    } else {
      setDisabledAccordions(prev => prev.filter(s => s !== panel));
    }

    const updated = structuredClone(settings);
    updated.advancedSettings[panel].switch =
      !updated.advancedSettings[panel].switch;
    setSettings(updated);
  };

  useEffect(() => {
    const disabled = (
      Object.entries(settings.advancedSettings) as [
        SettingsPages,
        PageSettings,
      ][]
    )
      .filter(([, section]) => !section.switch)
      .map(([key]) => key);
    setDisabledAccordions(disabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-center">
      {(
        Object.entries(settings.advancedSettings) as [
          SettingsPages,
          PageSettings,
        ][]
      ).map(([keyAccordion, section], i) => {
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
      })}
    </div>
  );
}
