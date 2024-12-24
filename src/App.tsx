import React from "react";
import { ReactComponent as CursorLogo } from "./icons8-cursor.svg"
import { Toggle } from "./components/ui/toggle";
import { Button } from "./components/ui/button"
import { Menubar, MenubarItem, MenubarMenu, MenubarContent, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "./components/ui/menubar"
import Grid from "./Grid"
import { useState, useEffect, createContext, useContext } from "react";
import "./App.css";
import { socket } from ".";

const visuallyAppealingColors: string[] = [
	'#FF6F61', // Coral
	'#6B5B93', // Purple
	'#88B04B', // Olive Green
	'#F7CAC9', // Light Pink
	'#92A8D1', // Light Blue
	'#955251', // Burgundy
	'#E4B7A0', // Pale Peach
	'#F6D55C', // Bright Yellow
	'#EAB8A1', // Soft Salmon
	'#D96C6A', // Warm Red
	'#6A0572', // Deep Purple
	'#B9D3C1', // Mint Green
	'#FF9A00', // Bright Orange
	'#A3D2CA', // Soft Teal
	'#FFE156', // Lemon Yellow
];

console.log(visuallyAppealingColors);


const ThemeContext = createContext(true);

const Cursor = ({ pageX, pageY, color }: CursorType) => {
	const isDarkMode = useContext(ThemeContext);
	return (
		<CursorLogo
			className="cursor"
			style={{
				width: "1.5rem",
				height: "1.5rem",
				left: `${pageX}px`,
				top: `${pageY}px`,
				strokeWidth: "0.2rem",
				stroke: color,
				position: 'fixed',
				pointerEvents: 'none',
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
		<ThemeContext.Provider value={isDarkMode}>
			<Menubar>
				<a href="
https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-fc4a63766f2e380f474f09a9aaad99bd1215738076471e240a908f9a7dd57fa9&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code">
					<Button>42</Button>
				</a>
			</Menubar>

			<Toggle className="dark-toggle" onPressedChange={toggleDarkMode}>
				{isDarkMode ? "🌖" : "🌘"}
			</Toggle>
			<div className="game" onMouseMove={handleMouseMove}>
				<Grid />
			</div >
			{Object.entries(cursors).map(([id, cursor]: [string, CursorType], idx) => (
				(socket.id !== id) && <Cursor key={id} pageX={cursor.pageX * window.innerWidth} pageY={cursor.pageY * window.innerHeight} color={visuallyAppealingColors[idx % visuallyAppealingColors.length]} />
			))}
		</ThemeContext.Provider>
	);
}
