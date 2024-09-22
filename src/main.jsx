import { useEffect, useState } from "react";
import "./main.css";

const renderFrom = ["", "", "", "", "", "", "", "", ""];

const Gameapp = () => {
  const [chessBoard, setChessBoard] = useState(renderFrom);
  const [Xpoint, setXpoint] = useState(0);
  const [Opoint, setOpoint] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState("O");
  const [finish, setFinish] = useState(null);
  const [finishArrayState, setFinishArrayState] = useState(null);
  const [winner, setWinner] = useState(null);
  const onClickButton = (key) => {
    if (chessBoard[key] !== "") return;
    if (finish) return;
    if (currentPlayer === "O") {
      setChessBoard((prev) => {
        let newPrev = [...prev];
        newPrev[key] = "O";
        return newPrev;
      });
    } else {
      setChessBoard((prev) => {
        let newPrev = [...prev];
        newPrev[key] = "X";
        return newPrev;
      });
    }
    setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
  };

  const checkWinner = () => {
    let winner = { winner: null, winnerArray: [] };
    const winningCombinations = [
      [0, 1, 2],
      [0, 4, 8],
      [2, 4, 6],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];

    winningCombinations.forEach((combo) => {
      const [a, b, c] = combo;
      if (
        chessBoard[a] === "O" &&
        chessBoard[b] === "O" &&
        chessBoard[c] === "O"
      ) {
        winner.winnerArray = combo;
        winner.winner = "O";
      } else if (
        chessBoard[a] === "X" &&
        chessBoard[b] === "X" &&
        chessBoard[c] === "X"
      ) {
        winner.winnerArray = combo;
        winner.winner = "X";
      }
    });

    let isDraw = chessBoard.every((value) => value !== "");
    if (isDraw && !winner.winner) {
      winner.winner = "draw";
    }

    return winner;
  };

  useEffect(() => {
    const { winner, winnerArray } = checkWinner();

    if (winner) {
      if (winner === "O") {
        setOpoint((prev) => prev + 1);
      } else if (winner === "X") {
        setXpoint((prev) => prev + 1);
      }

      setFinish(winner);
      setFinishArrayState(winnerArray);
      setTimeout(() => {
        setFinish(null);
        setFinishArrayState(null);
        setChessBoard(renderFrom);
        setCurrentPlayer("O");
      }, 3000);
    }
  }, [chessBoard]);

  useEffect(() => {
    if (Xpoint === 2) {
      setWinner("X");
      setTimeout(() => {
        setXpoint(0);
        setOpoint(0);
        setWinner(null);
      }, 3000);
    } else if (Opoint === 2) {
      setWinner("O");
      setTimeout(() => {
        setXpoint(0);
        setOpoint(0);
        setWinner(null);
      }, 3000);
    }
  }, [Xpoint, Opoint]);

  useEffect(() => {
    let body = document.body;
    let stateEl = document.querySelector("#state");
    if (finish) {
      body.style.backgroundColor =
        finish === "O" ? "#1338becc" : "rgba(227, 36, 43, 0.8)";

      stateEl.style.color = finish === "O" ? "#0096ff" : "rgb(233, 116, 81)";
      return;
    }
    body.style.backgroundColor =
      currentPlayer === "O" ? "#1338becc" : "rgba(227, 36, 43, 0.8)";
    stateEl.style.color =
      currentPlayer === "O" ? "#0096ff" : "rgb(233, 116, 81)";
  }, [currentPlayer, finish]);

  return (
    <div className="single">
      <div className="point">
        <div className="ox">
          <label htmlFor="">Blue:</label>
          <input type="text" readOnly value={Opoint} />
        </div>
        <div className="ox">
          <label htmlFor="">Red:</label>
          <input type="text" readOnly value={Xpoint} />
        </div>
      </div>
      <div className="game" id="game">
        {!winner &&
          chessBoard.map((chess, key) => (
            <button
              key={key}
              id="box"
              className={`chess ${
                finishArrayState &&
                finishArrayState.some((item) => item === key) &&
                chess === "O"
                  ? "winInputO"
                  : ""
              } ${
                finishArrayState &&
                finishArrayState.some((item) => item === key) &&
                chess === "X"
                  ? "winInputX"
                  : ""
              }`}
              onClick={() => onClickButton(key)}
            >
              {chess}
            </button>
          ))}
      </div>

      <div className="name" id="state">
        {!finish && !winner && (
          <h1>{currentPlayer === "O" ? "Blue Time" : "Red Time"}</h1>
        )}
        {finish && finish !== "draw" && !winner && (
          <h1>{finish === "O" ? "O 贏了" : "X 贏了"}</h1>
        )}
        {finish && finish === "draw" && !winner && <h1>平手</h1>}
        {winner && <h1>{winner === "O" ? "Blue Win" : "Red Win"}</h1>}
      </div>
    </div>
  );
};
export default Gameapp;
