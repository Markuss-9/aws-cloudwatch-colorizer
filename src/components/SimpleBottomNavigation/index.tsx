import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, Lightbulb, Settings, FileJson } from 'lucide-react';

export default function SimpleBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Config', icon: FileJson, path: '/config' },
    { label: 'Tutorial', icon: Lightbulb, path: '/tutorial' },
  ];

  const pathToIndex: Record<string, number> = {};
  items.forEach((item, index) => {
    pathToIndex[item.path] = index;
  });

  const [value, setValue] = useState(() => pathToIndex[location.pathname] ?? 0);

  useEffect(() => {
    setValue(pathToIndex[location.pathname] ?? 0);
  }, [location.pathname]);

  return (
    <div className="w-4/5 mx-auto absolute bottom-[5px] left-0 right-0">
      <nav className="flex justify-around bg-[#9b9b9b] border border-black rounded-lg p-1">
        {items.map((item, index) => (
          <button
            key={item.label}
            onClick={() => {
              setValue(index);
              navigate(item.path);
            }}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded border-none cursor-pointer font-bold transition-colors ${
              value === index
                ? 'bg-[#1976d2] text-white'
                : 'bg-transparent text-black hover:bg-[#888]'
            }`}
          >
            <item.icon size={18} />
            <span className="text-[9px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
