import React from 'react';
import { Toggle } from "./components/ui/toggle"
import { Button } from "./components/ui/button"
import { useState, useEffect}  from 'react';
import './App.css';

interface SquareProps {
	value: string | null;
	onSquareClick: () => void;
}

function Square({value, onSquareClick}: SquareProps) {
	return (
		<div
		className="square"
		onClick={onSquareClick}
		>
			{value}
		</div>
	)
}


function Grid() {
	const [squares, setSquares] = useState(Array(9).fill(null));
	const [xIsNext, setXIsNext] = useState(true);
	const [xMoves, setXMoves] = useState(Array(0));
	const [oMoves, setOMoves] = useState(Array(0));
	const [winner, setWinner] = useState<string | null>(null);

	useEffect(() => {
		const lines = [
			[0, 1, 2], [3, 4, 5], [6, 7, 8],	// rows
			[0, 3, 6], [1, 4, 7], [2, 5, 8],	// columns
			[0, 4, 8], [2, 4, 6] 							// diagonals
		];
		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (squares[a]
				&& squares[a] === squares[b]
				&& squares[a] === squares[c]) {
				setWinner(squares[a]);
			}
		}
	}, [squares]);

	function handleSquareClick(idx: number) {
		const newSquares = squares.slice();
		if (newSquares[idx] || winner) {
			return;
		}
		newSquares[idx] = xIsNext ? 'X' : 'O';
		if (xIsNext) {
			xMoves.push(idx);
			setXMoves(xMoves);
			if (xMoves.length >= 4 ) {
				newSquares[xMoves[xMoves.length - 4]] = null;
			}
		} else {
			oMoves.push(idx);
			setOMoves(oMoves);
			if (oMoves.length >= 4) {
				newSquares[oMoves[oMoves.length - 4]] = null;
			}
		}
		setXIsNext(!xIsNext);
		setSquares(newSquares);
	}
	return (
		<>
			<div className="status">
				{winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`}
			</div>
			<div className="row">
				<Square value={squares[0]} onSquareClick={() => handleSquareClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleSquareClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleSquareClick(2)} />
			</div>
			<div className="row">
				<Square value={squares[3]} onSquareClick={() => handleSquareClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleSquareClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleSquareClick(5)} />
			</div>
			<div className="row">
				<Square value={squares[6]} onSquareClick={() => handleSquareClick(6)} />
				<Square value={squares[7]} onSquareClick={() => handleSquareClick(7)} />
				<Square value={squares[8]} onSquareClick={() => handleSquareClick(8)} />
			</div>

		</>
	)
}

function App() {
  return (
		<>
		<Toggle> Toggle </Toggle>
		<Button> Button </Button>
    <div className="app">
			<Grid/>
    </div>
		</>
  );
}

export default App;
