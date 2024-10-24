import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { server_url, url } from "./servirce";
import { useLocation } from "react-router-dom";
let renderFrom = ["", "", "", "", "", "", "", "", ""];

export default function Online() {
  const sessonPlayer =
    sessionStorage.getItem("player_info") &&
    JSON.parse(sessionStorage.getItem("player_info"));
  const [checkBoard, setCheckBoard] = useState(renderFrom);
  const [player, setplayer] = useState(null);
  const [recipientPlayer, setRecipientPlayer] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("O");
  const [PlayAs, setPlayAs] = useState("");
  const [finish, setFinish] = useState(null);
  const [winStatArray, setWinStateArray] = useState([]);
  const [socket, setSocket] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [user, setUser] = useState(
    sessionStorage.getItem("player_info")
      ? {
          name: sessonPlayer.name,
          email: sessonPlayer.email,
        }
      : {
          name: "",
          email: "",
        }
  );

  const [error, setError] = useState("");

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
    });
    setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
  };

  const connectPlayer = (socketId) => {
    socket?.emit("findPlayer", socketId);
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
  const share = async () => {
    await navigator.share({
      title: "TicTacToe",
      text: "Play with your friends",
      url: "https://yuzen9622.github.io/Tic-tac-toe/",
    });
  };

  socket?.on("recipientPlayerNotFound", () => {
    setRecipientPlayer(false);
  });

  socket?.on("recipientPlayerFound", (data) => {
    setRecipientPlayer(data.recipientName);
    setPlayAs(data.playingAs);
  });

  socket?.on("movePlayerFromServer", (data) => {
    setCheckBoard((prev) => {
      const newPrev = [...prev];
      newPrev[data.state.key] = data.state.currentPlayer;
      return newPrev;
    });
    setCurrentPlayer(data.state.currentPlayer === "O" ? "X" : "O");
  });

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

  useEffect(() => {
    sessionStorage.setItem("hasReloaded", "false");

    if (user.name) {
      start();
    } else {
      openPop();
    }
  }, []);

  useEffect(() => {
    const winner = checkWinner();

    if (winner.winner) {
      setWinStateArray(winner.winnerArray);
      setFinish(winner.winner);
      socket.emit("finish", winner);
      const history = {
        member1: player.id,
        member2: recipientPlayer.id,
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

  function openPop() {
    if (!sessonPlayer?.id) {
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

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  async function start() {
    try {
      if (!validateEmail(user.email)) {
        setError("請輸入合法電子郵件!");
        return;
      }
      if (user.name === "") {
        setError("不可為空白");
        return;
      }
      const res = await fetch(`${server_url}/user/login`, {
        method: "post",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("player_info", JSON.stringify(data));
        setplayer(data);
        const newSocket = io(url, {
          autoConnect: true,
        });
        newSocket?.emit("join", { playerName: data });
        setSocket(newSocket);
        closePop();
      } else {
        setError(data?.message);
        sessionStorage.removeItem("player_info");
      }
    } catch (error) {
      console.error(error);
      setUser({
        name: "",
        email: "",
      });
      sessionStorage.removeItem("player_info");
    } finally {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }

  return (
    <div className="online">
      <div className="popbox">
        <h3 style={{ fontSize: "25px", color: "white" }}>Register / Login</h3>
        <input
          type="text"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          value={user.name}
          placeholder="name"
        />
        <input
          type="email"
          value={user.email}
          placeholder="email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <p className="error">{error}</p>
        <div className="btn">
          <button onClick={closePop}>取消</button>
          <button onClick={start}>確認</button>
        </div>
      </div>
      {!player?.id ? (
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
                  PlayAs === currentPlayer ? "currentState" : ""
                }`}
              >
                <label htmlFor="">{player.name}</label>
              </div>
              <div
                className={`player ${
                  PlayAs !== currentPlayer ? "currentState" : ""
                }`}
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
                <h1 style={{ color: "rgb(0, 150, 255);" }}>Your Turn</h1>
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
