import { useMemo } from 'react';
import { EyeOff } from 'lucide-react';
import {
  DEFAULT_DARK_SHADE_COLOR,
  DEFAULT_LIGHT_SHADE_COLOR,
} from '@/scripts/injectStyleShadedEvenRows';

const DARK_PAGE_BG = 'rgb(19, 25, 32)';
const DARK_SHADE = DEFAULT_DARK_SHADE_COLOR;
const LIGHT_PAGE_BG = 'rgb(252, 252, 253)';
const LIGHT_SHADE = DEFAULT_LIGHT_SHADE_COLOR;

function parseRgba(c: string) {
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return { r: 255, g: 255, b: 255, a: 1 };
  return {
    r: Number(m[1]),
    g: Number(m[2]),
    b: Number(m[3]),
    a: m[4] !== undefined ? Number(m[4]) : 1,
  };
}

function blend(over: string, under: string): string {
  const o = parseRgba(over);
  const u = parseRgba(under);
  const r = Math.round(o.r * o.a + u.r * (1 - o.a));
  const g = Math.round(o.g * o.a + u.g * (1 - o.a));
  const b = Math.round(o.b * o.a + u.b * (1 - o.a));
  return `rgb(${r}, ${g}, ${b})`;
}

const BackgroundPreview = ({
  patterns,
  backgroundColor,
}: {
  patterns: string[];
  backgroundColor: string;
}) => {
  const darkOddBg = useMemo(
    () => blend(backgroundColor, DARK_PAGE_BG),
    [backgroundColor],
  );
  const darkEvenBg = useMemo(
    () => blend(backgroundColor, blend(DARK_SHADE, DARK_PAGE_BG)),
    [backgroundColor],
  );
  const lightOddBg = useMemo(
    () => blend(backgroundColor, LIGHT_PAGE_BG),
    [backgroundColor],
  );
  const lightEvenBg = useMemo(
    () => blend(backgroundColor, blend(LIGHT_SHADE, LIGHT_PAGE_BG)),
    [backgroundColor],
  );

  const lorem = `[${patterns[0]}] · lorem ipsum dolor sit amet`;

  if (!patterns?.[0]) {
    return (
      <span className="inline-flex items-center gap-1 text-gray-500 bg-transparent border border-dashed border-gray-500/40 rounded px-2 py-1 text-[10px] leading-none">
        <EyeOff size={12} />
        no patterns defined
      </span>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 text-[11px] leading-none">
      <div className="flex flex-col overflow-hidden rounded text-white">
        <div
          className="flex items-center h-[24px] px-2 truncate"
          style={{ backgroundColor: darkOddBg }}
        >
          {lorem}
        </div>
        <div
          className="flex items-center h-[24px] px-2 truncate"
          style={{ backgroundColor: darkEvenBg }}
        >
          {lorem}
        </div>
      </div>
      <div className="flex flex-col overflow-hidden rounded text-black">
        <div
          className="flex items-center h-[24px] px-2 truncate"
          style={{ backgroundColor: lightOddBg }}
        >
          {lorem}
        </div>
        <div
          className="flex items-center h-[24px] px-2 truncate"
          style={{ backgroundColor: lightEvenBg }}
        >
          {lorem}
        </div>
      </div>
    </div>
  );
};

export default BackgroundPreview;
