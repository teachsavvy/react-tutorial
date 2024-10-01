import React, { useState } from "react";

const Square = ({ value, onSquareClick, row, col }) => {
  return (
    <button
      className="square"
      onClick={() => onSquareClick(row, col)}
    >
      {value}
    </button>
  );
};

const Row = ({ rowIndex, ncols, squares, onSquareClick }) => {
  return (
    <div className="board-row">
      {Array(ncols).fill(null).map((_, colIndex) => (
        <Square
          key={colIndex}
          value={squares[rowIndex][colIndex]}
          onSquareClick={onSquareClick}
          row={rowIndex}
          col={colIndex}
        />
      ))}
    </div>
  );
};

const Board = ({ nrows, ncols, xIsNext, squares, onPlay }) => {
  const handleClick = (row, col) => {
    if (calculateWinner(squares) || squares[row][col]) {
      return;
    }
    const nextSquares = squares.map(row => [...row]);
    nextSquares[row][col] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  };

  const winner = calculateWinner(squares);
  const status = winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O");

  return (
    <div className="board">
      <div className="status">{status}</div>
      {Array(nrows).fill(null).map((_, rowIndex) => (
        <Row
          key={rowIndex}
          rowIndex={rowIndex}
          ncols={ncols}
          squares={squares}
          onSquareClick={handleClick}
        />
      ))}
    </div>
  );
};

const App = () => {
  const [nrows, ncols] = [4, 4];
  const [history, setHistory] = useState([Array(nrows).fill(null).map(() => Array(ncols).fill(null))]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          nrows={nrows}
          ncols={ncols}
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default App;

function calculateWinner(squares) {
  const size = squares.length;
  // rows
  for (let i = 0; i < size; i++) {
    if (squares[i].every(square => square && square === squares[i][0])) {
      return squares[i][0];
    }
  }
  // columns
  for (let i = 0; i < size; i++) {
    if (squares.every(row => row[i] && row[i] === squares[0][i])) {
      return squares[0][i];
    }
  }
  // diagonal(\)
  if (squares.every((row, index) => row[index] && row[index] === squares[0][0])) {
    return squares[0][0];
  }
  // diagonal(/)
  if (squares.every((row, index) => row[size - 1 - index] && row[size - 1 - index] === squares[0][size - 1])) {
    return squares[0][size - 1];
  }

  return null;
}