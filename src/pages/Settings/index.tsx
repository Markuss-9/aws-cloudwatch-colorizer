import ControlledAccordions from '@/components/ControlledAccordions';
import { Dispatch } from 'react';
import type { Settings } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const Settings = ({
  settings,
  setSettings,
  resetSettings,
}: {
  settings: Settings;
  setSettings: Dispatch<Settings>;
  resetSettings: VoidFunction;
}) => {
  return (
    <>
      <h3 className="text-2xl font-cursive m-1">Settings</h3>
      <br />
      <ControlledAccordions settings={settings} setSettings={setSettings} />
      <br />
      <br />
      <br />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" color="warning" onClick={resetSettings}>
            RESET
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset all settings to default</TooltipContent>
      </Tooltip>
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default Settings;
