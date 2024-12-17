import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./history.css";
import { server_url } from "./servirce";
export default function HistoryComponet({ historyItem, user }) {
  const [recipientPlayer, setRecipientPlayer] = useState(null);
  const [winStateArray, setWinStateArray] = useState(historyItem?.winStatus);
  const [checkBoard, setCheckBoard] = useState(historyItem?.gameStatus);
  const fetchUser = async () => {
    setRecipientPlayer(null);
    try {
      let recipinetPlayerId =
        historyItem?.member1 === user?.id
          ? historyItem?.member2
          : historyItem?.member1;
      const res = await fetch(`${server_url}/user/id?id=${recipinetPlayerId}`, {
        method: "get",
        headers: { "Content-Type": "Application/json" },
      });
      if (res.ok) {
        const data = await res.json();

        setRecipientPlayer(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function formatDateTime(utcTime) {
    const date = new Date(utcTime);
    date.setHours(date.getHours() + 8);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    fetchUser();
    setWinStateArray(historyItem?.winStatus);
    setCheckBoard(historyItem?.gameStatus);
  }, [historyItem, user]);

  return (
    recipientPlayer && (
      <div className="historyCom">
        <div className="history-main">
          <NavLink to="/history">
            <i class="fa-solid fa-xmark"></i>
          </NavLink>
          <div className="history-players">
            <p
              style={{
                fontWeight: 600,
                fontSize: "1.5em",
                ...(historyItem?.winner[1] !== "draw" &&
                parseInt(historyItem?.winner[0]) === user?.id
                  ? { color: "#99cfff  " }
                  : { color: "#e3242b" }),
                ...(historyItem?.winner[1] === "draw" && { color: "#333" }),
              }}
            >
              {historyItem?.winner[1] === "draw" && "平手"}
              {historyItem?.winner[1] !== "draw" &&
                parseInt(historyItem?.winner[0]) === user?.id &&
                "勝利"}
              {historyItem?.winner[1] !== "draw" &&
                parseInt(historyItem?.winner[0]) !== user?.id &&
                "失敗"}
            </p>
            <p className="recipientPlayer"> {recipientPlayer?.name}</p>
            {historyItem?.winner[1] !== "draw" && (
              <div className="winner">
                {parseInt(historyItem?.winner[0]) === recipientPlayer?.id
                  ? "贏家:" + recipientPlayer?.name
                  : "贏家:你"}
                {` 狀態:${historyItem?.winner[1]}`}
              </div>
            )}
            <div className="time">{formatDateTime(historyItem?.date)}</div>
          </div>
          <div className="history-state">
            <div className="state game">
              {checkBoard.map((chess, key) => (
                <button
                  key={key}
                  className={`chess ${
                    winStateArray?.some((item) => parseInt(item) === key) &&
                    historyItem?.winner[1] !== "draw" &&
                    parseInt(historyItem?.winner[0]) === user?.id &&
                    "winInputO"
                  } ${
                    winStateArray?.some((item) => parseInt(item) === key) &&
                    historyItem?.winner[1] !== "draw" &&
                    parseInt(historyItem?.winner[0]) !== user?.id &&
                    "winInputX"
                  } `}
                >
                  {chess}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
