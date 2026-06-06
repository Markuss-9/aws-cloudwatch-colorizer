import { ExternalLink, Power, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import packageJson from '@/../package.json';
import { Dispatch } from 'react';
import type { Settings, PerformanceMode } from '@/types';
import ColorizeButton from '@/components/ColorizeButton';

const Home = ({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: Dispatch<Settings>;
}) => {
  const handleToggle = () =>
    setSettings({ ...settings, ...{ master: !settings.master } });

  const handleChange = (newPerf: PerformanceMode) => {
    if (newPerf) setSettings({ ...settings, ...{ performance: newPerf } });
  };

  const handleAutoMode = () =>
    setSettings({
      ...settings,
      ...{
        performance: settings.performance !== 'manual' ? 'manual' : 'dom',
      },
    });

  return (
    <>
      <span className="absolute right-0 p-1 text-xs leading-none w-fit h-fit">
        {packageJson.version}
      </span>

      <h3 className="text-2xl font-cursive m-1">Home</h3>

      <Button
        color={settings.master ? 'on' : 'off'}
        onClick={handleToggle}
        className="rounded-full w-[130px] h-[130px]"
      >
        {settings.master ? <Zap size={60} /> : <Power size={60} />}
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleAutoMode}
            className={`absolute top-[120px] right-[15px] px-2 py-1 text-sm rounded border-none cursor-pointer ${
              settings.performance !== 'manual'
                ? 'bg-[#1976d2] text-white'
                : 'bg-[#444] text-gray-300'
            }`}
          >
            AUTO
          </button>
        </TooltipTrigger>
        <TooltipContent>Auto mode</TooltipContent>
      </Tooltip>

      <div className="m-3 h-[50px] flex justify-center items-center">
        {settings.performance === 'manual' ? (
          <ColorizeButton master={settings.master} />
        ) : (
          <ToggleGroup
            type="single"
            value={settings.performance}
            onValueChange={(val: PerformanceMode) => {
              if (val) handleChange(val);
            }}
            aria-label="performance"
          >
            <ToggleGroupItem value="timer">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>TIMER</span>
                </TooltipTrigger>
                <TooltipContent>Every 3 seconds it updates</TooltipContent>
              </Tooltip>
            </ToggleGroupItem>
            <ToggleGroupItem value="dom">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>DOM</span>
                </TooltipTrigger>
                <TooltipContent>
                  It updates when the DOM is changed
                </TooltipContent>
              </Tooltip>
            </ToggleGroupItem>
            <ToggleGroupItem value="net" disabled>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>NET</span>
                </TooltipTrigger>
                <TooltipContent>
                  [WIP] It updates when a network request has finished, maybe it
                  will never come out
                </TooltipContent>
              </Tooltip>
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>

      <div className="inline-flex items-center">
        <span className="w-[165px] text-sm inline-flex items-center">
          Give a star at the repo
        </span>
        <ExternalLink
          size={30}
          className="cursor-pointer"
          onClick={() => {
            window.open(
              'https://github.com/Markuss-9/aws-cloudwatch-colorizer',
            );
          }}
        />
      </div>
    </>
  );
};

export default Home;
