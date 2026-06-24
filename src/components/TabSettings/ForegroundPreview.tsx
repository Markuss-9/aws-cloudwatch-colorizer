const ForegroundPreview = ({
  emoji,
  label,
  color,
}: {
  emoji: string;
  label: string;
  color: string;
}) => (
  <div className="flex items-center h-[24px] rounded bg-white/[3%] text-[11px] leading-none truncate px-2">
    <span style={{ color }}>
      {emoji} {label}
    </span>
    <span className="text-gray-400"> · lorem ipsum dolor sit amet</span>
  </div>
);

export default ForegroundPreview;
