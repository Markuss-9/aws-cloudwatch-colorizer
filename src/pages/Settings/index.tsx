import TabSettings from '@/components/TabSettings';
import { Dispatch } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { Settings } from '@/types';

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
    <div className="flex flex-col gap-3 p-3">
      <h3 className="text-2xl font-cursive">Settings</h3>
      <TabSettings settings={settings} setSettings={setSettings} />
      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" color="warning" onClick={resetSettings}>
              Reset Defaults
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset all settings to default</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Settings;
