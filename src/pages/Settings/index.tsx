import ControlledAccordions from '@/components/ControlledAccordions';
import { Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-3">
      <h3 className="text-2xl font-cursive">Settings</h3>
      <ControlledAccordions settings={settings} setSettings={setSettings} />
      <div className="flex justify-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" color="warning" onClick={resetSettings}>
              Reset Defaults
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset all settings to default</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => navigate('/config')}>
              JSON Config
            </Button>
          </TooltipTrigger>
          <TooltipContent>View and edit raw JSON config</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Settings;
