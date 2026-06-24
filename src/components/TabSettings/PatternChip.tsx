import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from 'lucide-react';

const PatternChip = ({
  id,
  text,
  onRemove,
}: {
  id: string;
  text: string;
  onRemove: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      className="inline-flex items-center gap-1 bg-surface-hover text-[11px] pl-1 pr-1 rounded h-[18px]"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing bg-transparent border-none p-0 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
      >
        <GripVertical size={10} />
      </button>
      <span className="leading-none">{text}</span>
      <button
        onClick={onRemove}
        className="text-gray-300 hover:text-red-300 cursor-pointer bg-transparent border-none p-0 flex items-center justify-center transition-colors"
      >
        <X size={10} />
      </button>
    </span>
  );
};

export default PatternChip;
