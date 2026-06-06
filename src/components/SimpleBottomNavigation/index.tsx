import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Home, Lightbulb, Settings, ChevronUp } from 'lucide-react';

export default function SimpleBottomNavigation() {
  const [value, setValue] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const items = [
    { label: 'Settings', icon: Settings, onClick: () => navigate('settings') },
    { label: 'Home', icon: Home, onClick: () => navigate('') },
    { label: 'Tutorial', icon: Lightbulb, onClick: () => navigate('tutorial') },
  ];

  return (
    <>
      <div
        onMouseLeave={() => setTimeout(() => setIsHovered(false), 1500)}
        className="w-4/5 mx-auto absolute bottom-[5px] left-0 right-0"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 1.25s ease',
        }}
      >
        <nav className="flex justify-around bg-[#9b9b9b] border border-black rounded-lg p-1">
          {items.map((item, index) => (
            <button
              key={item.label}
              onClick={() => {
                setValue(index);
                item.onClick();
              }}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded border-none cursor-pointer font-bold transition-colors ${
                value === index
                  ? 'bg-[#1976d2] text-white'
                  : 'bg-transparent text-black hover:bg-[#888]'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {!isHovered && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          className="absolute bottom-0 left-0 right-0 flex justify-center h-[35px] cursor-pointer"
          style={{
            opacity: isHovered ? 0 : 1,
            transition: 'opacity 1.25s ease',
          }}
        >
          <ChevronUp size={24} />
        </div>
      )}
    </>
  );
}
