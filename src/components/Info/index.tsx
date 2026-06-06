import { Info } from 'lucide-react';

const InfoTooltip = ({ msg }: { msg: string }) => (
  <span className="flex items-center justify-center gap-1">
    <Info size={16} />
    <span>{msg}</span>
  </span>
);

export default InfoTooltip;
