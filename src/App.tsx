import React from "react";
import { Toggle } from "./components/ui/toggle";
import Grid from "./Grid"
import { useState } from "react";
import "./App.css";


export default function App() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const toggleDarkMode = () => {
		document.startViewTransition(() => {
			const nextMode = !isDarkMode;
			setIsDarkMode(nextMode);
			document.body.classList.toggle("dark", nextMode);
		});
	};

	return (
		<>
			<Toggle className="dark-toggle" onPressedChange={toggleDarkMode}>
				{isDarkMode ? "🌖" : "🌘"}
			</Toggle>
			<div className="game">
				<Grid />
			</div>
		</>
	);
}
