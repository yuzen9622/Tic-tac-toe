import { useEffect, useState } from "react";
import "./main.css";

const renderFrom = ["", "", "", "", "", "", "", "", ""];

/**
 * 單人遊戲
 * @returns {React.JSX.Element} Gameapp
 */
const Gameapp = () => {
  /**
   * 狀態變數
   * @type {Array} chessBoard 棋盤狀態，每個格子保存 "O"、"X" 或空字串。
   * @type {number} Xpoint X 玩家得分。
   * @type {number} Opoint O 玩家得分。
   * @type {string} currentPlayer 當前玩家的標記，"O" 或 "X"。
   * @type {string|null} finish 遊戲結束狀態，"O"、"X" 或 null。
   * @type {Array|null} finishArrayState 勝利的棋盤格組合。
   * @type {string|null} winner 優勝者，"O"、"X" 或 "draw"。
   */
  const [chessBoard, setChessBoard] = useState(renderFrom);
  const [Xpoint, setXpoint] = useState(0);
  const [Opoint, setOpoint] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState("O");
  const [finish, setFinish] = useState(null);
  const [finishArrayState, setFinishArrayState] = useState(null);
  const [winner, setWinner] = useState(null);
  /**
   * 處理玩家點擊棋盤上的按鈕，更新棋盤並切換玩家。
   *
   * @param {number} key 被點擊的棋盤格子索引。
   */
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

  /**
   * 檢查遊戲是否有獲勝者或平手。
   *
   * @returns {Object} 包含獲勝者及獲勝的格子組合。
   * @returns {string|null} winner "O"、"X" 或 "draw"。
   * @returns {Array} winnerArray 獲勝的格子索引組合。
   */
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

  /**
   * 在棋盤狀態改變時，檢查是否有勝利。
   */
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

  /**
   * 在得分變化時檢查是否有玩家贏得比賽，並重置得分。
   */
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

  /**
   * 根據當前玩家或遊戲結束狀態改變背景顏色和文字顏色。
   */
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
