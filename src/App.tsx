import React from "react";
import { Toggle } from "./components/ui/toggle";
import { Button } from "./components/ui/button";
import { useState, useEffect } from "react";
import "./App.css";

interface SquareProps {
  idx: number;
  value: string | null;
  onSquareClick: () => void;
}

function Square({idx, value, onSquareClick }: SquareProps) {

  return (
    <div className={`square _${idx}`} onClick={onSquareClick}>
      {value}
    </div>
  );
}

function Grid() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [xMoves, setXMoves] = useState(Array(0));
  const [oMoves, setOMoves] = useState(Array(0));
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinner(squares[a]);
      }
    }
  }, [squares]);

  function handleSquareClick(idx: number) {
    const newSquares = squares.slice();
    if (newSquares[idx] || winner) {
      return;
    }
    newSquares[idx] = xIsNext ? "X" : "O";
    if (xIsNext) {
      xMoves.push(idx);
      setXMoves(xMoves);
      if (xMoves.length >= 4) {
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
      <div className="grid">
        <div className="status">{winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? "X" : "O"}`}</div>
        {[0, 1, 2].map((row) => (
          <div key={row} className="row">
            {[0, 1, 2].map((col) => {
              const idx = row * 3 + col;
              return <Square key={idx} idx={idx} value={squares[idx]} onSquareClick={() => handleSquareClick(idx)} />;
            })}
          </div>
        ))}
      </div>
      <Button variant="default" size="default" onClick={() => setSquares(Array(9).fill(null))}>
        Reset
      </Button>
    </>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);
  return (
    <>
      <Toggle className="dark-toggle" onPressedChange={() => toggleDarkMode()}>
        {isDarkMode ? "🌖" : "🌘"}
      </Toggle>
      <div className="game">
        <Grid />
      </div>
    </>
  );
}

export default App;
