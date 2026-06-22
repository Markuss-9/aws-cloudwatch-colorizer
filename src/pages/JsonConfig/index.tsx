import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { Settings } from '@/types';
import defaultSettings from '@/defaultSettings';

const JsonConfig = ({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}) => {
  const navigate = useNavigate();
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(settings, null, 2),
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(jsonText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [jsonText]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonText(text);
    } catch {
      // clipboard read failed
    }
  }, []);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setSettings(parsed as Settings);
      navigate('/settings');
    } catch {
      // silently ignore invalid JSON
    }
  };

  const handleReset = () => {
    setJsonText(JSON.stringify(defaultSettings, null, 2));
  };

  const handleReload = () => {
    setJsonText(JSON.stringify(settings, null, 2));
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      <h3 className="text-2xl font-cursive text-center">JSON Config</h3>
      <p className="text-xs text-gray-400 text-center">
        Edit, copy, or import the full configuration
      </p>
      <textarea
        value={jsonText}
        onChange={(e) => {
          setJsonText(e.target.value);
        }}
        className="w-full h-[220px] bg-[#1e1e1e] text-green-400 text-xs font-mono p-2 border border-[#444] rounded resize-none"
        spellCheck={false}
      />
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 text-xs"
        >
          Reset to Defaults
        </Button>
        <Button
          variant="outline"
          onClick={handleReload}
          className="flex-1 text-xs"
        >
          Reload Current
        </Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleCopy} className="flex-1">
          {copied ? 'Copied!' : 'Copy JSON'}
        </Button>
        <Button onClick={handlePaste} className="flex-1">
          Paste
        </Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">
          Save &amp; Apply
        </Button>
      </div>
      <Button
        variant="text"
        onClick={() => navigate('/settings')}
        className="text-xs"
      >
        ← Back to Settings
      </Button>
    </div>
  );
};

export default JsonConfig;
