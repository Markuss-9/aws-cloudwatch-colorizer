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

declare module "@mui/material/styles" {
	interface Palette {
		off: Palette["primary"];
		on: Palette["primary"];
	}

	interface PaletteOptions {
		off?: PaletteOptions["primary"];
		on?: PaletteOptions["primary"];
	}
}

declare module "@mui/material/Button" {
	interface ButtonPropsColorOverrides {
		off: true;
		on: true;
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
	},
	typography: {
		fontFamily: ["cursive"].join(","),
	},
});

function App() {
	const [settings, setSettings] = useState(defaultSettings);

	if (process.env.NODE_ENV === "production") {
		useEffect(() => {
			chrome.storage.local.get(["settings"], (result) => {
				if (!result.settings) setSettings(defaultSettings);
				else setSettings(result.settings);
				console.log(`1 - finished settings`);
			});
		}, []);

		useEffect(() => {
			chrome.storage.local.set({ settings: settings });
			console.log(`setting to chrome storage`);

			// {active: true}
			chrome.tabs.query(
				{
					status: "complete",
					url: manifest.content_scripts[0].matches,
				},
				function (tabs) {
					tabs.forEach(async (tab: any) => {
						try {
							chrome.tabs.sendMessage(
								tab.id,
								{ type: "yourMessageType" },
								(respond) => console.log(respond)
							);
						} catch (error) {
							console.error(
								"Error communicating with content script:",
								error
							);
						}

						console.log("🚀 ~ tabs.forEach ~ tab:", tab);
					});
				}
			);
		}, [settings]);
	}

	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<SimpleBar style={{ maxHeight: 400 }}>
					<Routes>
						<Route
							path="/*"
							element={
								<Home
									settings={settings}
									setSettings={setSettings}
								/>
							}
						/>
						<Route
							path="/settings"
							element={
								<Settings
									settings={settings}
									setSettings={setSettings}
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
