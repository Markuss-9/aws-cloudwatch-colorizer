import { useState, useCallback } from 'react';
import { RgbaStringColorPicker } from 'react-colorful';
import chroma from 'chroma-js';

function toRgba(c: chroma.Color): string {
  const [r, g, b, a] = c.rgba();
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

type ColorFormat = 'rgba' | 'hex' | 'hsl';

interface ColorPickerProps {
  currentColor: string;
  handleColorChange: (color: string) => void;
}

const ColorPicker = ({ currentColor, handleColorChange }: ColorPickerProps) => {
  const [format, setFormat] = useState<ColorFormat>('rgba');

  const cycleFormat = () => {
    setFormat((f) => (f === 'rgba' ? 'hex' : f === 'hex' ? 'hsl' : 'rgba'));
  };

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

  const handleInputChange = (value: string) => {
    try {
      let c: chroma.Color;
      switch (format) {
        case 'rgba': {
          const parts = value.split(',').map((s) => s.trim());
          if (parts.length === 4) {
            c = chroma(
              Number(parts[0]),
              Number(parts[1]),
              Number(parts[2]),
              Number(parts[3]),
            );
          } else return;
          break;
        }
        case 'hex': {
          if (!value.startsWith('#')) value = '#' + value;
          c = chroma(value);
          break;
        }
        case 'hsl': {
          const parts = value
            .split(',')
            .map((s) => s.trim().replace(/[°%]/g, ''));
          if (parts.length === 3) {
            c = chroma(
              Number(parts[0]),
              Number(parts[1]) / 100,
              Number(parts[2]) / 100,
              'hsl',
            );
          } else return;
          break;
        }
      }
      syncFromChroma(c!);
      handleColorChange(toRgba(c!));
    } catch {
      // invalid input — don't update
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

  const formatLabel = format.toUpperCase();
  const formatHint =
    format === 'rgba'
      ? 'R, G, B, A'
      : format === 'hex'
        ? '#RRGGBB'
        : 'H, S%, L%';

  return (
    <div className="z-[1000] flex flex-col items-center">
      <RgbaStringColorPicker
        color={toRgba(chroma(currentColor))}
        onChange={onPickerChange}
        style={{
          width: '100%',
          maxWidth: 260,
          background: '#333',
          borderRadius: 8,
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      />

      <div className="mt-3 w-full max-w-[260px]">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={cycleFormat}
            className="text-xs text-gray-400 hover:text-white cursor-pointer bg-transparent border-none"
            title="Click to cycle format"
          >
            <span className="font-mono">{formatLabel}</span>
            <span className="text-gray-500 ml-1">↻</span>
          </button>
          <span className="text-[10px] text-gray-500">{formatHint}</span>
        </div>

        {format === 'rgba' && (
          <div className="flex gap-1">
            {(['r', 'g', 'b'] as const).map((f) => (
              <input
                key={f}
                type="number"
                min={0}
                max={255}
                value={rgbaInputs[f]}
                onChange={(e) => handleRgbaFieldChange(f, e.target.value)}
                className="w-12 bg-[#444] text-white text-xs text-center border border-[#666] rounded py-1 font-mono"
              />
            ))}
            <input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={rgbaInputs.a}
              onChange={(e) => handleRgbaFieldChange('a', e.target.value)}
              className="w-14 bg-[#444] text-white text-xs text-center border border-[#666] rounded py-1 font-mono"
            />
          </div>
        )}

        {format === 'hex' && (
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexFieldChange(e.target.value)}
            className="w-full bg-[#444] text-white text-xs text-center border border-[#666] rounded py-1 font-mono"
          />
        )}

        {format === 'hsl' && (
          <div className="flex gap-1">
            {(['h', 's', 'l'] as const).map((f) => (
              <input
                key={f}
                type="number"
                min={0}
                max={f === 'h' ? 360 : 100}
                value={hslInputs[f]}
                onChange={(e) => handleHslFieldChange(f, e.target.value)}
                className="w-16 bg-[#444] text-white text-xs text-center border border-[#666] rounded py-1 font-mono"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
