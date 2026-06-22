import { useState, useCallback, useEffect, useRef } from 'react';
import { RgbaStringColorPicker } from 'react-colorful';
import chroma from 'chroma-js';

const NumberInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.stopPropagation();
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  return (
    <input
      ref={ref}
      type="number"
      className={`appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${className ?? ''}`}
      {...props}
    />
  );
};

function toRgba(c: chroma.Color): string {
  const [r, g, b, a] = c.rgba();
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

type ColorFormat = 'rgba' | 'hex' | 'hsl';

const FORMATS: { key: ColorFormat; label: string }[] = [
  { key: 'rgba', label: 'RGBA' },
  { key: 'hex', label: 'HEX' },
  { key: 'hsl', label: 'HSL' },
];

interface ColorPickerProps {
  currentColor: string;
  handleColorChange: (color: string) => void;
  onClose?: () => void;
}

const ColorPicker = ({ currentColor, handleColorChange, onClose }: ColorPickerProps) => {
  const [format, setFormat] = useState<ColorFormat>('rgba');

  const [r, g, b, a] = chroma(currentColor).rgba();
  const [h, s, l] = chroma(currentColor).hsl();

  const [rgbaInputs, setRgbaInputs] = useState({
    r: String(Math.round(r)),
    g: String(Math.round(g)),
    b: String(Math.round(b)),
    a: String(Number(a.toFixed(2))),
  });
  const [hexInput, setHexInput] = useState(chroma(currentColor).hex('rgba'));
  const [hslInputs, setHslInputs] = useState({
    h: String(Math.round(h || 0)),
    s: String(Math.round(s)),
    l: String(Math.round(l)),
  });

  const syncFromChroma = useCallback((c: chroma.Color) => {
    const [nr, ng, nb, na] = c.rgba();
    const [nh, ns, nl] = c.hsl();
    setRgbaInputs({
      r: String(Math.round(nr)),
      g: String(Math.round(ng)),
      b: String(Math.round(nb)),
      a: String(Number(na.toFixed(2))),
    });
    setHexInput(c.hex('rgba'));
    setHslInputs({
      h: String(Math.round(nh || 0)),
      s: String(Math.round(ns)),
      l: String(Math.round(nl)),
    });
  }, []);

  const onPickerChange = (newColor: string) => {
    try {
      const c = chroma(newColor);
      syncFromChroma(c);
      handleColorChange(toRgba(c));
    } catch {
      // ignore invalid colors from picker
    }
  };

  const handleRgbaFieldChange = (field: 'r' | 'g' | 'b' | 'a', raw: string) => {
    const updated = { ...rgbaInputs, [field]: raw };
    setRgbaInputs(updated);
    const r = Number(updated.r);
    const g = Number(updated.g);
    const b = Number(updated.b);
    const a = Number(updated.a);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b) && !isNaN(a)) {
      try {
        const c = chroma(r, g, b, a);
        syncFromChroma(c);
        handleColorChange(toRgba(c));
      } catch {
        // ignore
      }
    }
  };

  const handleHexFieldChange = (raw: string) => {
    setHexInput(raw);
    let val = raw;
    if (!val.startsWith('#')) val = '#' + val;
    try {
      const c = chroma(val);
      syncFromChroma(c);
      handleColorChange(toRgba(c));
    } catch {
      // ignore
    }
  };

  const handleHslFieldChange = (field: 'h' | 's' | 'l', raw: string) => {
    const updated = { ...hslInputs, [field]: raw };
    setHslInputs(updated);
    const h = Number(updated.h);
    const s = Number(updated.s);
    const l = Number(updated.l);
    if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
      try {
        const c = chroma(h, s / 100, l / 100, 'hsl');
        syncFromChroma(c);
        handleColorChange(toRgba(c));
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="z-[1000] flex flex-col items-center bg-[#3a3a3a] rounded-lg p-3 w-[240px]">
      <RgbaStringColorPicker
        color={toRgba(chroma(currentColor))}
        onChange={onPickerChange}
        style={{
          width: 240,
          background: '#333',
          borderRadius: 6,
        }}
      />

      <div className="mt-3 w-full">
        <div className="flex bg-[#4e4e4e] rounded p-0.5 mb-2">
          {FORMATS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFormat(f.key)}
              className={`flex-1 text-[11px] py-1 rounded cursor-pointer border-none font-medium transition-colors ${
                format === f.key
                  ? 'bg-[#1976d2] text-white'
                  : 'bg-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {format === 'rgba' && (
          <div className="flex gap-1">
            {(['r', 'g', 'b'] as const).map((f) => (
              <div key={f} className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-gray-500 uppercase">{f}</span>
                <NumberInput
                  min={0}
                  max={255}
                  value={rgbaInputs[f]}
                  onChange={(e) => handleRgbaFieldChange(f, e.target.value)}
                  className="w-full bg-[#4e4e4e] text-white text-xs text-center border border-[#666] rounded py-1 font-mono outline-none focus:border-[#1976d2] transition-colors"
                />
              </div>
            ))}
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <span className="text-[9px] text-gray-500 uppercase">A</span>
              <NumberInput
                min={0}
                max={1}
                step={0.01}
                value={rgbaInputs.a}
                onChange={(e) => handleRgbaFieldChange('a', e.target.value)}
                className="w-full bg-[#4e4e4e] text-white text-xs text-center border border-[#666] rounded py-1 font-mono outline-none focus:border-[#1976d2] transition-colors"
              />
            </div>
          </div>
        )}

        {format === 'hex' && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] text-gray-500 uppercase">#RRGGBB</span>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexFieldChange(e.target.value)}
              className="w-full bg-[#4e4e4e] text-white text-xs text-center border border-[#666] rounded py-1 font-mono outline-none focus:border-[#1976d2] transition-colors"
            />
          </div>
        )}

        {format === 'hsl' && (
          <div className="flex gap-1">
            {(['h', 's', 'l'] as const).map((f) => (
              <div key={f} className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-gray-500 uppercase">
                  {f === 'h' ? 'H' : f === 's' ? 'S' : 'L'}
                </span>
                <NumberInput
                  min={0}
                  max={f === 'h' ? 360 : 100}
                  value={hslInputs[f]}
                  onChange={(e) => handleHslFieldChange(f, e.target.value)}
                  className="w-full bg-[#4e4e4e] text-white text-xs text-center border border-[#666] rounded py-1 font-mono outline-none focus:border-[#1976d2] transition-colors"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="mt-3 text-xs text-white bg-[#1976d2] hover:bg-[#1565c0] cursor-pointer border-none rounded py-1.5 w-full font-medium transition-colors"
        >
          Done
        </button>
      )}
    </div>
  );
};

export default ColorPicker;
