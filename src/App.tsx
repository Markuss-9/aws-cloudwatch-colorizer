import { useEffect, useState } from 'react';
import './App.css';

import SimpleBottomNavigation from './components/SimpleBottomNavigation';
import { Route, Routes } from 'react-router-dom';
import Settings from './pages/Settings';
import Home from './pages/Home';
import JsonConfig from './pages/JsonConfig';

import { TooltipProvider } from '@/components/ui/tooltip';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import manifest from './scripts/manifest.json';

import type { Settings as AppSettings } from './types';
import defaultSettings from './defaultSettings';

function App() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  if (process.env.NODE_ENV === 'production') {
    const getSettings = () => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['settings'], (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(String(chrome.runtime.lastError)));
          } else {
            resolve(result.settings);
          }
        });
      });
    };

    useEffect(() => {
      chrome.storage.local.get(['settings'], (result) => {
        if (result.settings) setSettings(result.settings);
      });
    }, []);

    const saveAndSendToContent = async () => {
      if (settings !== (await getSettings())) {
        chrome.storage.local.set({ settings: settings });

        // {active: true}
        chrome.tabs.query(
          {
            status: 'complete',
            url: manifest.content_scripts[0].matches,
          },
          (tabs) => {
            tabs.forEach(async (tab: any) => {
              try {
                chrome.tabs.sendMessage(tab.id, {
                  type: 'changeSettings',
                });
                console.log('changing settings on tab: ', tab.id);
              } catch (error) {
                console.error(
                  'Error communicating with content script:',
                  error,
                );
              }
            });
          },
        );
      }
    };

    useEffect(() => {
      saveAndSendToContent();
    }, [settings]);
  }

  const resetSettings = () => {
    if (process.env.NODE_ENV === 'production') chrome.storage.local.clear();
    setSettings(structuredClone(defaultSettings));
  };

  return (
    <TooltipProvider>
      <div className="App text-white text-center flex flex-col relative bg-app-bg">
        <SimpleBar style={{ maxHeight: 400 }}>
          <div className="pb-14">
            <Routes>
              <Route
                path="/*"
                element={<Home settings={settings} setSettings={setSettings} />}
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    settings={settings}
                    setSettings={setSettings}
                    resetSettings={resetSettings}
                  />
                }
              />
              <Route
                path="/config"
                element={
                  <JsonConfig settings={settings} setSettings={setSettings} />
                }
              />
            </Routes>
          </div>
        </SimpleBar>
        <SimpleBottomNavigation />
      </div>
    </TooltipProvider>
  );
}

export default App;
