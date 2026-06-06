import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Dispatch, useState } from 'react';
import WordRowSettingColor from '../WordRowSettingColor';
import WordRowSettingBackground from '../WordRowSettingBackground';
import type {
  Settings,
  PageSettings,
  LevelPreset,
  SettingsPages,
} from '@/types';

const CustomAccordion = ({
  expanded,
  keyAccordion,
  disabledAccordions,
  handleChange,
  section,
  i,
  handleSwitchClick,
  settings,
  setSettings,
  showColorPicker,
  setShowColorPicker,
}: {
  expanded: string | boolean;
  keyAccordion: SettingsPages;
  disabledAccordions: string[];
  handleChange: Function;
  section: PageSettings;
  i: number;
  handleSwitchClick: Function;
  settings: Settings;
  setSettings: Dispatch<Settings>;
  showColorPicker: string;
  setShowColorPicker: Dispatch<string>;
}) => {
  const [accordionEnabled, setAccordionEnabled] = useState<boolean>(
    section.switch,
  );
  const [wantBackground, setWantBackground] = useState<boolean>(
    section.wantBackground,
  );

  const isExpanded =
    expanded === keyAccordion && !disabledAccordions.includes(keyAccordion);

  return (
    <Accordion
      type="single"
      collapsible
      value={isExpanded ? keyAccordion : ''}
      onValueChange={(val: string) =>
        handleChange(keyAccordion)(null, val === keyAccordion)
      }
    >
      <AccordionItem
        value={keyAccordion}
        className={!section.isAvailable ? 'pointer-events-none opacity-60' : ''}
        key={`${keyAccordion}-Accordion-${i}`}
      >
        <AccordionTrigger key={`${keyAccordion}-AccordionSummary-${i}`}>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={accordionEnabled}
                    onCheckedChange={() => {
                      handleSwitchClick(
                        { stopPropagation: () => {} },
                        keyAccordion,
                      );
                      setAccordionEnabled(!accordionEnabled);
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Show logs for the {section.title} pages
              </TooltipContent>
            </Tooltip>
            <span className="ml-10">{section.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent key={`${keyAccordion}-AccordionDetails-${i}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>The words are replaced with the colorized label</span>
              </TooltipTrigger>
              <TooltipContent>Color</TooltipContent>
            </Tooltip>
            <div onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={wantBackground}
                onCheckedChange={() => {
                  let tempSettings = settings;
                  tempSettings.advancedSettings[keyAccordion].wantBackground =
                    !tempSettings.advancedSettings[keyAccordion].wantBackground;
                  setSettings({ ...tempSettings });
                  setShowColorPicker('');
                  setWantBackground(!wantBackground);
                }}
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>Background</span>
              </TooltipTrigger>
              <TooltipContent>The rows are colorized</TooltipContent>
            </Tooltip>
          </div>

          {section.levels.map((options: LevelPreset) => {
            return wantBackground ? (
              <WordRowSettingBackground
                settings={settings}
                setSettings={setSettings}
                key={`${keyAccordion}-bg-${options.level}`}
                options={options}
                showColorPicker={showColorPicker}
                setShowColorPicker={setShowColorPicker}
                keyAccordion={keyAccordion}
              />
            ) : (
              <WordRowSettingColor
                settings={settings}
                setSettings={setSettings}
                key={`${keyAccordion}-color-${options.level}`}
                options={options}
                showColorPicker={showColorPicker}
                setShowColorPicker={setShowColorPicker}
                keyAccordion={keyAccordion}
              />
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
