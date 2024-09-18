import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { io } from "socket.io-client";

let renderFrom = ["", "", "", "", "", "", "", "", ""];

export default function Online() {
  const [checkBoard, setCheckBoard] = useState(renderFrom);
  const [player, setplayer] = useState(null);
  const [recipientPlayer, setRecipientPlayer] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("O");
  const [PlayAs, setPlayAs] = useState("");
  const [finish, setFinish] = useState(null);

  const [socket, setSocket] = useState(null);

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

  const checkWinner = () => {
    let winner = false;
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
        winner = "O";
      } else if (
        checkBoard[a] === "X" &&
        checkBoard[b] === "X" &&
        checkBoard[c] === "X"
      ) {
        winner = "X";
      }
    });
    let isDraw = checkBoard.every((value) => value !== "");
    if (isDraw) {
      winner = "draw";
    }

    return winner;
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

  socket?.on("finishState", (data) => {
    setFinish(data.winner);
    setCheckBoard(renderFrom);
    setplayer(null);
    setRecipientPlayer(null);
  });

  useEffect(() => {
    const winner = checkWinner();

    if (winner) {
      setFinish(winner);
      socket.emit("finish", { winner });
      setCheckBoard(renderFrom);
      setplayer(null);
      setRecipientPlayer(null);
    }
  }, [checkBoard]);

  function getName() {
    let name = window.prompt("輸入名子");
    if (name) {
      setplayer(name);
      const newSocket = io("http://localhost:8080", {
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
                <input
                  key={key}
                  type="button"
                  className="chess"
                  value={chess}
                  onClick={(e) => onClickButton(e, key)}
                />
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
        <>connect...</>
      )}
    </div>
  );
}
