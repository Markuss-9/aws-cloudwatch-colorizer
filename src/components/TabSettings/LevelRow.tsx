import { useState, useRef, useEffect } from 'react';
import { Trash2, GripVertical } from 'lucide-react';

import {
  useSortable,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

import ColorPicker from '../ColorPicker';
import Swatch from './Swatch';
import KeyBadge from './KeyBadge';
import ForegroundPreview from './ForegroundPreview';
import BackgroundPreview from './BackgroundPreview';
import PatternChip from './PatternChip';
import PatternAdder from './PatternAdder';
import type { LevelPreset, SettingsPages } from '@/types';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type OpenPicker = {
  page: SettingsPages;
  levelIdx: number;
  field: 'color' | 'backgroundColor';
} | null;

const LevelRow = ({
  level,
  idx,
  activeTab,
  openPicker,
  onToggleEnabled,
  onDelete,
  onRemovePattern,
  onAddPattern,
  onOpenPicker,
  onUpdateField,
  onUpdateKey,
  onUpdateColor,
  wantBackground,
  autoFocusKey,
  onAutoFocusDone,
  onMovePattern,
}: {
  level: LevelPreset;
  idx: number;
  activeTab: SettingsPages;
  openPicker: OpenPicker;
  onToggleEnabled: (idx: number) => void;
  onDelete: (idx: number) => void;
  onRemovePattern: (levelIdx: number, patternIdx: number) => void;
  onAddPattern: (levelIdx: number, pattern: string) => void;
  onOpenPicker: (picker: OpenPicker) => void;
  onUpdateField: (
    levelIdx: number,
    field: 'emoji' | 'label',
    value: string,
  ) => void;
  onUpdateKey: (levelIdx: number, value: string) => void;
  onUpdateColor: (
    levelIdx: number,
    field: 'color' | 'backgroundColor',
    value: string,
  ) => void;
  wantBackground: boolean;
  autoFocusKey?: boolean;
  onAutoFocusDone?: () => void;
  onMovePattern: (fromIdx: number, toIdx: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(level.code) });

  const patternSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const isOpen = openPicker?.page === activeTab && openPicker.levelIdx === idx;
  const [editingField, setEditingField] = useState<'emoji' | 'label' | null>(
    null,
  );
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  const startEdit = (field: 'emoji' | 'label') => {
    setEditingField(field);
    setEditValue(field === 'emoji' ? level.emoji : level.label);
  };

  const commitEdit = () => {
    if (!editingField) return;
    const val = editValue.trim();
    if (val) onUpdateField(idx, editingField, val);
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handlePatternDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = Number(String(active.id).replace('p-', ''));
    const newIdx = Number(String(over.id).replace('p-', ''));
    onMovePattern(oldIdx, newIdx);
  };

  const handleSaveLevelKey = (val: string) => {
    onUpdateKey(idx, val);
    onAutoFocusDone?.();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-surface-card border border-white/[5%] rounded p-3 relative overflow-hidden"
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing bg-transparent border-none p-0 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <GripVertical size={14} />
        </button>

        <Swatch
          color={wantBackground ? level.backgroundColor : level.color}
          label={wantBackground ? 'Background' : 'Foreground'}
          onClick={() =>
            onOpenPicker(
              isOpen &&
                openPicker?.field ===
                  (wantBackground ? 'backgroundColor' : 'color')
                ? null
                : {
                    page: activeTab,
                    levelIdx: idx,
                    field: wantBackground ? 'backgroundColor' : 'color',
                  },
            )
          }
        />

        <span
          key={wantBackground ? 'no-label' : 'label'}
          className="inline-flex items-center gap-1 flex-1 min-w-0 animate-in fade-in zoom-in-95 slide-in-from-left-1 duration-200 ease-out"
        >
          {!wantBackground && editingField === 'emoji' ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              className="w-7 bg-transparent text-xs text-center border-b border-app-border outline-none focus:border-app-brand"
            />
          ) : !wantBackground ? (
            <span
              className="text-xs leading-none cursor-pointer hover:opacity-70"
              onClick={() => startEdit('emoji')}
              title="Click to edit"
            >
              {level.emoji}
            </span>
          ) : null}
          {!wantBackground && editingField === 'label' ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              className="flex-1 min-w-0 bg-transparent text-xs border-b border-app-border outline-none focus:border-app-brand"
              style={{ color: level.color }}
            />
          ) : !wantBackground ? (
            <span
              className="text-xs leading-none truncate cursor-pointer hover:opacity-70"
              style={{ color: level.color }}
              onClick={() => startEdit('label')}
              title="Click to edit"
            >
              {level.label}
            </span>
          ) : null}
        </span>

        <KeyBadge
          level={level.level}
          onSave={handleSaveLevelKey}
          autoFocus={autoFocusKey}
        />

        <Switch
          checked={level.enabled}
          onCheckedChange={() => onToggleEnabled(idx)}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onDelete(idx)}
              className="text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
            >
              <Trash2 size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Delete level</TooltipContent>
        </Tooltip>
      </div>

      <div
        key={wantBackground ? 'bg-preview' : 'fg-preview'}
        className="my-3 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-250 ease-out"
      >
        {wantBackground ? (
          <BackgroundPreview
            patterns={level.patterns}
            backgroundColor={level.backgroundColor}
          />
        ) : (
          <ForegroundPreview
            emoji={level.emoji}
            label={level.label}
            color={level.color}
          />
        )}
      </div>

      {isOpen && (
        <div className="mt-3 flex justify-center">
          <ColorPicker
            currentColor={level[openPicker!.field]}
            onClose={() => onOpenPicker(null)}
            handleColorChange={(color) => {
              onUpdateColor(idx, openPicker!.field, color);
            }}
          />
        </div>
      )}

      <DndContext
        sensors={patternSensors}
        collisionDetection={closestCenter}
        onDragEnd={handlePatternDragEnd}
      >
        <SortableContext
          items={level.patterns.map((_, i) => `p-${i}`)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-2 mt-4">
            {level.patterns.map((p, pi) => (
              <PatternChip
                key={`p-${pi}`}
                id={`p-${pi}`}
                text={p}
                onRemove={() => onRemovePattern(idx, pi)}
              />
            ))}
            <PatternAdder onAdd={(pattern) => onAddPattern(idx, pattern)} />
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default LevelRow;
