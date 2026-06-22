import { useRef, useState } from 'react';
import { Check, Plus, X } from 'lucide-react';

const PatternAdder = ({ onAdd }: { onAdd: (pattern: string) => void }) => {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const ref = useRef<HTMLSpanElement>(null);

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="inline-flex items-center gap-0.5 text-blue-300 hover:text-blue-100 cursor-pointer bg-transparent border border-dashed border-blue-400/40 hover:border-blue-400/70 rounded px-1.5 text-[10px] h-[18px] leading-none transition-colors"
      >
        <Plus size={10} />
        pattern
      </button>
    );
  }

  const commit = () => {
    if (value.trim()) onAdd(value);
    setValue('');
    setAdding(false);
  };

  const cancel = () => {
    setValue('');
    setAdding(false);
  };

  return (
    <span
      ref={ref}
      className="inline-flex items-center gap-0.5 h-[18px]"
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) {
          commit();
        }
      }}
    >
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') commit(); }}
        placeholder="pattern"
        className="h-full bg-[#444] text-white text-[11px] px-1 border border-[#666] rounded outline-none focus:border-blue-400 w-16"
        autoFocus
      />
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={commit}
        className="text-green-300 hover:text-green-100 cursor-pointer bg-transparent border-none p-0 flex items-center"
      >
        <Check size={12} />
      </button>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={cancel}
        className="text-gray-400 hover:text-gray-200 cursor-pointer bg-transparent border-none p-0 flex items-center"
      >
        <X size={12} />
      </button>
    </span>
  );
};

export default PatternAdder;
