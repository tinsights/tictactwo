import React from "react";
import { Toggle } from "./components/ui/toggle";
import Grid from "./Grid"
import { useState, useEffect } from "react";
import "./App.css";
import { socket } from ".";


const Cursor = ({ pageX, pageY, color }: CursorType) => {
	return (
		<div
			className="cursor"
			style={{
				height: "20px",
				width: "20px",
				left: `${pageX}px`,
				top: `${pageY}px`,
				backgroundColor: color,
				position: 'fixed',
				pointerEvents: 'none',
				borderRadius: '100%'
			}}
		/>
	);
};


interface CursorType {
	pageX: number;
	pageY: number;
	color: string;
}

interface CursorMap {
	[id: string]: CursorType; // Map user IDs to their cursor positions
}

export default function App() {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [cursors, setCursors] = useState<CursorMap>({});

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
		socket.on('message', (connObj: CursorMap) => {
			// console.log("received broadcast:", connObj)
			setCursors(connObj);
			// console.log(cursors);
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
			{Object.entries(cursors).map(([id, cursor]: [string, CursorType]) => (
				<Cursor key={id} pageX={cursor.pageX} pageY={cursor.pageY} color={"blue"} />
			))}
		</>
	);
}
