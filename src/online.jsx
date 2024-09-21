import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";
import { url } from "./servirce";
let renderFrom = ["", "", "", "", "", "", "", "", ""];

export default function Online() {
  const [checkBoard, setCheckBoard] = useState(renderFrom);
  const [player, setplayer] = useState(null);
  const [recipientPlayer, setRecipientPlayer] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("O");
  const [PlayAs, setPlayAs] = useState("");
  const [finish, setFinish] = useState(null);
  const [winStatArray, setWinStateArray] = useState([]);
  const [socket, setSocket] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
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
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
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
    console.log("data from server", data);
    setCheckBoard((prev) => {
      const newPrev = [...prev];
      newPrev[data.state.key] = currentPlayer;
      return newPrev;
    });
    setCurrentPlayer(data.state.currentPlayer === "O" ? "X" : "O");
  });

  socket?.on("allUser", (data) => {
    console.log(data);
    let users = data?.filter(
      (item) => item.socketId !== socket.id && item.online === true
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
    const winner = checkWinner();

    if (winner.winner) {
      setFinish(winner.winner);
      socket.emit("finish", winner);
      setWinStateArray(winner.winnerArray);
      console.log(winner.winnerArray);
      setTimeout(() => {
        setRecipientPlayer(null);
        setFinish(false);
        setCurrentPlayer("O");
        setCheckBoard(renderFrom);
        setWinStateArray([]);
      }, 3000);
    }
  }, [checkBoard]);

  function getName() {
    let name = window.prompt("輸入名子");
    if (name) {
      setplayer(name);
      const newSocket = io(url, {
        autoConnect: true,
      });
      newSocket?.emit("join", { playerName: name });
      setSocket(newSocket);
    }
  }

  return (
    <div>
      {!player ? (
        <div className="mode">
          <button onClick={getName}>開始</button>
        </div>
      ) : recipientPlayer ? (
        <>
          <div className="point">
            <div
              className={`player ${
                PlayAs === currentPlayer ? "currentState" : ""
              }`}
            >
              <label htmlFor="">{player}</label>
            </div>
            <div
              className={`player ${
                PlayAs !== currentPlayer ? "currentState" : ""
              }`}
            >
              <label htmlFor="">{recipientPlayer}</label>
            </div>
          </div>
          <div className="single">
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
          </div>
          <div className="name">
            {finish && finish !== "draw" && (
              <h1>{finish === PlayAs ? player : recipientPlayer}贏了</h1>
            )}
            {finish && finish === "draw" && <h1>平手</h1>}
          </div>
          {currentPlayer === PlayAs && !finish && (
            <div className="name">
              <h1>Your Turn</h1>
            </div>
          )}
        </>
      ) : (
        <div className="allPlayers">
          {allUsers && allUsers?.length > 0 ? (
            allUsers.map((player, key) => (
              <div key={key} className="players">
                <p>{player.playerName}</p>
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
