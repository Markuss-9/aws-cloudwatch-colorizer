import TabSettings from '@/components/TabSettings';
import type { Dispatch, SetStateAction } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { Settings as SettingsTypes } from '@/types';

const Settings = ({
  settings,
  setSettings,
  resetSettings,
}: {
  settings: SettingsTypes;
  setSettings: Dispatch<SetStateAction<SettingsTypes>>;
  resetSettings: VoidFunction;
}) => {
  return (
    <div className="flex flex-col gap-3 p-3 min-h-full bg-app-bg">
      <div className="space-y-0.5">
        <h3 className="text-sm text-app-text font-mono tracking-tight">
          Settings
        </h3>
        <p className="text-[10px] text-app-muted font-mono leading-relaxed">
          Configure color schemes for each CloudWatch log view
        </p>
      </div>
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
