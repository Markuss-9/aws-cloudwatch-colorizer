import { Button, Tooltip } from "@mui/material";
import "./index.css";

interface master {
	master: boolean;
}

const ColorizeButton = ({ master }: master) => {
	const manualColorize = () => {
		if (process.env.NODE_ENV === "production")
			chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
				tabs.forEach(async (tab: any) => {
					try {
						chrome.tabs.sendMessage(tab.id, {
							type: "manualColorize",
							payload: master,
						});
					} catch (error) {
						console.error(
							"Error communicating with content script:",
							error,
						);
					}
					console.log("🚀 ~ tabs.forEach ~ tab:", tab);
				});
			});
	};
	return (
		<Button
			onClick={manualColorize}
			variant="text"
			color="rainbowButton"
			disabled={!master}
			// sx={{
			// 	background:
			// 		"linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,214,0,1) 20%, rgba(150,255,0,1) 50%, rgba(25,0,255,1) 80%, rgba(255,0,121,1) 100%)",
			// 	WebkitTextFillColor: "transparent",
			// 	WebkitBackgroundClip: "text",
			// 	borderImage:
			// 		"linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,214,0,1) 20%, rgba(150,255,0,1) 50%, rgba(25,0,255,1) 80%, rgba(255,0,121,1) 100%) 1",
			// }}
			sx={{
				border: 1,
				borderImage: "var(--gradient) 1",
				"&:hover": {
					animation: "gradient-animation 1s ease",
					animationFillMode: "both",
				},
				"&:disabled": {
					opacity: 0.4,
				},
			}}
			className="rainbow"
		>
			<Tooltip title="Colorize all the elements one time">
				<span>COLORIZE</span>
			</Tooltip>
		</Button>
	);
};

export default ColorizeButton;
