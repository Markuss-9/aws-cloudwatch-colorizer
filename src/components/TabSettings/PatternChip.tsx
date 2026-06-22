import { X } from 'lucide-react';

const PatternChip = ({
  text,
  onRemove,
}: {
  text: string;
  onRemove: () => void;
}) => (
  <span className="inline-flex items-center gap-1 bg-[#4e4e4e] text-[11px] pl-2 pr-1 rounded h-[18px]">
    <span className="leading-none">{text}</span>
    <button
      onClick={onRemove}
      className="text-gray-400 hover:text-red-300 cursor-pointer bg-transparent border-none p-0 flex items-center justify-center transition-colors"
    >
      <X size={10} />
    </button>
  </span>
);

export default PatternChip;
