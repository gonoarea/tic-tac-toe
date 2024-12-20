import React from 'react';
import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinningSquare }) {
  const className:string = isWinningSquare ? 'square winning' : 'square';  // 追加
  return (
    <button className={className} onClick={onSquareClick}> 
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner:any = calculateWinner(squares);
  const winningLine:any = winner ? winner.winningLine : null;  // 追加
  let status:string;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i:number) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, { row, col });
  }

  const row: Array<number> = [0, 1, 2];
  const col: Array<number> = [0, 1, 2];

  return (
    <>
      <div className="status">{status}</div>
      {col.map((j:number) => (
        <div key={j} className="board-row">
          {row.map((i:number) => (
            <Square
              key={i}
              value={squares[i * 3 + j]}
              onSquareClick={() => handleClick(i * 3 + j)}
              isWinningSquare={winningLine && winningLine.includes(i * 3 + j)}  // 追加
          />
          ))}
        </div>
      ))}

    </>
  );
}

function calculateWinner(squares:number[]) {
  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i:number = 0; i < lines.length; i++) {
    const [a, b, c]:Array<number> = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], winningLine: lines[i]};
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), position: null }]); // ←マスの位置を受け取れるように修正
  const [currentMove, setCurrentMove] = useState(0);//現在ユーザが見ているのが何番目の着手であるのかを管理させる
  const [isAscending, setIsAscending] = useState(true);  //←追加
  const xIsNext:boolean = currentMove % 2 === 0;
  const currentSquares:Array<string> = history[currentMove].squares;

  function handlePlay(nextSquares:Array<string>, position) {
    const nextHistory:any = [...history.slice(0, currentMove + 1), { squares: nextSquares, position }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove:number) {
    setCurrentMove(nextMove);
  }

  const moves:Array<number> = history.map((step, move:number) => {
    const { row, col } = step.position || {};  // position が存在しない場合に備えて、デフォルト値を設定
    let description:string;
    if (move === currentMove) {
      description = "You are at move #" + move+ ` (row: ${row}, col: ${col})`;
    } else if (move > 0) {
      description = 'Go to move #' + move + ` (row: ${row}, col: ${col})`;
    } else {
      description = 'Go to game start';
    }
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function toggleSortOrder() {
    setIsAscending(!isAscending);  //←状態を切り替え
  }

  const sortedMoves: Array<number> = isAscending ? moves : moves.slice().reverse();  //←正の順で並べるか、逆の順で並べるか
  const sortedtext: string = isAscending ? "昇順" : "降順"; 

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="toggle-button"  onClick={toggleSortOrder}>{sortedtext}</button>
        <ol className="game-info-list">{sortedMoves}</ol>
      </div>
    </div>
  );
}
