import { Dispatch } from 'react';
import { ExternalLink, Power, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import packageJson from '@/../package.json';
import type { Settings, PerformanceMode } from '@/types';
import ColorizeButton from '@/components/ColorizeButton';

const Home = ({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: Dispatch<Settings>;
}) => {
  const master = settings.master;
  const perf = settings.performance;
  const isManual = perf === 'manual';

  const handleToggle = () => setSettings({ ...settings, master: !master });

  const handleChange = (newPerf: PerformanceMode) => {
    if (newPerf) setSettings({ ...settings, performance: newPerf });
  };

  return (
    <div className="flex flex-col items-center gap-3 py-3 px-3 bg-surface min-h-full">
      {/* Header */}
      <div className="flex justify-between w-full items-center">
        <h3 className="text-lg font-cursive">Home</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500">
            v{packageJson.version}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  window.open(
                    'https://github.com/Markuss-9/aws-cloudwatch-colorizer',
                  )
                }
                className="text-gray-500 hover:text-white cursor-pointer bg-transparent border-none p-0 leading-none"
              >
                <ExternalLink size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Star on GitHub</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Master toggle */}
      <Button
        color={master ? 'on' : 'off'}
        onClick={handleToggle}
        className="rounded-full w-[80px] h-[80px]"
      >
        {master ? <Zap size={36} /> : <Power size={36} />}
      </Button>

      {/* Status */}
      <span className="text-xs text-gray-400">
        Colorizer is{' '}
        <span
          className={
            master ? 'text-green-400 font-bold' : 'text-red-400 font-bold'
          }
        >
          {master ? 'ON' : 'OFF'}
        </span>
      </span>

      {/* Performance mode selector */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">
          Mode
        </span>
        <ToggleGroup
          type="single"
          value={perf}
          onValueChange={(val: PerformanceMode) => {
            if (val) handleChange(val);
          }}
          aria-label="performance mode"
        >
          <ToggleGroupItem value="manual">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>MANUAL</span>
              </TooltipTrigger>
              <TooltipContent>Colorize on demand</TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <ToggleGroupItem value="timer">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>TIMER</span>
              </TooltipTrigger>
              <TooltipContent>Updates every 3 seconds</TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <ToggleGroupItem value="dom">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>DOM</span>
              </TooltipTrigger>
              <TooltipContent>Updates on DOM changes</TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Manual colorize button */}
      {isManual && <ColorizeButton master={master} />}
    </div>
  );
};

export default Home;
