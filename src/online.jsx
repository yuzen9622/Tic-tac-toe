import React, { useContext, useEffect, useState } from "react";
import { server_url, checkUser } from "./servirce";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";

let renderFrom = ["", "", "", "", "", "", "", "", ""];
/**
 *  線上對戰
 * @returns {React.JSX.Element} Online
 */
export default function Online() {
  /**
   * 狀態變數 useState
   * @type {[Array, Function]} checkBoard - 棋盤狀態，初始值為 renderFrom (空棋盤)。
   * @type {[Object | null, Function]} player - 玩家資訊，初始值為 null。
   * @type {[Object | null, Function]} recipientPlayer - 對手玩家資訊，初始值為 null。
   * @type {[String, Function]} currentPlayer - 當前玩家，初始值為 "O"。
   * @type {[String, Function]} PlayAs - 玩家扮演的角色，初始值為空字串。
   * @type {[String | null, Function]} finish - 遊戲結束狀態，初始值為 null。
   * @type {[Array, Function]} winStatArray - 勝利狀態的棋格索引陣列，初始值為空陣列。
   * @type {[Array | null, Function]} allUsers - 所有玩家資訊，初始值為 null。
   * @type {[Boolean, Function]} disconnect - 對手是否離線，初始值為 false。
   * @type {[Array, Function]} historyCheckBoard - 歷史棋盤狀態，初始值為包含 renderFrom 的陣列。
   */
  const [checkBoard, setCheckBoard] = useState(renderFrom);
  const [player, setplayer] = useState(null);
  const [recipientPlayer, setRecipientPlayer] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("O");
  const [PlayAs, setPlayAs] = useState("");
  const [finish, setFinish] = useState(null);
  const [winStatArray, setWinStateArray] = useState([]);
  const [allUsers, setAllUsers] = useState(null);
  const [disconnect, setDisconnect] = useState(false);
  const [historyCheckBoard, setHistoryCheckBoard] = useState([renderFrom]);
  /**
   * 使用 useContext 取得 UserContext 的值
   *
   * @type {Object} user - 使用者資訊
   * @type {Function} updateLoginInfo - 用來更新登入資訊的函式
   * @type {Object} loginInfo - 登入資訊，來自 UserContext，包含使用者登入的詳細資料。
   * @type {Function} loginUser - 用來執行登入操作的函式
   * @type {Object} socket - 用於與伺服器進行 WebSocket 通訊的物件。
   * @type {Object} errorState - 錯誤訊息，表示在處理過程中出現的錯誤。
   * @type {Object} isLoadingState - 是否正在載入中的狀態，指示當前是否有操作正在進行。
   */
  const {
    user,
    updateLoginInfo,
    loginInfo,
    loginUser,
    socket,
    errorState,
    isLoadingState,
  } = useContext(UserContext);

  /**
   * 棋盤點擊控制
   * @param {Event} e - 點擊事件
   * @param {Number} key - 棋格索引
   */
  const onClickButton = (e, key) => {
    if (finish) return;
    if (currentPlayer !== PlayAs) return;
    if (checkBoard[key] !== "") return;
    if (currentPlayer === "O") {
      setCheckBoard((prev) => {
        const newBoard = [...prev];

        newBoard[key] = "O";
        return newBoard;
      });
    } else {
      setCheckBoard((prev) => {
        const newBoard = [...prev];
        newBoard[key] = "X";
        return newBoard;
      });
    }

    socket.emit("playerMove", {
      state: {
        key: key,
        currentPlayer: currentPlayer,
      },
      recipientPlayer,
    });
    setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
  };

  /**
   *  對手連線
   * @param {String} socketId - socket的Id
   */

  const connectPlayer = async (socketId) => {
    if (!(await checkUser())) return;

    socket?.emit("findPlayer", { userId: user.id, socketId });
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
        checkBoard[a] === "O" &&
        checkBoard[b] === "O" &&
        checkBoard[c] === "O"
      ) {
        winner.winnerArray = combo;
        winner.winner = "O";
      } else if (
        checkBoard[a] === "X" &&
        checkBoard[b] === "X" &&
        checkBoard[c] === "X"
      ) {
        winner.winnerArray = combo;
        winner.winner = "X";
      }
    });
    let isDraw = checkBoard.every((value) => value !== "");
    if (isDraw && !winner.winner) {
      winner.winner = "draw";
    }

    return winner;
  };

  /**
   * 分享遊戲
   */
  const share = async () => {
    if (!navigator.share) return;
    await navigator.share({
      title: "TicTacToe",
      text: "Play with your friends",
      url: "https://yuzen9622.github.io/Tic-tac-toe/",
    });
  };

  // 監聽 "recipientPlayerNotFound" 事件，當找不到對手時設置 recipientPlayer 為 false
  socket?.on("recipientPlayerNotFound", () => {
    setRecipientPlayer(false);
  });

  // 監聽 "recipientPlayerFound" 事件，當對手找到時設置對手名稱和玩家角色
  socket?.on("recipientPlayerFound", (data) => {
    setRecipientPlayer(data.recipientName);
    setPlayAs(data.playingAs);
  });

  // 監聽 "movePlayerFromServer" 事件，當伺服器通知玩家移動時更新棋盤和當前玩家
  socket?.on("movePlayerFromServer", (data) => {
    setCheckBoard((prev) => {
      const newPrev = [...prev];
      newPrev[data.state.key] = data.state.currentPlayer;
      return newPrev;
    });
    setCurrentPlayer(data.state.currentPlayer === "O" ? "X" : "O");
  });

  // 監聽 "allUser" 事件，更新所有線上玩家列表
  socket?.on("allUser", (data) => {
    let users = data?.filter(
      (item) =>
        item.socketId !== socket?.id &&
        item.online === true &&
        item.playerName?.id !== player?.id
    );
    if (users) {
      setAllUsers(users);
    }
  });

  // 監聽 "finishState" 事件，當遊戲結束時處理遊戲結束狀態，並設定勝利者及勝利狀態
  socket?.on("finishState", (data) => {
    setFinish(data.winner);
    setWinStateArray(data.winnerArray);

    setTimeout(() => {
      setCheckBoard(renderFrom);

      setRecipientPlayer(null);
      setFinish(false);
      setCurrentPlayer("O");
      setWinStateArray([]);
    }, 3000);
  });

  // 監聽 "oppentDisconnect" 事件，當對手離線時處理離線狀態
  socket?.on("oppentDisconnect", (data) => {
    console.log("disconnect");
    setDisconnect(true);
    setRecipientPlayer(null);
    setFinish(false);
    setCheckBoard(renderFrom);
    setWinStateArray([]);
    setCurrentPlayer("O");
    setTimeout(() => {
      setDisconnect(false);
    }, 3000);
  });

  useEffect(() => {
    sessionStorage.setItem("hasReloaded", "false");

    if (user?.id) {
      start();
    } else {
      openPop();
    }
  }, [user]);

  /** 在每次棋盤變動時呼叫此函示執行判斷是否勝利 */
  useEffect(() => {
    const winner = checkWinner();
    if (checkBoard.some((item) => item !== "") || winner.winner) {
      setHistoryCheckBoard((prev) => [...prev, checkBoard]);
    }

    if (winner.winner) {
      setWinStateArray(winner.winnerArray);
      setFinish(winner.winner);
      socket.emit("finish", { userId: user.id, recipientPlayer, winner });
      const history = {
        member1: player?.id,
        member2: recipientPlayer?.id,
        gameStatus: checkBoard,
        winner: [
          winner.winner === "draw"
            ? "平手"
            : winner.winner === PlayAs
            ? player?.id
            : recipientPlayer?.id,
          winner.winner,
        ],
        winStatus: winner.winnerArray,
      };
      if (
        winner.winner === PlayAs ||
        (winner.winner === "draw" && checkBoard[8] === PlayAs)
      ) {
        fetch(`${server_url}/history/addHistory`, {
          method: "post",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify(history),
        });
      }

      setTimeout(() => {
        setRecipientPlayer(null);
        setFinish(false);
        setCurrentPlayer("O");
        setCheckBoard(renderFrom);
        setWinStateArray([]);
      }, 3000);
    }
  }, [checkBoard]);

  /**
   * 打開登入視窗
   * @returns {void}
   */

  function openPop() {
    if (!user?.id) {
      let popbox = document.getElementsByClassName("popbox")[0];
      popbox.style.display = "flex";
    } else {
      start();
      closePop();
    }
  }
  function closePop() {
    let popbox = document.getElementsByClassName("popbox")[0];

    popbox.style.display = "none";
  }

  async function start(e) {
    e?.preventDefault();
    try {
      if (!user?.id) {
        let isLogin = await loginUser();
        if (isLogin) {
          closePop();
        }
      } else {
        setplayer(user);

        closePop();
      }
    } catch (error) {
      console.error(error);
      updateLoginInfo({ email: "", password: "" });
      sessionStorage.removeItem("player_info");
    }
  }

  return (
    <div className="online">
      {
        <div
          className="disconnect-popbox"
          style={{ opacity: disconnect ? 1 : 0 }}
        >
          對方已離線
        </div>
      }
      <div className="popbox">
        <form
          onSubmit={(e) => {
            start(e);
          }}
        >
          <h3 style={{ fontSize: "25px", color: "white" }}>Login</h3>

          <input
            type="email"
            value={loginInfo.email}
            placeholder="email"
            required
            onChange={(e) =>
              updateLoginInfo({ ...loginInfo, email: e.target.value })
            }
          />
          <input
            type="password"
            required
            onChange={(e) =>
              updateLoginInfo({ ...loginInfo, password: e.target.value })
            }
            value={loginInfo.password}
            placeholder="password"
          />
          <p className="error">{errorState.login}</p>
          <p className="comment">
            還沒有帳號嗎?<Link to={"/auth/register"}>註冊</Link>
          </p>

          <div className="btn">
            <button type="button" onClick={closePop}>
              取消
            </button>

            <button disabled={isLoadingState.login} type="submit">
              {isLoadingState.login ? "登入中..." : "確認"}
            </button>
          </div>
        </form>
      </div>
      {!user?.id ? (
        <div style={{ position: "relative" }}>
          <div className="mode">
            <button onClick={openPop}>開始</button>
          </div>
        </div>
      ) : recipientPlayer ? (
        <>
          <div className="single">
            <div className="point">
              <div
                className={`player ${
                  PlayAs === currentPlayer && !finish ? "currentState" : ""
                }`}
              >
                <label htmlFor="">{player.name}</label>
              </div>
              <div
                className={`player ${
                  PlayAs !== currentPlayer && !finish ? "currentState" : ""
                }`}
                style={{ backgroundColor: "rgb(227, 36, 43, 0.8)" }}
              >
                <label htmlFor="">{recipientPlayer.name}</label>
              </div>
            </div>
            <div className="game" id="game">
              {checkBoard.map((chess, key) => (
                <button
                  key={key}
                  className={`chess ${
                    winStatArray?.some((item) => item === key) && chess === "O"
                      ? "winInputO"
                      : ""
                  } ${
                    winStatArray?.some((item) => item === key) && chess === "X"
                      ? "winInputX"
                      : ""
                  }`}
                  onClick={(e) => onClickButton(e, key)}
                >
                  {chess}
                </button>
              ))}
            </div>
            <div className="name">
              {finish && finish !== "draw" && (
                <h1>
                  {finish === PlayAs ? player.name : recipientPlayer.name}贏了
                </h1>
              )}
              {finish && finish === "draw" && <h1>平手</h1>}
            </div>
            {currentPlayer === PlayAs && !finish && (
              <div className="name">
                <h1 style={{ color: "rgb(0, 150, 255);" }}>你的回合</h1>
              </div>
            )}
            {currentPlayer !== PlayAs && !finish && (
              <div className="name">
                <h1 style={{ color: "rgb(0, 150, 255);" }}>對方的回合</h1>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="allPlayers">
          {allUsers && allUsers?.length > 0 ? (
            allUsers.map((player, key) => (
              <div key={key} className="players">
                <p>{player.playerName.name}</p>
                {player.playing ? (
                  <p>正在遊戲中...</p>
                ) : (
                  <button
                    disabled={player.playing}
                    onClick={() => connectPlayer(player.socketId)}
                  >
                    決鬥
                  </button>
                )}
              </div>
            ))
          ) : !Array.isArray(allUsers) ? (
            <>
              <div class="loader"></div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div class="no-Player"></div>
              <button className="share-btn" onClick={share}>
                Share
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
