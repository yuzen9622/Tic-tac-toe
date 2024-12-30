import { useEffect, useState } from "react";
import "./main.css";
import { AI_server_url } from "./servirce";
const renderFrom = ["", "", "", "", "", "", "", "", ""];
/**
 *  線上對戰
 * @returns {React.JSX.Element} AIonline
 */
const AIonline = () => {
  /**
   * 狀態變數：
   * @type {[Array, Function]} chessBoard - 棋盤狀態，初始值為 renderFrom (空棋盤)。
   * @type {[Number, Function]} Xpoint - 玩家 X 的分數，初始值為 0。
   * @type {[Number, Function]} Opoint - 玩家 O 的分數，初始值為 0。
   * @type {[String, Function]} currentPlayer - 當前玩家，初始值為 "O"，代表玩家 O 先開始。
   * @type {[String | null, Function]} finish - 遊戲結束狀態，初始值為 null，表示遊戲尚未結束；可能值為 "X"、"O" 或 "draw"。
   * @type {[Array | null, Function]} finishArrayState - 獲勝的棋盤組合，初始值為 null；獲勝時為棋格索引陣列，例如 [0, 1, 2]。
   * @type {[String | null, Function]} winner - 總勝利玩家，初始值為 null，表示遊戲尚未有最終贏家；可能值為 "X" 或 "O"。
   */
  const [chessBoard, setChessBoard] = useState(renderFrom);
  const [Xpoint, setXpoint] = useState(0);
  const [Opoint, setOpoint] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState("O");
  const [finish, setFinish] = useState(null);
  const [finishArrayState, setFinishArrayState] = useState(null);
  const [winner, setWinner] = useState(null);

  /**
   * AI 執行下一步棋
   * @param {string[]} board - 當前棋盤狀態
   * @returns {Promise<void>}
   */
  const onAImove = async (board) => {
    if (!board) return;
    if (currentPlayer === "X") {
      try {
        const res = await fetch(`${AI_server_url}/play`, {
          method: "POST",
          body: JSON.stringify({ board: board }),
        });
        const data = await res.json();
        if (data && res.ok) {
          if (data?.position && chessBoard[data?.position] === "") {
            setChessBoard((prev) => {
              let newPrev = [...prev];
              newPrev[data.position-1] = "X";
              return newPrev;
            });
            setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
          } else {
            onAImove(board);
            return;
          }
        } else {
          throw new Error("AI limit");
        }
      } catch (error) {
        if (error) {
          alert(error);
          window.location.reload();
        }

        console.log(error);
      }
    }
  };

  /**
   * 玩家點擊棋盤按鈕的事件
   * @param {number} key - 棋盤的按鈕索引
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
    }
    setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
  };
  /**
   * 檢查棋局是否有贏家或平局
   * @returns {{winner: string | null, winnerArray: number[]}} 贏家和獲勝組合
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

    let isDraw = chessBoard.every((value) => value !== "" && value !== null);
    if (isDraw && !winner.winner) {
      winner.winner = "draw";
    }

    return winner;
  };
  // 檢測棋盤狀態變化，更新遊戲邏輯
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
    } else {
      onAImove(chessBoard);
    }
  }, [chessBoard]);
  // 檢查是否達到獲勝條件
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
  // 動態更新頁面樣式
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
          <label htmlFor="">You:</label>
          <input type="text" readOnly value={Opoint} />
        </div>
        <div className="ox">
          <label htmlFor="">AI:</label>
          <input type="text" readOnly value={Xpoint} />
        </div>
      </div>
      <div className="game" id="game">
        {!winner &&
          chessBoard.map((chess, key) => (
            <button
              key={key}
              id="box"
              disabled={currentPlayer === "O" ? false : true}
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
          <h1>{currentPlayer === "O" ? "Your Time" : "AI Time"}</h1>
        )}
        {finish && finish !== "draw" && !winner && (
          <h1>{finish === "O" ? "你贏了" : "AI 贏了"}</h1>
        )}
        {finish && finish === "draw" && !winner && <h1>平手</h1>}
        {winner && <h1>{winner === "O" ? "YOU Win" : "AI Win"}</h1>}
      </div>
    </div>
  );
};
export default AIonline;
