import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Swatch = ({
  color,
  label,
  onClick,
}: {
  color: string;
  label: string;
  onClick: () => void;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        className="w-5 h-5 rounded-full border border-black cursor-pointer shrink-0 hover:ring-1 hover:ring-white/40 transition-shadow"
        style={{ backgroundColor: color }}
        onClick={onClick}
      />
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

export default Swatch;
