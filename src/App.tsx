import React from "react";
import { Toggle } from "./components/ui/toggle";
import { Button } from "./components/ui/button";
import { useState } from "react";
import JSConfetti from "js-confetti";
import classnames from "classnames";
import "./App.css";

interface SquareProps {
	idx: number;
	turn: boolean
	gameOver: boolean;
	value: 'X' | 'O' | null;
	onSquareClick: () => void;
}

function Square({ idx, value, turn, gameOver, onSquareClick }: SquareProps) {
	const next = turn ? "X" : "O";
	return (
		<div className={
			classnames({
				square: true,
				hover: !value && !gameOver,
				"text-transparent": !value,
				"rounded-tl-xl": idx === 0,
				"rounded-tr-xl": idx === 2,
				"rounded-bl-xl": idx === 6,
				"rounded-br-xl": idx === 8,
				"text-red-400": value === "X",
				"text-blue-400": value === "O",
			})}
			onClick={onSquareClick}>
			{value ? value : next}
		</div>
	);
}

function Grid() {
	const [squares, setSquares] = useState(Array(9).fill(null));
	const [xIsNext, setXIsNext] = useState(true);
	const [xMoves, setXMoves] = useState(Array(0));
	const [oMoves, setOMoves] = useState(Array(0));
	const [winner, setWinner] = useState<string | null>(null);


	const checkWins = (newSquares: Array<string>) => {
		const valid_wins = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		for (let i = 0; i < valid_wins.length; i++) {
			const [a, b, c] = valid_wins[i];
			if (newSquares[a] && newSquares[a] === newSquares[b] && newSquares[a] === newSquares[c]) {
				setWinner(newSquares[a]);
				const confetti = new JSConfetti();
				confetti.addConfetti();
				break;
			}
		}
	};

	function handleSquareClick(idx: number) {
		const newSquares = squares.slice();
		if (newSquares[idx] || winner) {
			return;
		}
		newSquares[idx] = xIsNext ? "X" : "O";
		if (xIsNext) {
			const xMovesCopy = xMoves.slice();
			xMovesCopy.push(idx);
			if (xMovesCopy.length >= 4) {
				newSquares[xMovesCopy[xMovesCopy.length - 4]] = null;
			}
			setXMoves(xMovesCopy);
		} else {
			const oMovesCopy = oMoves.slice();
			oMovesCopy.push(idx);
			if (oMovesCopy.length >= 4) {
				newSquares[oMovesCopy[oMovesCopy.length - 4]] = null;
			}
			setOMoves(oMovesCopy);
		}
		setXIsNext(!xIsNext);
		setSquares(newSquares);
		checkWins(newSquares);
	}

	const reset = () => {
		setXIsNext(true);
		setXMoves(Array(0));
		setOMoves(Array(0));
		setWinner(null);
		document.startViewTransition(() => {
			setSquares(Array(9).fill(null));
		})
	}
	return (
		<>
			<h2 className="font-mono text-2xl text-amber-500">Tic Tac Two</h2>
			<div className="flex flex-col justify-center items-center;">
				{[0, 1, 2].map((row) => (
					<div key={row} className="flex justify-center;">
						{[0, 1, 2].map((col) => {
							const idx = row * 3 + col;
							return <Square
								key={idx}
								idx={idx}
								value={squares[idx]}
								gameOver={!!winner}
								turn={xIsNext}
								onSquareClick={() => handleSquareClick(idx)}
							/>;
						})}
					</div>
				))}
			</div>
			<Button
				variant="default"
				size="default"
				disabled={!winner}
				className={`reset ${winner ? "visible" : "invisible"}`}
				onClick={reset}>
				Reset
			</Button>
		</>
	);
}

function App() {
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

export default App;
