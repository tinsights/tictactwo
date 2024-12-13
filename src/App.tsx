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
	[id: string]: CursorType;
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
		let { pageX, pageY } = ev;
		console.log(ev);
		pageX = pageX / window.innerWidth;
		pageY = pageY / window.innerHeight;
		// console.log({ pageX, pageY })
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
				(socket.id !== id) && <Cursor key={id} pageX={cursor.pageX * window.innerWidth} pageY={cursor.pageY * window.innerHeight} color={"blue"} />
			))}
		</>
	);
}
