import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import './index.css';

interface master {
  master: boolean;
}

const ColorizeButton = ({ master }: master) => {
  const manualColorize = () => {
    if (process.env.NODE_ENV === 'production')
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        tabs.forEach(async (tab: any) => {
          try {
            chrome.tabs.sendMessage(tab.id, {
              type: 'manualColorize',
              payload: master,
            });
          } catch (error) {
            console.error('Error communicating with content script:', error);
          }
        });
      });
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={manualColorize}
          disabled={!master}
          className="rainbow border border-solid border-transparent bg-rainbow-btn text-transparent bg-clip-text hover:bg-rainbow-btn-light disabled:opacity-40 px-4 py-2 rounded cursor-pointer font-sans font-semibold tracking-wider"
        >
          COLORIZE
        </button>
      </TooltipTrigger>
      <TooltipContent>Colorize all the elements one time</TooltipContent>
    </Tooltip>
  );
};

export default ColorizeButton;
