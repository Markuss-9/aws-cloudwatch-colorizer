import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
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

  const [showAddLevel, setShowAddLevel] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelPatterns, setNewLevelPatterns] = useState('');
  const [newLevelEmoji, setNewLevelEmoji] = useState('');

  const addLevel = () => {
    if (!newLevelName.trim()) return;
    const updated = structuredClone(settings);
    const patterns = newLevelPatterns
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const currentLevels =
      updated.advancedSettings[keyAccordion]?.levels ?? [];
    const maxCode =
      currentLevels.length > 0
        ? Math.max(...currentLevels.map(l => l.code), 30)
        : 30;
    const newLevel: LevelPreset = {
      enabled: true,
      code: maxCode + 1,
      level: newLevelName.trim().toLowerCase().replace(/\s+/g, '_'),
      patterns:
        patterns.length > 0
          ? patterns
          : [newLevelName.trim().toLowerCase()],
      color: 'rgba(255, 255, 255, 1)',
      backgroundColor: 'rgba(100, 100, 100, 0.3)',
      emoji: newLevelEmoji || '📋',
      label: newLevelName.trim(),
    };
    currentLevels.push(newLevel);
    updated.advancedSettings[keyAccordion].levels = currentLevels;
    setSettings(updated);
    setShowAddLevel(false);
    setNewLevelName('');
    setNewLevelPatterns('');
    setNewLevelEmoji('');
  };

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
                  const updated = structuredClone(settings);
                  updated.advancedSettings[keyAccordion].wantBackground =
                    !updated.advancedSettings[keyAccordion].wantBackground;
                  setSettings(updated);
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
          <div className="mt-2 pt-2 border-t border-[#555] px-2">
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
                <div className="flex justify-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddLevel(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={addLevel}>
                    Add
                  </Button>
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
