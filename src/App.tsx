import { useEffect, useState } from "react";
import "./App.css";

import SimpleBottomNavigation from "./components/SimpleBottomNavigation";
import { Route, Routes } from "react-router-dom";
import Settings from "./pages/Settings";
import Tutorial from "./pages/Tutorial";

import Scrollbars from "rc-scrollbars";
import Home from "./pages/Home";

import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";

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

const defaultSettings = {
	master: true,
	performance: "manual",
	advancedSettings: {
		Accordion_1: {
			title: "Log groups",
			words: [
				{ word: "error", color: "red", emoji: "❌" },
				{ word: "warn", color: "yellow", emoji: "⚠️" },
				{ word: "info", color: "green", emoji: "ℹ️" },
				{ word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_1",
			switch: true,
			isAvailable: true,
		},
		Accordion_2: {
			title: "Log Tails",
			words: [
				{ word: "error", color: "red", emoji: "❌" },
				{ word: "warn", color: "yellow", emoji: "⚠️" },
				{ word: "info", color: "green", emoji: "ℹ️" },
				{ word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_2",
			switch: false,
			isAvailable: false,
		},
		Accordion_3: {
			title: "Log Insights",
			words: [
				{ word: "error", color: "red", emoji: "❌" },
				{ word: "warn", color: "yellow", emoji: "⚠️" },
				{ word: "info", color: "green", emoji: "ℹ️" },
				{ word: "debug", color: "blue", emoji: "🐛" },
			],
			id: "Accordion_3",
			switch: true,
			isAvailable: true,
		},
	},
};

function App() {
	const [settings, setSettings] = useState<any>(defaultSettings);

	if (process.env.NODE_ENV === "production") {
		console.log(`clear watch`);

		useEffect(() => {
			chrome.storage.local.get(["settings"], (result) => {
				console.log("🚀 ~ chrome.storage.local.get ~ result:", result);
				console.log(
					"🚀 ~ chrome.storage.local.get ~ result.settings:",
					result.settings
				);

				if (!result.settings) {
					chrome.storage.local
						.set({ settings: defaultSettings })
						.then(() => {
							console.log(
								"1 - Setting default value",
								defaultSettings
							);
						});
					setSettings(defaultSettings);
				} else {
					console.log(
						"1 - Setting the state with the current chrome local storage"
					);
					setSettings(result.settings);
				}
				console.log(`1 - finished settings`);
			});
		}, []);
	}

	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<Scrollbars
					autoHide
					autoHideDuration={500}
					renderThumbVertical={({ style }) => (
						<div
							style={{
								...style,
								...{ backgroundColor: "#9f9f9f", margin: 0 },
							}}
						></div>
					)}
					renderView={({ style }) => (
						<div
							style={{
								...style,
								...{
									position: "absolute",
									inset: 0,
									overflow: "scroll",
									margin: 0,
								},
							}}
						></div>
					)}
				>
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
						<Route path="/settings" element={<Settings />} />
						<Route path="/tutorial" element={<Tutorial />} />
					</Routes>
				</Scrollbars>
				<SimpleBottomNavigation />
			</div>
		</ThemeProvider>
	);
}

export default App;
