import { useEffect, useState } from "react";
import "./App.css";

import SimpleBottomNavigation from "./components/SimpleBottomNavigation";
import { Route, Routes } from "react-router-dom";
import Settings from "./pages/Settings";
import Tutorial from "./pages/Tutorial";

import Home from "./pages/Home";

import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import manifest from "./scripts/manifest.json";

import defaultSettings from "./defaultSettings";
import settingsType from "./types/settingsType";

declare module "@mui/material/styles" {
	interface Palette {
		off: Palette["primary"];
		on: Palette["primary"];
		rainbowButton: Palette["primary"];
	}

	interface PaletteOptions {
		off?: PaletteOptions["primary"];
		on?: PaletteOptions["primary"];
		rainbowButton?: PaletteOptions["primary"];
	}
}

declare module "@mui/material/Button" {
	interface ButtonPropsColorOverrides {
		off: true;
		on: true;
		rainbowButton: true;
	}
}

const theme = createTheme({
	palette: {
		off: {
			main: "#530606",
			light: "#5c0707",
			dark: "#430505",
			contrastText: "#000000",
		},
		on: { main: "#1b5e20", light: "#1c6422", dark: "#164e1a" },
		rainbowButton: {
			main: "#ffffff00",
			light: "#dbdbdb69",
			dark: "#a5a5a57a",
			contrastText: "#000000",
		},
	},
	typography: {
		fontFamily: ["cursive"].join(","),
	},
});

function App() {
	const [settings, setSettings] = useState<settingsType | undefined>();

	if (process.env.NODE_ENV === "production") {
		const getSettings = () => {
			return new Promise((resolve, reject) => {
				chrome.storage.local.get(["settings"], (result) => {
					if (chrome.runtime.lastError) {
						reject(new Error(String(chrome.runtime.lastError)));
					} else {
						resolve(result.settings);
					}
				});
			});
		};

		useEffect(() => {
			chrome.storage.local.get(["settings"], (result) => {
				if (!result.settings) setSettings(defaultSettings);
				else setSettings(result.settings);
			});
		}, []);

		const saveAndSendToContent = async () => {
			if (settings !== (await getSettings())) {
				chrome.storage.local.set({ settings: settings });

				// {active: true}
				chrome.tabs.query(
					{
						status: "complete",
						url: manifest.content_scripts[0].matches,
					},
					(tabs) => {
						tabs.forEach(async (tab: any) => {
							try {
								chrome.tabs.sendMessage(tab.id, {
									type: "changeSettings",
								});
								console.log(
									"changing settings on tab: ",
									tab.id,
								);
							} catch (error) {
								console.error(
									"Error communicating with content script:",
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
		if (process.env.NODE_ENV === "production") chrome.storage.local.clear(); // to be certain to clear all
		setSettings(defaultSettings);
	};

	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<SimpleBar style={{ maxHeight: 400 }}>
					<Routes>
						<Route
							path="/*"
							element={
								<Home
									settings={settings || defaultSettings}
									setSettings={setSettings}
								/>
							}
						/>
						<Route
							path="/settings"
							element={
								<Settings
									settings={settings || defaultSettings}
									setSettings={setSettings}
									resetSettings={resetSettings}
								/>
							}
						/>
						<Route path="/tutorial" element={<Tutorial />} />
					</Routes>
				</SimpleBar>
				<SimpleBottomNavigation />
			</div>
		</ThemeProvider>
	);
}

export default App;
