import React from "react";
import { Toggle } from "./components/ui/toggle";
import Grid from "./Grid"
import { useState, useEffect } from "react";
import "./App.css";
import { socket } from ".";


export default function App() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const toggleDarkMode = () => {
		document.startViewTransition(() => {
			const nextMode = !isDarkMode;
			setIsDarkMode(nextMode);
			document.body.classList.toggle("dark", nextMode);
		});
	};

	const handleMouseMove = (ev: React.MouseEvent) => {
		const { pageX, pageY } = ev;
		// console.log({ pageX, pageY });
		socket.emit('message', { pageX, pageY });
	}

	useEffect(() => {
		socket.on('message', (msg) => {
			console.log("received broadcast:", msg)
		})
	})

	return (
		<>
			<Toggle className="dark-toggle" onPressedChange={toggleDarkMode}>
				{isDarkMode ? "🌖" : "🌘"}
			</Toggle>
			<div className="game" onMouseMove={handleMouseMove}>
				<Grid />
			</div >
		</>
	);
}
