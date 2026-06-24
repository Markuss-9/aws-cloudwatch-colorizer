import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, Settings, FileJson } from 'lucide-react';

const items = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Config', icon: FileJson, path: '/config' },
];

const pathToIndex: Record<string, number> = {};
items.forEach((item, index) => {
  pathToIndex[item.path] = index;
});

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(() => pathToIndex[location.pathname] ?? 0);

  useEffect(() => {
    setValue(pathToIndex[location.pathname] ?? 0);
  }, [location.pathname]);

  return (
    <div className="w-4/5 mx-auto absolute bottom-[5px] left-0 right-0">
      <nav className="flex justify-around bg-app-surface border border-app-border rounded-lg p-1">
        {items.map((item, index) => (
          <button
            key={item.label}
            onClick={() => {
              setValue(index);
              navigate(item.path);
            }}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md border-none cursor-pointer font-mono text-[10px] transition-colors ${
              value === index
                ? 'text-app-accent'
                : 'text-app-muted hover:text-app-text'
            }`}
          >
            <item.icon size={16} />
            {item.label}
            {value === index && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-app-accent" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
