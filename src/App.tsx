import React from "react";
import { ReactComponent as CursorLogo } from "./icons8-cursor.svg"
import { Toggle } from "./components/ui/toggle";
import { Button } from "./components/ui/button"
import { Menubar, MenubarItem, MenubarMenu, MenubarContent, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "./components/ui/menubar"
import Grid from "./Grid"
import { useState, useEffect, createContext, useContext, useRef } from "react";
import "./App.css";
import { socket } from ".";

const authLink = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-fc4a63766f2e380f474f09a9aaad99bd1215738076471e240a908f9a7dd57fa9&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code";

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


const ThemeContext = createContext(true);

interface ChatBubbleProps {
	message?: string;
	pageX: number;
	pageY: number;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, pageX, pageY }) => {
	// const isDarkMode = useContext(ThemeContext);

	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (message) {
			// Show the chat bubble when a message is received
			setIsVisible(true);
			// Set a timeout to hide the bubble after 2 seconds
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 4500); // Adjust duration as needed

			// Cleanup function to clear timeout if component unmounts or message changes
			return () => clearTimeout(timer);
		}
	}, [message]);

	return (
		<div
			className={`chat-bubble ${!isVisible ? 'fade-out' : ''}`}
			style={{
				position: 'fixed',
				height: "auto",
				left: `${pageX}px`,
				top: `${pageY}px`,
				transform: 'translate(-50%, -100%)', // Center above the cursor
				backgroundColor: 'rgba(255, 255, 255, 0.9)',
				color: 'black',
				borderRadius: '8px',
				padding: '5px 10px',
				boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
				pointerEvents: 'none', // Prevent mouse events
				opacity: isVisible ? 1 : 0,
				transition: 'opacity 0.5s ease-in-out', // Transition for fading effect
			}}
		>
			{message}
		</div>
	);
};

const Cursor = ({ pageX, pageY, color }: CursorType) => {
	// const isDarkMode = useContext(ThemeContext);
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
	message?: string;
	color: string;
}

interface CursorMap {
	[id: string]: CursorType;
}

export default function App() {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [cursors, setCursors] = useState<CursorMap>({});
	const [currMsg, setCurrMsg] = useState("");
	let timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const toggleDarkMode = () => {
		document.startViewTransition(() => {
			const nextMode = !isDarkMode;
			setIsDarkMode(nextMode);
			document.body.classList.toggle("dark", nextMode);
		});
	};

	const handleMouseMove = (ev: React.MouseEvent) => {
		let { pageX, pageY } = ev;
		// console.log(ev);
		pageX = pageX / window.innerWidth;
		pageY = pageY / window.innerHeight;
		// console.log({ pageX, pageY })
		socket.emit('mouseMove', { pageX, pageY, message: currMsg });
	}

	useEffect(() => {
		const handleBroadcast = (cursors: CursorMap) => {
			// console.log("received broadcast:", cursors)
			setCursors(cursors);
			// console.log(cursors);
		}
		socket.on('mouseMove', handleBroadcast);

		return () => {
			socket.off('mouseMove', handleBroadcast);
		}
	})

	useEffect(() => {
		const handleMessage = (msg: CursorMap) => {
			// console.log(msg);
			setCursors(msg);
		};

		socket.on('msg', handleMessage);

		// Cleanup function to remove listener
		return () => {
			socket.off('msg', handleMessage);
		};
	}, []); // Empty dependency array means this runs once on mount and cleanup on unmount

	const handleKeyDown = (ev: React.KeyboardEvent) => {
		// ev.preventDefault();
		const key = ev.key;
		// console.log({ key });
		let nextMsg = currMsg;
		if (key === "Backspace" && currMsg.length) {
			nextMsg = nextMsg.slice(0, nextMsg.length - 1);
		}
		else if (key === "Enter") {
			nextMsg += '\n'
		}
		else if (key.length === 1) {
			nextMsg += key;
		}
		else
			return;
		console.log({ nextMsg });
		setCurrMsg(nextMsg);
		socket.emit("msg", { msg: nextMsg });
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			setCurrMsg("");
			socket.emit("msg", "");
			timeoutRef.current = null;
		}, 5000);
	}

	return (
		<ThemeContext.Provider value={isDarkMode}>
			<>
				<Menubar className="justify-between">
					<a href={authLink}>
						<Button>42</Button>
					</a>
					<div className="flex flex-row-reverse">
						<Toggle className="dark-toggle" onPressedChange={toggleDarkMode}>
							{isDarkMode ? "🌖" : "🌘"}
						</Toggle>
					</div>
				</Menubar>
				<canvas
					tabIndex={0}
					onKeyDown={handleKeyDown}
					className="h-full"
					onMouseMove={handleMouseMove}
				>
				</canvas>
				{/* <div className="game">
					<Grid />
				</div > */}
				{Object.entries(cursors).map(([id, cursor]: [string, CursorType], idx) => (
					<>
						{socket.id !== id && (
							<Cursor
								key={id}
								pageX={cursor.pageX * window.innerWidth}
								pageY={cursor.pageY * window.innerHeight}
								color={visuallyAppealingColors[idx % visuallyAppealingColors.length]}
							/>
						)}
						<ChatBubble
							message={cursor.message}
							pageX={cursor.pageX * window.innerWidth}
							pageY={cursor.pageY * window.innerHeight}
						></ChatBubble>
					</>
				))}
			</>
		</ThemeContext.Provider >
	);
}
