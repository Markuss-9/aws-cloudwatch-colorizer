import { useMemo } from 'react';
import { EyeOff } from 'lucide-react';
import chroma from 'chroma-js';
import {
  DEFAULT_DARK_SHADE_COLOR,
  DEFAULT_LIGHT_SHADE_COLOR,
} from '@/scripts/shadedRows';

const DARK_PAGE_BG = 'rgb(23, 16, 23)';
const DARK_SHADE = DEFAULT_DARK_SHADE_COLOR;
const LIGHT_PAGE_BG = 'rgb(252, 252, 253)';
const LIGHT_SHADE = DEFAULT_LIGHT_SHADE_COLOR;

function blend(over: string, under: string): string {
  const o = chroma(over);
  const u = chroma(under);
  const [or, og, ob, oa] = o.rgba();
  const [ur, ug, ub] = u.rgba();
  const r = Math.round(or * oa + ur * (1 - oa));
  const g = Math.round(og * oa + ug * (1 - oa));
  const b = Math.round(ob * oa + ub * (1 - oa));
  return chroma(r, g, b).css();
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
    () => blend(DARK_SHADE, blend(backgroundColor, DARK_PAGE_BG)),
    [backgroundColor],
  );
  const lightOddBg = useMemo(
    () => blend(backgroundColor, LIGHT_PAGE_BG),
    [backgroundColor],
  );
  const lightEvenBg = useMemo(
    () => blend(LIGHT_SHADE, blend(backgroundColor, LIGHT_PAGE_BG)),
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

  const classesRow = 'flex items-center h-[24px] px-2 truncate';

  return (
    <div className="grid grid-cols-2 gap-3 text-[11px] leading-none">
      <div className="flex flex-col gap-1 overflow-hidden rounded">
        <span className="text-[10px] text-gray-400 text-center">Dark mode</span>
        <div className="flex flex-col overflow-hidden rounded text-white">
          <div className={classesRow} style={{ backgroundColor: darkOddBg }}>
            {lorem}
          </div>
          <div className={classesRow} style={{ backgroundColor: darkEvenBg }}>
            {lorem}
          </div>
          <div className={classesRow} style={{ backgroundColor: darkOddBg }}>
            {lorem}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 overflow-hidden rounded">
        <span className="text-[10px] text-gray-400 text-center">
          Light mode
        </span>
        <div className="flex flex-col overflow-hidden rounded text-black">
          <div className={classesRow} style={{ backgroundColor: lightOddBg }}>
            {lorem}
          </div>
          <div className={classesRow} style={{ backgroundColor: lightEvenBg }}>
            {lorem}
          </div>
          <div className={classesRow} style={{ backgroundColor: lightOddBg }}>
            {lorem}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundPreview;
