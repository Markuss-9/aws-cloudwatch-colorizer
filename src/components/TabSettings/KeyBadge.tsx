import { useState, useRef, useEffect } from 'react';

const KeyBadge = ({
  level,
  onSave,
  autoFocus,
}: {
  level: string;
  onSave: (val: string) => void;
  autoFocus?: boolean;
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoFocused = useRef(false);

  useEffect(() => {
    if (autoFocus && !hasAutoFocused.current) {
      hasAutoFocused.current = true;
      setEditing(true);
      setEditValue(level);
    }
  }, [autoFocus, level]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    if (editValue.trim()) onSave(editValue);
    setEditing(false);
    setEditValue('');
  };

  const cancel = () => {
    setEditing(false);
    setEditValue('');
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') cancel();
        }}
        className="w-20 bg-border-default text-[11px] border border-border-form rounded px-1.5 py-0.5 font-mono text-gray-200 outline-none focus:border-blue-400"
      />
    );
  }

  return (
    <span
      className="text-[11px] font-mono text-gray-300 bg-white/[8%] rounded px-1.5 py-0.5 cursor-pointer hover:bg-white/[12%] hover:text-white"
      onClick={() => {
        setEditValue(level);
        setEditing(true);
      }}
      title="Click to edit unique key"
    >
      #{level}
    </span>
  );
};

export default KeyBadge;
