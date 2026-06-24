import type { Dispatch, SetStateAction } from 'react';
import { ExternalLink, Power, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import packageJson from '@/../package.json';
import type { Settings, PerformanceMode } from '@/types';
import ColorizeButton from '@/components/ColorizeButton';

const modes: { value: PerformanceMode; label: string; abbr: string }[] = [
  { value: 'dom', label: 'On change', abbr: 'DOM' },
  { value: 'timer', label: 'Every 3s', abbr: 'TIMER' },
  { value: 'manual', label: 'On demand', abbr: 'MANUAL' },
];

const Home = ({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}) => {
  const master = settings.master;
  const perf = settings.performance;
  const isManual = perf === 'manual';

  const handleToggle = () => setSettings({ ...settings, master: !master });

  const scrollToBottom = () => {
    const el = document.querySelector('.simplebar-content-wrapper');
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleChange = (newPerf: PerformanceMode) => {
    if (newPerf) {
      setSettings({ ...settings, performance: newPerf });
      if (newPerf === 'manual') {
        setTimeout(scrollToBottom, 0);
      }
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-5 px-4 py-4 min-h-full bg-app-bg">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] text-app-muted font-mono leading-tight">
            AWS Cloudwatch
          </p>
          <h1 className="text-sm text-app-text font-mono tracking-tight leading-tight">
            Colorizer
          </h1>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[10px] text-app-muted font-mono">
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
                className="text-app-muted hover:text-app-text cursor-pointer bg-transparent border-none p-0 leading-none"
                aria-label="View on GitHub"
              >
                <ExternalLink size={12} />
              </button>
            </TooltipTrigger>
            <TooltipContent>View on GitHub</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Status card */}
      <div className="rounded-xl p-4 flex items-center gap-4 border bg-app-surface border-app-border">
        {/* Toggle with quad-color ring */}
        <div
          className={`rounded-full p-[3px] flex-shrink-0 ${
            master ? 'animate-spin-slow' : ''
          }`}
          style={{
            background: master
              ? 'conic-gradient(from 0deg, var(--color-app-danger), var(--color-app-warning), var(--color-app-accent), var(--color-app-brand), var(--color-app-danger))'
              : 'var(--color-app-border)',
            width: 62,
            height: 62,
          }}
        >
          <Button
            onClick={handleToggle}
            className="rounded-full w-14 h-14 font-sans"
            color={master ? 'on' : 'off'}
          >
            {master ? <Zap size={24} /> : <Power size={24} />}
          </Button>
        </div>

        {/* Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-app-text font-mono">Colorizer</span>
            <span
              className={`text-xs font-bold font-mono ${
                master ? 'text-app-accent' : 'text-app-danger'
              }`}
            >
              {master ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
          <p className="text-xs mt-0.5 text-app-muted">
            {master ? 'Colorizing CloudWatch logs' : 'Paused'}
          </p>
        </div>
      </div>

      {/* Mode selector */}
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase block mb-2 text-app-muted">
          Scan mode
        </label>
        <div className="rounded-xl border border-app-border overflow-hidden divide-y divide-app-border bg-app-surface">
          {modes.map((mode) => (
            <Tooltip key={mode.value}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleChange(mode.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors cursor-pointer text-sm text-app-text
                    ${
                      perf === mode.value
                        ? 'bg-app-raised'
                        : 'hover:bg-[var(--color-app-hover)]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        perf === mode.value
                          ? 'border-app-accent'
                          : 'border-app-dim'
                      }`}
                    >
                      {perf === mode.value && (
                        <div className="w-2 h-2 rounded-full bg-app-accent" />
                      )}
                    </div>
                    <span>{mode.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-app-dim">
                    {mode.abbr}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {mode.value === 'dom' && 'Colorizes when the page DOM changes'}
                {mode.value === 'timer' &&
                  'Repeats colorization every 3 seconds'}
                {mode.value === 'manual' &&
                  'Colorize on demand with the button below'}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Rainbow button */}
      <div className={!isManual ? 'opacity-40' : ''}>
        <ColorizeButton master={master} />
      </div>
    </div>
  );
};

export default Home;
